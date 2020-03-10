import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { PLAYER_STATE } from 'constants/play_state';

import NF_Change from 'music/NF_Change.mp3';
import CanvasVisualizer from 'components/ui/molecules/canvas_visualizer/CanvasVisualizer';
import { selectStateOfPlay } from 'components/store/selectors';
import { changeStateOfPlay } from 'components/store/actions';

import InputUnionBlock from 'components/ui/molecules/input_union_block/InputUnionBlock';
import InputMultiply from 'components/ui/molecules/input_multiply/InputMultiply';
import InputVolume from 'components/ui/molecules/input_volume/InputVolume';
import TriggerVolume from 'components/ui/molecules/trigger_volume/TriggerVolume';
import Progress from 'components/ui/molecules/progress/Progress';
import PlayerButtons from 'components/ui/molecules/player_buttons/PlayerButtons';
import { getAudioCtx } from 'global';

const cache: Record<string, AudioBuffer> = {};

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
    wasMoveByTimeOffset: boolean;
  }>({
    sp: null,
    gainNode: null,
    source: null,
    audioBuffer: null,
    timeOffset: null,
    startTime: null,
    intervalId: null,
    wasMoveByTimeOffset: false,
  });

  const current_player_state = useSelector(selectStateOfPlay);

  const dispatch = useDispatch();

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
          dispatch(changeStateOfPlay(PLAYER_STATE.STOP));
        }
      );
    },
    [],
  );
  React.useEffect(
    () => {
      if (trackData && current_player_state === PLAYER_STATE.PLAY) {
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
            const timeOffset = oldState.timeOffset || 0;
            const startTime = audioCtx.currentTime - timeOffset;

            source.start(0, timeOffset);

            const intervalId = setInterval(
              () => {
                setState(
                  (oldStateInterval) => {
                    const timeOffsetNew = (audioCtx.currentTime - oldStateInterval.startTime);

                    return {
                      ...oldStateInterval,
                      timeOffset: timeOffsetNew,
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
              intervalId,
            };
          },
        );
      }
    },
    [trackData, current_player_state === PLAYER_STATE.PLAY],
  );

  React.useEffect(
    () => {
      if (state.sp && current_player_state === PLAYER_STATE.PLAY) {
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
    [state.sp, current_player_state === PLAYER_STATE.PLAY],
  );

  React.useEffect(
    () => {
      if (state.source) {
        const handleEnded = () => {
          if (state.intervalId) {
            clearInterval(state.intervalId);

            setState((oldState) => {
              const audioCtx = getAudioCtx();
              let timeOffset = 0;

              if (current_player_state === PLAYER_STATE.PAUSE) {
                timeOffset = (audioCtx.currentTime - oldState.startTime);
              }

              if (current_player_state === PLAYER_STATE.PLAY) {
                dispatch(changeStateOfPlay(PLAYER_STATE.STOP));
              }

              return {
                ...oldState,
                intervalId: null,
                lastTimeStart: 0,
                timeOffset,
                wasMoveByTimeOffset: true,
              };
            });
          }
        };

        state.source.addEventListener('ended', handleEnded);

        return () => {
          state.source.removeEventListener('ended', handleEnded);
        };
      }
    },
    [state.source, current_player_state],
  );

  const handleChangeCurrentPosition = React.useCallback(
    (newTimeOffset) => {
      // handleClickPause();
      setState((oldState) => {
        const audioCtx = getAudioCtx();
        dispatch(changeStateOfPlay(PLAYER_STATE.PAUSE));

        const timeOffset = newTimeOffset;
        const startTime = audioCtx.currentTime - timeOffset;

        return {
          ...oldState,
          startTime,
          timeOffset,
          wasMoveByTimeOffset: true,
        };
      });

      setTimeout(
        () => {
          if (current_player_state === PLAYER_STATE.PLAY) {
            dispatch(changeStateOfPlay(PLAYER_STATE.PLAY));
          }
        },
        100,
      );

    },
    [
      current_player_state,
    ],
  );

  return (
    <div>
      <PlayerButtons souce={state.source} />
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
        <Progress
          trackDuration={state.audioBuffer?.duration ?? 0}
          currentPosition={state.timeOffset || 0}
          handleChangeCurrentPosition={handleChangeCurrentPosition}
          wasMoveByTimeOffset={state.wasMoveByTimeOffset}
        />
      </div>
      <CanvasVisualizer sp={state.sp} monoDataLength={monoDataLength} />
    </div>
  );
};

export default PlayerControl;
