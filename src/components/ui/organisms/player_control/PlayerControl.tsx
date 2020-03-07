import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { PLAYER_STATE__STOP, PLAYER_STATE__PAUSE, PLAYER_STATE__PLAY } from 'constants/play_state';

import NF_Change from 'music/NF_Change.mp3';
import { secondsInMMSS } from 'utils/time';
import CanvasVisualizer from 'components/ui/molecules/canvas_visualizer/CanvasVisualizer';
import { selectVolume, selectMultiply, selectUnionBlocks, selectStateOfPlay } from 'components/store/selectors';
import { changeStateOfPlay, changeVolume, changeMultiply, changeUnionBlocks } from 'components/store/actions';
import InputSelect from 'components/ui/atoms/input_select/InputSelect';
import InputCheckbox from 'components/ui/atoms/input_checkbox/InputCheckbox';

const cache: Record<string, AudioBuffer> = {};

let audioCtxTemp: AudioContext;
const getAudioCtx = () => {
  audioCtxTemp = audioCtxTemp || new window.AudioContext();

  return audioCtxTemp;
};

const PlayerControl: React.FC<{}> = () => {
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

  const volume = useSelector(selectVolume);
  const multiply = useSelector(selectMultiply);
  const unionBlocks = useSelector(selectUnionBlocks);

  const current_player_state = useSelector(selectStateOfPlay);

  const dispatch = useDispatch();

  const handleChangeVolume = React.useCallback(
    (event: any) => {
      dispatch(changeVolume(Number(event?.target?.value ?? event)));
    },
    [],
  );
  const handleChangeMultiply = React.useCallback(
    (value: number) => {
      dispatch(changeMultiply(value / 2));
    },
    [],
  );
  const handleChangeUnionBlocks = React.useCallback(
    (event: any) => {
      dispatch(changeUnionBlocks(Number(event?.target?.value ?? event)));
    },
    [],
  );

  const handleClickPlay = React.useCallback(
    async () => {
      dispatch(changeStateOfPlay(PLAYER_STATE__PLAY));
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
    [volume],
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

          state.source.disconnect(state.gainNode);
          state.gainNode.disconnect(state.sp);
          state.sp.disconnect(audioCtx.destination);
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

  const handleClickStop = React.useCallback(
    () => {
      dispatch(changeStateOfPlay(PLAYER_STATE__STOP));
      setState(
        (oldState) => {
          oldState.source.stop();

          return {
            ...oldState,
            timeOffset: 0,
            lastTimeUpdate: 0,
          };
        },
      );
    },
    [],
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
        <label>
          Не учитывать громкость
          <InputCheckbox
            isChecked={someTakeToShow.takeVolume}
            onChange={handleChangeTakeVolume}
          />
        </label>
      </div>
      <div>
        <label>
          Громкость
          <input type="range" min="0" max="1" step="0.01" onChange={handleChangeVolume} value={volume} />
          ({ volume * 100 }%)
        </label>
      </div>
      <div>
        <label>
          Количество повторений
          <InputSelect
            rangeFrom={2}
            rangeTo={20}
            rangeStep={2}
            onChange={handleChangeMultiply}
            value={multiply * 2}
          />
        </label>
      </div>
      <div>
        <label>
          Количество объединений
          <InputSelect
            rangeFrom={0}
            rangeTo={Math.log2(monoDataLength) - 1}
            rangeStep={1}
            onChange={handleChangeUnionBlocks}
            value={unionBlocks}
          />
        </label>
      </div>
      <div>
        {secondsInMMSS(state.timeOffset || 0)}
        <progress value={state.timeOffset || 0} max={state.audioBuffer && state.audioBuffer.duration} />
        {secondsInMMSS(state.audioBuffer && state.audioBuffer.duration)}
      </div>
      <CanvasVisualizer sp={state.sp} someTakeToShow={someTakeToShow} monoDataLength={monoDataLength} />
    </div>
  );
};

export default PlayerControl;
