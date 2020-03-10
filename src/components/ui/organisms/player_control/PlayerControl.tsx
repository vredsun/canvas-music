import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { PLAYER_STATE__STOP, PLAYER_STATE__PAUSE, PLAYER_STATE__PLAY } from 'constants/play_state';

import NF_Change from 'music/NF_Change.mp3';
import { secondsInMMSS } from 'utils/time';
import CanvasVisualizer from 'components/ui/molecules/canvas_visualizer/CanvasVisualizer';
import { selectStateOfPlay } from 'components/store/selectors';
import { changeStateOfPlay } from 'components/store/actions';

import InputUnionBlock from 'components/ui/molecules/input_union_block/InputUnionBlock';
import InputMultiply from 'components/ui/molecules/input_multiply/InputMultiply';
import InputVolume from 'components/ui/molecules/input_volume/InputVolume';
import TriggerVolume from 'components/ui/molecules/trigger_volume/TriggerVolume';
import Progress from 'components/ui/molecules/progress/Progress';

const cache: Record<string, AudioBuffer> = {};

let audioCtxTemp: AudioContext;
const getAudioCtx = () => {
  audioCtxTemp = audioCtxTemp || new window.AudioContext();

  return audioCtxTemp;
};

const PlayerControl: React.FC<{}> = () => {
  const [trackData, setTrackData] = React.useState<AudioBuffer>();

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
    wasMoveByTimeOffset: boolean;
  }>({
    sp: null,
    gainNode: null,
    source: null,
    audioBuffer: null,
    timeOffset: null,
    startTime: null,
    intervalId: null,
    lastTimeUpdate: null,
    wasMoveByTimeOffset: false,
  });

  const current_player_state = useSelector(selectStateOfPlay);

  const dispatch = useDispatch();

  React.useEffect(
    () => {
      if (current_player_state === PLAYER_STATE__PLAY) {

      }
    },
    [current_player_state],
  );

  React.useEffect(
    () => {
      setImmediate(
        async () => {
          const audioCtx = getAudioCtx();

          let trackDecode = cache[NF_Change];

          if (!trackDecode) {
            trackDecode = cache[NF_Change] = await fetch(NF_Change)
              .then((response) => response.arrayBuffer())
              .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer));
          }

          setTrackData(trackDecode);
        }
      );
    },
    [],
  );

  const handleClickPlay = React.useCallback(
    () => {
      if (trackData) {
        dispatch(changeStateOfPlay(PLAYER_STATE__PLAY));
        const audioCtx = getAudioCtx();

        const audioBuffer = trackData;

        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        const sp = audioCtx.createScriptProcessor(monoDataLength, 2, 2);

        const gainNode = audioCtx.createGain();

        source.connect(gainNode);
        gainNode.connect(sp);
        sp.connect(audioCtx.destination);

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
                      wasMoveByTimeOffset: false,
                    };
                  },
                );
              },
              100,
            );

            return {
              ...oldState,
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
      }

      return () => {
        handleClickStop();
      };
    },
    [trackData],
  );

  React.useEffect(
    () => {
      if (state.source) {
        const handleEnded = () => {
          if (state.intervalId) {
            clearInterval(state.intervalId);

            setState((oldState) => ({
              ...oldState,
              intervalId: null,
            }));
          }
        };

        state.source.addEventListener('ended', handleEnded);

        return () => {
          state.source.removeEventListener('ended', handleEnded);
        };
      }
    },
    [state.source, state.intervalId],
  );

  React.useEffect(
    () => {
      if (state.sp && current_player_state === PLAYER_STATE__PLAY) {
        return () => {
          const audioCtx = getAudioCtx();

          try {
            state.source.disconnect(state.gainNode);
            state.gainNode.disconnect(state.sp);
            state.sp.disconnect(audioCtx.destination);
          } catch {
            //
          }
        };
      }
    },
    [state.sp, current_player_state],
  );

  const handleClickPause = React.useCallback(
    () => {
      dispatch(changeStateOfPlay(PLAYER_STATE__PAUSE));
      setState(
        (oldState) => {
          const audioCtx = getAudioCtx();

          oldState.source.stop();
          const timeOffset = oldState.timeOffset + (audioCtx.currentTime - oldState.lastTimeUpdate);

          return {
            ...oldState,
            timeOffset,
            lastTimeUpdate: audioCtx.currentTime,
          };
        },
      );
    },
    [],
  );

  const handleChangeCurrentPosition = React.useCallback(
    (newTimeOffset) => {
      handleClickPause();
      setState((oldState) => {
        const timeOffset = newTimeOffset;
        if (oldState.intervalId) {
          clearInterval(oldState.intervalId);
        }
        return {
          ...oldState,
          timeOffset,
          wasMoveByTimeOffset: true,
          intervalId: null,
        };
      });
      if (current_player_state === PLAYER_STATE__PLAY) {
        handleClickPlay();
      }
    },
    [handleClickPause, handleClickPlay, current_player_state],
  );

  const handleClickStop = React.useCallback(
    () => {
      dispatch(changeStateOfPlay(PLAYER_STATE__STOP));
      setState(
        (oldState) => {
          oldState.source?.stop();

          return {
            ...oldState,
            timeOffset: 0,
            lastTimeUpdate: 0,
            wasMoveByTimeOffset: true,
          };
        },
      );
    },
    [],
  );

  return (
    <div>
      <div>
        {
          Boolean(current_player_state === PLAYER_STATE__PLAY || current_player_state === PLAYER_STATE__PAUSE) && (
            <button
              onClick={handleClickStop}
              disabled={
                current_player_state === PLAYER_STATE__PLAY
                  ? Boolean(!state.intervalId)
                  : Boolean(state.intervalId)
              }
              children="Stop"
            />
          )
        }
        {
          Boolean(current_player_state === PLAYER_STATE__STOP || current_player_state === PLAYER_STATE__PAUSE) && (
            <button onClick={handleClickPlay} disabled={Boolean(state.intervalId)}>Play</button>
          )
        }
        {
          Boolean(current_player_state === PLAYER_STATE__PLAY) && (
            <button onClick={handleClickPause} disabled={Boolean(!state.intervalId)}>Pause</button>
          )
        }
      </div>
      <div>
        <InputVolume />
        <TriggerVolume gainNode={state.gainNode} />
      </div>
      <div>
        <InputMultiply />
      </div>
      <div>
        <InputUnionBlock
          monoDataLength={monoDataLength}
        />
      </div>
      <div>
        {secondsInMMSS(state.timeOffset || 0)}
        <Progress
          trackDuration={state.audioBuffer?.duration ?? 0}
          currentPosition={state.timeOffset || 0}
          handleChangeCurrentPosition={handleChangeCurrentPosition}
          wasMoveByTimeOffset={state.wasMoveByTimeOffset}
        />
        {secondsInMMSS(state.audioBuffer && state.audioBuffer.duration)}
      </div>
      <CanvasVisualizer sp={state.sp} monoDataLength={monoDataLength} />
    </div>
  );
};

export default PlayerControl;
