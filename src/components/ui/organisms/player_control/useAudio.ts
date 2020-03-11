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
        const sp = audioCtx.createScriptProcessor(monoDataLength, 2, 2);

        source.connect(gainNode);
        gainNode.connect(sp);
        sp.connect(audioCtx.destination);

        setData({
          source,
          gainNode,
          sp,
        });

        return () => {
          const audioCtx = getAudioCtx();

          try {
            source.disconnect(gainNode);
            gainNode.disconnect(sp);
            sp.disconnect(audioCtx.destination);
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
      if (data?.source) {
        data.source.buffer = audioBuffer;
      }
    },
    [data?.source, audioBuffer],
  );

  return data;
};

export default useAudio;
