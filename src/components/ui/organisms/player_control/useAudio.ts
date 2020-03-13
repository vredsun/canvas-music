import * as React from 'react';
import { getAudioCtx } from 'global';

const useAudio = (audioBuffer: AudioBuffer, monoDataLength: number, boolInit: boolean, ...dependency: Array<any>) => {
  const [data, setData] = React.useState(null);

  React.useEffect(
    () => {
      if (boolInit) {
        const audioCtx = getAudioCtx();

        const source = audioCtx.createBufferSource();
        const gainNode = audioCtx.createGain();
        const analyser = audioCtx.createAnalyser();

        source.connect(gainNode);
        gainNode.connect(analyser);
        analyser.connect(audioCtx.destination);

        setData({
          source,
          gainNode,
          analyser
        });

        return () => {
          const audioCtx = getAudioCtx();

          try {
            source.disconnect(gainNode);
            gainNode.disconnect(analyser);
            analyser.disconnect(audioCtx.destination);
          } catch {
            //
          }
        };
      }
    },
    [boolInit, ...dependency],
  );

  React.useEffect(
    () => {
      if (data?.source && !data?.source?.buffer) {
        data.source.buffer = audioBuffer;
      }
    },
    [data?.source, audioBuffer],
  );

  return data;
};

export default useAudio;
