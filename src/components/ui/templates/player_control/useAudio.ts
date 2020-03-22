import * as React from 'react';
import { getAudioCtx } from 'global';

const useAudio = (boolInit: boolean, ...dependency: Array<any>) => {
  const data = React.useMemo(
    () => {
      if (boolInit) {
        const audioCtx = getAudioCtx();

        const source = audioCtx.createBufferSource();
        const analyser = audioCtx.createAnalyser();
        const gainNode = audioCtx.createGain();

        source.connect(analyser);
        analyser.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        return {
          source,
          gainNode,
          analyser
        };
      }

      return null;
    },
    [boolInit, ...dependency],
  );

  React.useEffect(
    () => {
      return () => {
        const audioCtx = getAudioCtx();

        try {
          data.source.disconnect(data.analyser);
          data.analyser.disconnect(data.gainNode);
          data.gainNode.disconnect(audioCtx.destination);

          if (data.source.buffer) {
            data.source.stop();
          }
        } catch {
          //
        }
      };
    },
    [data],
  );

  return data;
};

export default useAudio;
