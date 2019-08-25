import * as React from 'react';
import { usePlayerStateOfPlay, usePlayerVolume } from 'components/player_context/hooks/state_hooks';
import { PLAYER_STATE__STOP, PLAYER_STATE__PAUSE, PLAYER_STATE__PLAY } from 'constants/play_state';
import { usePlayMusic, usePauseMusic, useChangeVolume } from 'components/player_context/hooks/actions_hook';

import NF_Change from 'music/NF_Change.mp3';
import { secondsInMMSS } from 'utils/time';

const cache: Record<string, AudioBuffer> = {};

// tslint:disable-next-line: no-console
const audioCtx = new window.AudioContext();

export const UiPlayerContorl: React.FC<{}> = () => {
  const [state, setState] = React.useState({ gainNode: null, source: null, audioBuffer: null, timeOffset: null, startTime: null, intervalId: null, lastTimeUpdate: null });
  const current_player_state = usePlayerStateOfPlay();
  const volume = usePlayerVolume();

  const handlePlayMusic = usePlayMusic();
  const handlePauseMusic = usePauseMusic();
  const handleChangeVolume = useChangeVolume();

  const callBackPlay = React.useCallback(
    async () => {
      handlePlayMusic();

      // load
      let audioBuffer = cache[NF_Change];
      if (!audioBuffer) {
        audioBuffer = cache[NF_Change] = await fetch(NF_Change)
          .then((response) => response.arrayBuffer())
          .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer));
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;

      const gainNode = audioCtx.createGain();

      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      gainNode.gain.value = volume;

      setState(
        (oldState) => {
          const startTime = audioCtx.currentTime;
          const timeOffset = oldState.timeOffset || 0;
          source.start(0, timeOffset);

          const intervalId = setInterval(
            () => {
              setState(
                (oldStateInterval) => {
                  const lastTimeUpdate = audioCtx.currentTime;
                  const timeOffsetInterval = oldStateInterval.timeOffset + (lastTimeUpdate - oldStateInterval.lastTimeUpdate);
                  return {
                    ...oldStateInterval,
                    timeOffset: timeOffsetInterval,
                    lastTimeUpdate,
                  };
                },
              );
            },
            1000,
          );

          return {
            gainNode,
            audioBuffer,
            source,
            timeOffset,
            startTime,
            lastTimeUpdate: startTime,
            intervalId,
          };
        },
      );
    },
    [handlePlayMusic, volume],
  );

  const callBackPause = React.useCallback(
    () => {
      handlePauseMusic();
      setState(
        (oldState) => {
          oldState.source.stop();
          clearInterval(oldState.intervalId);
          const timeOffset = oldState.timeOffset + (audioCtx.currentTime - oldState.lastTimeUpdate);

          return {
            ...oldState,
            timeOffset,
            lastTimeUpdate: audioCtx.currentTime,
            intervalId: null,
          };
        },
      );
    },
    [handlePlayMusic],
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
        <div>
          {
            Boolean(current_player_state === PLAYER_STATE__STOP || current_player_state === PLAYER_STATE__PAUSE) && (
              <button onClick={callBackPlay} disabled={Boolean(state.intervalId)}>Play</button>
            )
          }
          {
            Boolean(current_player_state === PLAYER_STATE__PLAY) && (
              <button onClick={callBackPause} disabled={Boolean(!state.intervalId)}>Pause</button>
            )
          }
        </div>
        <div>
          <label>
            <input type="range" min="0" max="1" step="0.01" onChange={handleChangeVolume} value={volume} />
          </label>
        </div>
        <div>
          {secondsInMMSS(state.timeOffset || 0)}
          <progress value={state.timeOffset || 0} max={state.audioBuffer && state.audioBuffer.duration} />
          {secondsInMMSS(state.audioBuffer && state.audioBuffer.duration)}
        </div>
      </div>
    ),
    [
      current_player_state,
      callBackPlay,
      callBackPause,
      volume,
      handleChangeVolume,
    ],
  );
};
