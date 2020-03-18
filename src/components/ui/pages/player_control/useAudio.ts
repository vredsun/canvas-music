import * as React from 'react';
import { getAudioCtx } from 'global';

const useAudio = (audioBuffer: AudioBuffer, boolInit: boolean, ...dependency: Array<any>) => {
  const [data, setData] = React.useState<{ source: AudioBufferSourceNode; analyser: AnalyserNode; gainNode: GainNode }>(null);

  React.useEffect(
    () => {
      if (boolInit) {
        const audioCtx = getAudioCtx();

        const source = audioCtx.createBufferSource();
        const analyser = audioCtx.createAnalyser();
        const gainNode = audioCtx.createGain();

        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        setData({
          source,
          gainNode,
          analyser
        });

        return () => {
          const audioCtx = getAudioCtx();

          try {
            source.disconnect(analyser);
            analyser.disconnect(gainNode);
            gainNode.disconnect(audioCtx.destination);
          } catch {
            //
          }

          setData(null);
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
