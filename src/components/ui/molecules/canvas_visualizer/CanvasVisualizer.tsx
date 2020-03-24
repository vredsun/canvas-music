import * as React from 'react';
import { isNull } from 'util';
import { useSelector } from 'vs-react-store';

import { PLAYER_STATE } from 'constants/play_state';
import { selectVolume, selectMultiply, selectUnionBlocks, selectStateOfPlay, selectIsFading } from 'store/selectors';
import styled from 'styled-components';

const Canvas = styled.canvas`
  width: 100%;
  height: 100%;
`;

function resize(canvas) {
  // Lookup the size the browser is displaying the canvas.
  var displayWidth  = canvas.clientWidth;
  var displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth
      || canvas.height != displayHeight) {

    // Make the canvas the same size
    canvas.width  = displayWidth;
    canvas.height = displayHeight;
  }
}

const getYValue = (index: number, countIndex: number, startAngle: number) => {
  return Math.sin(startAngle + 2 * Math.PI / countIndex * index);
};

const getXValue = (index: number, countIndex: number, startAngle: number) => {
  return Math.cos(startAngle + 2 * Math.PI / countIndex * index);
};

const normalizeValueByRadius = (value: number, radius: number) => {
  return Math.min(radius - 10, Math.max(0, radius / 2 - Math.floor((value - 128) / 256 * radius)));
};

const getFuncGetCoordByLineData = (getCoorValue: (index: number, countIndex: number, startAngle: number) => number) => (radius: number, index: number, countIndex: number, value: number, startAngle: number) => {
  return getCoorValue(index, countIndex, startAngle) * normalizeValueByRadius(value, radius);
};

const getXByLineData = getFuncGetCoordByLineData(getXValue);
const getYByLineData = getFuncGetCoordByLineData(getYValue);

const drawCircle = (
  ctx: CanvasRenderingContext2D,
  monoDataLength: number,
  initMonoData: Array<number> | Uint8Array,
  multiply: number,
  unionBlocks: number,
  isFading: boolean,
  canvasW: number,
  canvasH: number,
) => {
  const allItems = monoDataLength * (multiply * 2);
  const countByOne = 2 ** unionBlocks;

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvasW, canvasH);

  ctx.beginPath();

  let currentValue = 0;
  let lastSumm = 0;

  let direction = 1;

  for (let i = 0; i < allItems; i += 1) {
    const rawNewIndex = i % monoDataLength;
    if (rawNewIndex === 0) {
      direction = (direction + 1) % 2;
    }
    const newIndex = direction ? monoDataLength - 1 - rawNewIndex : rawNewIndex;
    lastSumm += initMonoData[newIndex];

    if ((i + 1) % countByOne === 0) {
      currentValue = lastSumm / countByOne;
      lastSumm = 0;

      for (let j = i - countByOne; j < i; j ++) {
        const x = canvasW / 2 + getXByLineData(Math.min(canvasH, canvasW) / 2, j, allItems, currentValue, 0);
        const y = canvasH / 2 + getYByLineData(Math.min(canvasH, canvasW) / 2, j, allItems, currentValue, 0);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
    }
  }

  ctx.closePath();
  ctx.stroke();
};

type Props = {
  analyser: AnalyserNode;
  monoDataLength: number;
};

const getValue = (min: number, max: number, oldValue: number, newValue: number) => {
  if (newValue !== oldValue) {
    const mediana = (max + min) / 2;

    const diffValue = (newValue - oldValue);
    const diffValueAbs = Math.abs(diffValue);
    const diffValueSign = diffValue / diffValueAbs;

    const speed = Math.floor(diffValueAbs / 256 * 100) * 5 / 100 + 1;

    const diff = Math.max(mediana - oldValue, Math.abs((diffValue) / (2 ** (2 * speed)))) * diffValueSign;

    return oldValue + diff;
  }

  return newValue;
};

let dataArrayPrev: Array<number> = (new Array(256)).fill(512);

const CanvasVisualizer: React.FC<Props> = React.memo(
  (props) => {
    const ref = React.useRef<HTMLCanvasElement>();

    const volume = useSelector(selectVolume);
    const multiply = useSelector(selectMultiply);
    const unionBlocks = useSelector(selectUnionBlocks);
    const isFading = useSelector(selectIsFading);

    const current_player_state = useSelector(selectStateOfPlay);

    React.useEffect(
      () => {
        const canvas = ref.current;

        if (props.analyser && current_player_state === PLAYER_STATE.PLAY) {
          props.analyser.fftSize = props.monoDataLength * 2;
          const bufferLength = props.analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          props.analyser.getByteTimeDomainData(dataArray);

          let animationId = null;

          const draw = () => {
            resize(canvas);

            animationId = requestAnimationFrame(draw);

            props.analyser.getByteTimeDomainData(dataArray);
            let newArray = dataArrayPrev.map((value, index) => isFading ? getValue(0, 256, value, dataArray[index]) : dataArray[index]);
            dataArrayPrev = newArray;

            const ctx = canvas.getContext('2d');

            drawCircle(ctx, props.monoDataLength, newArray, multiply, unionBlocks, isFading, canvas.width, canvas.height);
          };

          draw();

          return () => {
            if (!isNull(animationId)) {
              cancelAnimationFrame(animationId);
            }
          };
        } else {
          let animationId = null;
          const timeStart = performance.now();

          const draw = (now: number) => {
            resize(canvas);

            animationId = requestAnimationFrame(draw);
            let step = (now - timeStart) / 5;

            const newArray: Array<number> = dataArrayPrev.map(
              (rowData) => {
                if (rowData > 128) {
                  return Math.max(128, rowData - step);
                } else if (rowData < 128) {
                  return Math.min(128, rowData + step);
                }

                return rowData;
              }
            );

            const ctx = canvas.getContext('2d');

            drawCircle(ctx, props.monoDataLength, newArray, multiply, unionBlocks, isFading, canvas.width, canvas.height);

            if (newArray.every((value) => value === 128)) {
              cancelAnimationFrame(animationId);
            }
          };

          draw(performance.now());

          return () => {
            if (!isNull(animationId)) {
              cancelAnimationFrame(animationId);
            }
          };
        }
      },
      [
        props.analyser,
        current_player_state,
        volume,
        multiply,
        unionBlocks,
        isFading,
      ],
    );

    return <Canvas ref={ref} />;
  },
);

export default CanvasVisualizer;
