import * as React from 'react';
import { PLAYER_STATE } from 'constants/play_state';
import { selectVolume, selectMultiply, selectUnionBlocks, selectStateOfPlay } from 'store/selectors';
import { useSelector } from 'vs-react-store';
import { getInitMonoData } from 'utils/init_state';

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
  return Math.min(radius - 10, Math.max(0, radius / 2 - Math.floor(value * radius)));
};

const getFuncGetCoordByLineData = (getCoorValue: (index: number, countIndex: number, startAngle: number) => number) => (radius: number, index: number, countIndex: number, value: number, startAngle: number) => {
  if (value > 1) {
    console.info('value more 1');
  }
  return radius + getCoorValue(index, countIndex, startAngle) * normalizeValueByRadius(value, radius);
};

const getXByLineData = getFuncGetCoordByLineData(getXValue);
const getYByLineData = getFuncGetCoordByLineData(getYValue);

type Props = {
  sp: ScriptProcessorNode;
  monoDataLength: number;
};

const CanvasVisualizer: React.FC<Props> = React.memo(
  (props) => {
    const [monoData, setMonoData] = React.useState(getInitMonoData(props.monoDataLength));

    const ref = React.useRef<HTMLCanvasElement>();

    const volume = useSelector(selectVolume);
    const multiply = useSelector(selectMultiply);
    const unionBlocks = useSelector(selectUnionBlocks);

    const current_player_state = useSelector(selectStateOfPlay);

    React.useEffect(
      () => {
        if (props.sp?.removeEventListener && current_player_state === PLAYER_STATE.PLAY) {
          const ping = 5; // раз в ping происходит обновление данных

          let i = 0;
          const audioprocessCallback = (ape: AudioProcessingEvent) => {
            const inputBuffer = ape.inputBuffer;
            const outputBuffer = ape.outputBuffer;

            const channelsLen = outputBuffer.numberOfChannels;
            const sampleLen = inputBuffer.length;

            // для визулизации создаем монобуфер
            let mono = null;

            for (let channel = 0; channel < channelsLen; channel++ ) {
              const inputData = inputBuffer.getChannelData(channel);
              const outputData = outputBuffer.getChannelData(channel);
              // устанавливаем выходные данные = входным
              // здесь можно изменить в них что-то или наложить эффект
              outputData.set(inputData);

              if (i % ping === 0) {
                mono = mono || (new Array(sampleLen)).fill(0);
                // микшируем в монобуфер все каналы
                for (let sample = 0; sample < sampleLen; sample++ ) {
                  mono[sample] = (mono[sample] + inputData[sample]) / 2;
                }
              }
            }

            if (i % ping === 0) {
              setMonoData(mono);
            }
            i = (i + 1) % ping;
          };

          props.sp.addEventListener('audioprocess', audioprocessCallback);

          return () => {
            props.sp.removeEventListener('audioprocess', audioprocessCallback);
          };
        }

        if (current_player_state === PLAYER_STATE.STOP) {
          setMonoData(getInitMonoData(props.monoDataLength));
        }
      },
      [props.sp, current_player_state],
    );

    const stepToVisible = Math.max(
      1,
      Math.round(2 * Math.PI * canvasHh / (props.monoDataLength * 2 * multiply * 2)),
    );

    React.useEffect(
      () => {
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

        let initMonoData = monoData;

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
      },
      [stepToVisible, monoData, canvasW, volume, multiply, unionBlocks],
    );

    return <canvas width={canvasW} height={canvasH} ref={ref} />;
  },
);

export default CanvasVisualizer;
