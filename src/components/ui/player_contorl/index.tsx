import * as React from 'react';
import { usePlayerStateOfPlay, usePlayerVolume, usePlayerMultiply, usePlayerUnionBlocks } from 'components/player_context/hooks/state_hooks';
import { PLAYER_STATE__STOP, PLAYER_STATE__PAUSE, PLAYER_STATE__PLAY } from 'constants/play_state';
import { usePlayMusic, usePauseMusic, useChangeVolume, useChangeMultiply, useChangeUnionBlocks } from 'components/player_context/hooks/actions_hook';

import NF_Change from 'music/NF_Change.mp3';
import { secondsInMMSS } from 'utils/time';
import UI from 'components/ui/ui';
import { NEED_UPDATE } from 'constants/need_update';

const cache: Record<string, AudioBuffer> = {};

let audioCtxTemp: AudioContext;
const getAudioCtx = () => {
  audioCtxTemp = audioCtxTemp || new window.AudioContext();

  return audioCtxTemp;
};

export const UiPlayerContorl: React.FC<{}> = () => {
  const [monoDataLength] = React.useState(256);
  const [state, setState] = React.useState<{
    sp: ScriptProcessorNode;
    gainNode: GainNode;
    source: AudioBufferSourceNode;
    audioBuffer: AudioBuffer;
    timeOffset: number;
    startTime: number;
    intervalId: NodeJS.Timeout;
    lastTimeUpdate: number;
  }>({
    sp: null,
    gainNode: null,
    source: null,
    audioBuffer: null,
    timeOffset: null,
    startTime: null,
    intervalId: null,
    lastTimeUpdate: null,
  });

  const [someTakeToShow, setSomeTakeToShow] = React.useState({
    takeVolume: false,
  });

  const current_player_state = usePlayerStateOfPlay();
  const volume = usePlayerVolume();
  const multiply = usePlayerMultiply();
  const unionBlocks = usePlayerUnionBlocks();

  const handlePlayMusic = usePlayMusic();
  const handlePauseMusic = usePauseMusic();
  const handleChangeVolume = useChangeVolume();
  const handleChangeMultiply = useChangeMultiply();
  const handleChangeUnionBlocks = useChangeUnionBlocks();

  const callBackPlay = React.useCallback(
    async () => {
      handlePlayMusic();
      const audioCtx = getAudioCtx();

      // load
      let audioBuffer = cache[NF_Change];
      if (!audioBuffer) {
        audioBuffer = cache[NF_Change] = await fetch(NF_Change)
          .then((response) => response.arrayBuffer())
          .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer));
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      const sp = audioCtx.createScriptProcessor(monoDataLength, 2, 2);

      const gainNode = audioCtx.createGain();

      source.connect(gainNode);
      gainNode.connect(sp);
      sp.connect(audioCtx.destination);

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
            100,
          );

          return {
            sp,
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

  React.useEffect(
    () => {
      if (state.sp && current_player_state === PLAYER_STATE__PLAY) {
        return () => {
          const audioCtx = getAudioCtx();

          state.source.disconnect(state.gainNode);
          state.gainNode.disconnect(state.sp);
          state.sp.disconnect(audioCtx.destination);
        };
      }
    },
    [state.sp, current_player_state],
  );

  const callBackPause = React.useCallback(
    () => {
      handlePauseMusic();
      setState(
        (oldState) => {
          const audioCtx = getAudioCtx();

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

  const handleChangeTakeVolume = React.useCallback(
    () => {
      setSomeTakeToShow((oldState) => ({
        ...oldState,
        takeVolume: !oldState.takeVolume,
      }));
    },
    [],
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
              <button onClick={callBackPause} disabled={!NEED_UPDATE || Boolean(!state.intervalId)}>Pause</button>
            )
          }
        </div>
        <div>
          <label>
            Не учитывать громкость
            <input type="checkbox" checked={someTakeToShow.takeVolume} onChange={handleChangeTakeVolume} />
          </label>
        </div>
        <div>
          <label>
            Громкость ({volume * 100}%)
            <input type="range" min="0" max="1" step="0.01" onChange={handleChangeVolume} value={volume} />
          </label>
        </div>
        <div>
          <label>
            Количество повторений ({multiply * 2})
            <input type="range" min="1" max="10" step="1" onChange={handleChangeMultiply} value={multiply} />
          </label>
        </div>
        <div>
          <label>
            Количество объединений ({2 ** unionBlocks})
            <input type="range" min="0" max={Math.log2(monoDataLength) - 1} step="1" onChange={handleChangeUnionBlocks} value={unionBlocks} />
          </label>
        </div>
        <div>
          {secondsInMMSS(state.timeOffset || 0)}
          <progress value={state.timeOffset || 0} max={state.audioBuffer && state.audioBuffer.duration} />
          {secondsInMMSS(state.audioBuffer && state.audioBuffer.duration)}
        </div>
        <UI.CanvasVisualizer sp={state.sp} someTakeToShow={someTakeToShow} monoDataLength={monoDataLength} />
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
