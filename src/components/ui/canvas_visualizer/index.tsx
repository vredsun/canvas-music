import * as React from 'react';

const canvasH = 512;
const canvasW = canvasH;
const canvasHh = Math.floor( canvasH / 2 );

const getX = (i: number, count: number, value: number) => {
  return canvasHh + Math.cos(2 * Math.PI / count * i) * (canvasHh / 2 - Math.floor(value * canvasHh));
};
const getY = (i: number, count: number, value: number) => {
  return canvasHh + Math.sin(2 * Math.PI / count * i) * (canvasHh / 2 - Math.floor(value * canvasHh));
};

export const UiCanvasVisualizer: React.FC<{ monoData: Array<number>}> = React.memo(
  (props) => {
    const ref = React.useRef<HTMLCanvasElement>();

    React.useEffect(
      () => {
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 2;
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, canvasW, canvasH);

        ctx.beginPath();

        for (let i = 0, length = props.monoData.length; i < length; i += 1) {
          const x = getX(i, length, props.monoData[i]);
          const y = getY(i, length, props.monoData[i]);
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
      },
      [props.monoData, canvasW],
    );

    return <canvas width={canvasW} height={canvasH} ref={ref} />;
  },
);
