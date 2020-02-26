import * as React from 'react';
import { usePlayerVolume, usePlayerStateOfPlay, usePlayerMultiply, usePlayerUnionBlocks } from 'components/player_context/hooks/state_hooks';
import { PLAYER_STATE__PLAY } from 'constants/play_state';

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
  someTakeToShow: {
    takeVolume: boolean;
  };
};

export const UiCanvasVisualizer: React.FC<Props> = React.memo(
  (props) => {
    const [monoData, setMonoData] = React.useState((new Array(props.monoDataLength)).fill(0));

    const ref = React.useRef<HTMLCanvasElement>();

    const volume = usePlayerVolume();
    const multiply = usePlayerMultiply();
    const unionBlocks = usePlayerUnionBlocks();

    const current_player_state = usePlayerStateOfPlay();

    const audioprocessCallback = React.useCallback(
      (ape: AudioProcessingEvent) => {
        const inputBuffer = ape.inputBuffer;
        const outputBuffer = ape.outputBuffer;

        const channelsLen = outputBuffer.numberOfChannels;
        const sampleLen = inputBuffer.length;

        // для визулизации создаем монобуфер
        const mono = (new Array(sampleLen)).fill(0);

        for (let channel = 0; channel < channelsLen; channel++ ) {
          const inputData = inputBuffer.getChannelData(channel);
          const outputData = outputBuffer.getChannelData(channel);
          // устанавливаем выходные данные = входным
          // здесь можно изменить в них что-то или наложить эффект
          outputData.set(inputData);

          // микшируем в монобуфер все каналы
          for (let sample = 0; sample < sampleLen; sample++ ) {
            mono[sample] = (mono[sample] + inputData[sample]) / 2;
          }
        }

        setMonoData(mono);
      },
      [],
    );

    React.useEffect(
      () => {
        if (props.sp?.removeEventListener && current_player_state === PLAYER_STATE__PLAY) {
          props.sp.addEventListener('audioprocess', audioprocessCallback);

          return () => {
            props.sp.removeEventListener('audioprocess', audioprocessCallback);
          };
        }
      },
      [audioprocessCallback, props.sp, current_player_state],
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

        let lastSumm = 0;
        let countByOne = 2 ** unionBlocks;

        let initMonoData = [
          ...monoData,
          ...[...monoData].reverse(),
        ];

        let arr = [];

        for (let i = 0; i < multiply; i += 1) {
          arr = [
            ...arr,
            ...initMonoData,
          ];
        }

        arr = arr.reduce((newArr, item, index) => {
          lastSumm += item;

          if (!((index + 1) % countByOne)) {
            let newItem = lastSumm / countByOne;
            if (props.someTakeToShow.takeVolume) {
              newItem = volume ? newItem / volume : 0;
            }
            newArr.push(...Array.from({ length: countByOne }).fill(newItem));
            lastSumm = 0;
          }

          return newArr;
        }, []);

        for (let i = 0, length = arr.length; i < length; i += 1) {
          const x = getXByLineData(canvasHh, i, length, arr[i], 0);
          const y = getYByLineData(canvasHh, i, length, arr[i], 0);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.closePath();

        ctx.stroke();
      },
      [monoData, canvasW, props.someTakeToShow, volume, multiply, unionBlocks],
    );

    return <canvas width={canvasW} height={canvasH} ref={ref} />;
  },
);
