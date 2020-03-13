import * as React from 'react';
import { isNull } from 'util';
import { useSelector } from 'vs-react-store';

import { PLAYER_STATE } from 'constants/play_state';
import { selectVolume, selectMultiply, selectUnionBlocks, selectStateOfPlay } from 'store/selectors';

const canvasH = 512;
const canvasW = canvasH;
const canvasHh = Math.floor( canvasH / 2 );

const getXValue = (index: number, countIndex: number, startAngle: number) => {
  return Math.cos(startAngle + 2 * Math.PI / countIndex * index);
};

const getYValue = (index: number, countIndex: number, startAngle: number) => {
  return Math.sin(startAngle + 2 * Math.PI / countIndex * index);
};

const normalizeValueByRadius = (value: number, radius: number) => {
  return Math.min(radius - 10, Math.max(0, radius / 2 - Math.floor((value - 128) / 256 * radius)));
};

const getFuncGetCoordByLineData = (getCoorValue: (index: number, countIndex: number, startAngle: number) => number) => (radius: number, index: number, countIndex: number, value: number, startAngle: number) => {
  if (value > 256) {
    console.info('value more 256', value);
  }
  return radius + getCoorValue(index, countIndex, startAngle) * normalizeValueByRadius(value, radius);
};

const getXByLineData = getFuncGetCoordByLineData(getXValue);
const getYByLineData = getFuncGetCoordByLineData(getYValue);

type Props = {
  analyser: AnalyserNode;
  monoDataLength: number;
};

const CanvasVisualizer: React.FC<Props> = React.memo(
  (props) => {
    const ref = React.useRef<HTMLCanvasElement>();

    const volume = useSelector(selectVolume);
    const multiply = useSelector(selectMultiply);
    const unionBlocks = useSelector(selectUnionBlocks);

    const current_player_state = useSelector(selectStateOfPlay);

    React.useEffect(
      () => {
        if (props.analyser && current_player_state === PLAYER_STATE.PLAY) {
          props.analyser.fftSize = props.monoDataLength * 2;
          var bufferLength = props.analyser.frequencyBinCount;
          var dataArray = new Uint8Array(bufferLength);
          props.analyser.getByteTimeDomainData(dataArray);

          let animationId = null;

          const draw = () => {
            animationId = requestAnimationFrame(draw);

            props.analyser.getByteTimeDomainData(dataArray);

            const canvas = ref.current;
            const ctx = canvas.getContext('2d');

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 2;
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvasW, canvasH);

            ctx.beginPath();

            let currentValue = 0;
            let lastSumm = 0;
            let countByOne = 2 ** unionBlocks;

            const initMonoData = dataArray;

            const allItems = props.monoDataLength * (multiply * 2);

            let direction = 1;

            for (let i = 0; i < allItems; i += 1) {
              const rawNewIndex = i % props.monoDataLength;
              if (rawNewIndex === 0) {
                direction = (direction + 1) % 2;
              }
              const newIndex = direction ? props.monoDataLength - 1 - rawNewIndex : rawNewIndex;
              lastSumm += initMonoData[newIndex];

              if ((i + 1) % countByOne === 0) {
                currentValue = lastSumm / countByOne;
                lastSumm = 0;

                for (let j = i - countByOne; j < i; j ++) {
                  const x = getXByLineData(canvasHh, j, allItems, currentValue, 0);
                  const y = getYByLineData(canvasHh, j, allItems, currentValue, 0);

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

          draw();

          return () => {
            if (!isNull(animationId)) {
              cancelAnimationFrame(animationId);
            }
          };
        }
      },
      [props.analyser, current_player_state, canvasW, volume, multiply, unionBlocks],
    );

    return <canvas width={canvasW} height={canvasH} ref={ref} />;
  },
);

export default CanvasVisualizer;
