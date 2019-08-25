import * as React from 'react';
import { usePlayerStateOfPlay, usePlayerVolume } from 'components/player_context/hooks/state_hooks';
import { PLAYER_STATE__STOP, PLAYER_STATE__PAUSE, PLAYER_STATE__PLAY } from 'constants/play_state';
import { usePlayMusic, usePauseMusic, useStopMusic, useChangeVolume } from 'components/player_context/hooks/actions_hook';

import NF_Change from 'music/NF_Change.mp3';

// tslint:disable-next-line: no-console
const audioCtx = new window.AudioContext();

export const UiPlayerContorl: React.FC<{}> = () => {
  const [state, setState] = React.useState({ gainNode: null, source: null, audioBuffer: null });
  const current_player_state = usePlayerStateOfPlay();
  const volume = usePlayerVolume();

  const handlePlayMusic = usePlayMusic();
  const handlePauseMusic = usePauseMusic();
  const handleStopMusic = useStopMusic();
  const handleChangeVolume = useChangeVolume();

  const callBackPlay = React.useCallback(
    async () => {
      const audioBuffer = await fetch(NF_Change)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer));

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioCtx.createGain();

      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      gainNode.gain.value = volume;
      source.start(0);

      setState(
        () => ({
          gainNode,
          audioBuffer,
          source,
        }),
      );
      handlePlayMusic();
    },
    [handlePlayMusic, volume],
  );

  const callBackPause = React.useCallback(
    () => {
      state.source.stop();
      handlePauseMusic();
    },
    [handlePlayMusic, state.source],
  );

  React.useEffect(
    () => {
      if (state.gainNode) {
        state.gainNode.gain.value = volume;
      }
    },
    [state.gainNode, volume],
  );

  return React.useMemo(
    () => (
      <div>
        {
          Boolean(current_player_state === PLAYER_STATE__STOP || current_player_state === PLAYER_STATE__PAUSE) && (
            <div onClick={callBackPlay}>Play</div>
          )
        }
        {
          Boolean(current_player_state === PLAYER_STATE__PLAY) && (
            <div onClick={callBackPause}>Pause</div>
            )
        }
        {
          Boolean(current_player_state === PLAYER_STATE__PLAY || current_player_state === PLAYER_STATE__PAUSE) && (
            <div onClick={handleStopMusic}>Stop</div>
          )
        }
        <input type="range" min="0" max="1" step="0.01" onChange={handleChangeVolume} value={volume} />
      </div>
    ),
    [
      current_player_state,
      callBackPlay,
      callBackPause,
      handleStopMusic,
      volume,
      handleChangeVolume,
    ],
  );
};
