import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';
import { isNull, isNullOrUndefined } from 'util';
import groupBy from 'lodash-es/groupBy';

import { PLAYER_STATE } from 'constants/play_state';

import CanvasVisualizer from 'components/ui/molecules/canvas_visualizer/CanvasVisualizer';
import { selectStateOfPlay, selectStateOfLoop, selectLastCursorTime, selectStartTime } from 'store/selectors';
import { changeLoadedBytes, changeStateOfPlayOnPause, changeStateOfPlayOnPlay, changeStateOfPlayOnPrepare, changeStateOfPlayOnNodata, changeStartTime, changeLastCursorTime } from 'store/actions';

import InputUnionBlock from 'components/ui/molecules/input_union_block/InputUnionBlock';
import InputMultiply from 'components/ui/molecules/input_multiply/InputMultiply';
import InputVolume from 'components/ui/molecules/input_volume/InputVolume';
import TriggerVolume from 'components/ui/molecules/trigger_volume/TriggerVolume';
import Progress from 'components/ui/molecules/progress/Progress';
import PlayerButtons from 'components/ui/molecules/player_buttons/PlayerButtons';
import { getAudioCtx } from 'global';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';
import loadTrack from 'utils/load_track';
import useAudio from 'components/ui/pages/player_control/useAudio';
import TrackListControl from 'components/ui/organisms/track_list_control';
import InputFading from 'components/ui/molecules/input_fading/InputFading';
import InputStateOfLoop from 'components/ui/molecules/input_state_of_loop/InputStateOfLoop';
import { LOOP_STATE } from 'constants/play_loop';
import useKeyboardEvents from 'components/ui/pages/player_control/useKeyboardEvents';

const PlayerControl: React.FC<{}> = () => {
  const [currentTrackPlayIndex, setCurrentTrackPlayIndex] = React.useState<number>(null);
  const [trackList, setTrackList] = React.useState<Array<File>>([]);

  const [trackData, setTrackData] = React.useState<AudioBuffer>();

  const [monoDataLength] = React.useState(256);

  const last_cursor_time = useSelector(selectLastCursorTime);
  const start_time = useSelector(selectStartTime);

  const state_of_loop = useSelector(selectStateOfLoop);
  const current_player_state = useSelector(selectStateOfPlay);

  const dispatch = useDispatch();

  const handleRemoveTrack = React.useCallback(
    (file: File) => {
      setTrackList((oldState) => oldState.filter((fileAudio) => fileAudio !== file));
    },
    [],
  );
  const handleAddTrack = React.useCallback(
    (files: Array<File>) => {
      setTrackList((oldState) => {
        const newStateObj = groupBy(oldState, 'name');
        const filtredAudio = files.filter((fileAudio) => !newStateObj[fileAudio.name]);

        return [
          ...oldState,
          ...filtredAudio,
        ];
      });
    },
    [],
  );

  React.useEffect(
    () => {
      if (trackList.length) {
        if (isNull(currentTrackPlayIndex)) {
          setCurrentTrackPlayIndex(0);
        }
      } else {
        setCurrentTrackPlayIndex(null);
      }
    },
    [trackList, currentTrackPlayIndex],
  );

  React.useEffect(
    () => {
      const track = trackList[currentTrackPlayIndex];

      if (track) {
        const trackUrl = window.URL.createObjectURL(track);

        dispatch(changeStateOfPlayOnPrepare());

        setImmediate(
          async () => {
            const trackDecode = await loadTrack(
              trackUrl,
              (event) => {
                dispatch(changeLoadedBytes(event.loaded, event.total));
              },
            );

            setTrackData(trackDecode);
            dispatch(changeStateOfPlayOnPlay());
            dispatch(changeStartTime(0));
            dispatch(changeLastCursorTime(0));
          }
        );
      } else {
        setTrackData(null);

        dispatch(changeStateOfPlayOnNodata());
      }

    },
    [trackList?.[currentTrackPlayIndex]],
  );

  const setNextTrackIndex = React.useCallback(
    () => {
      setCurrentTrackPlayIndex((oldStateIndex) => (
        !isNullOrUndefined(oldStateIndex)
          ? (oldStateIndex + 1) % trackList.length
          : oldStateIndex
      ));
    },
    [trackList.length],
  );

  const setPrevTrackIndex = React.useCallback(
    () => {
      setCurrentTrackPlayIndex((oldStateIndex) => (
        !isNullOrUndefined(oldStateIndex)
          ? (trackList.length + oldStateIndex - 1) % trackList.length
          : oldStateIndex
      ));
    },
    [trackList.length],
  );

  const removeActiveTrack = React.useCallback(
    () => {
      const track = trackList?.[currentTrackPlayIndex];
      if (track) {
        handleRemoveTrack(track);
      }
    },
    [currentTrackPlayIndex, trackList, handleRemoveTrack],
  );

  const audioData = useAudio(
    trackData,
    current_player_state === PLAYER_STATE.PLAY && !isNull(currentTrackPlayIndex),
    last_cursor_time,
    currentTrackPlayIndex,
  );

  useKeyboardEvents(
    setNextTrackIndex,
    setPrevTrackIndex,
    removeActiveTrack,
  );

  React.useEffect(
    () => {
      if (audioData && trackData) {
        const audioCtx = getAudioCtx();

        const start_time_new = audioCtx.currentTime - last_cursor_time;

        audioData.source.start(0, last_cursor_time);

        dispatch(changeStartTime(start_time_new));
      }
    },
    [audioData, trackData],
  );

  React.useEffect(
    () => {
      if (current_player_state === PLAYER_STATE.NODATA) {
        dispatch(changeStartTime(0));
        dispatch(changeLastCursorTime(0));
      }
    },
    [current_player_state === PLAYER_STATE.NODATA],
  );

  React.useEffect(
    () => {
      if (audioData?.source) {
        const handleEnded = () => {
          const audioCtx = getAudioCtx();

          if (current_player_state === PLAYER_STATE.PAUSE) {
            if (state_of_loop === LOOP_STATE.NO_LOOP) {
              dispatch(changeStartTime(0));
              dispatch(changeLastCursorTime(0));
            } else {
              dispatch(changeLastCursorTime(audioCtx.currentTime - start_time));
            }
          }

          if (current_player_state === PLAYER_STATE.PLAY) {
            dispatch(changeStartTime(0));
            dispatch(changeLastCursorTime(0));
            dispatch(changeStateOfPlayOnPause());
          }

          if (state_of_loop === LOOP_STATE.ONE_LOOP) {
            dispatch(changeStartTime(0));
            dispatch(changeLastCursorTime(0));
            dispatch(changeStateOfPlayOnPlay());
          }
          if (state_of_loop === LOOP_STATE.ALL_LOOP) {
            dispatch(changeStartTime(0));
            dispatch(changeLastCursorTime(0));
            setNextTrackIndex();
            dispatch(changeStateOfPlayOnPlay());
          }
        };

        audioData.source.addEventListener('ended', handleEnded);

        return () => {
          audioData.source.removeEventListener('ended', handleEnded);
        };
      }
    },
    [audioData?.source, current_player_state, setNextTrackIndex, state_of_loop, trackList?.length, trackData, start_time],
  );

  const handleChangeCurrentPosition = React.useCallback(
    (last_cursor_time_new) => {
      const audioCtx = getAudioCtx();

      const start_time_new = audioCtx.currentTime - last_cursor_time_new;

      dispatch(changeLastCursorTime(last_cursor_time_new));
      dispatch(changeStartTime(start_time_new));
    },
    [
      current_player_state,
    ],
  );

  return (
    <div>
      <div>
        <TrackListControl
          activeTrackIndex={currentTrackPlayIndex}
          trackList={trackList}
          handleAddTrack={handleAddTrack}
          handleRemoveTrack={handleRemoveTrack}
          setActivetrackIndex={setCurrentTrackPlayIndex}
        />
        <div>
          <InputMultiply />
        </div>
        <div>
          <InputUnionBlock
            monoDataLength={monoDataLength}
          />
        </div>
        <div>
          <InputFading />
        </div>
      </div>
      <CanvasVisualizer analyser={audioData?.analyser} monoDataLength={monoDataLength} />
      <div>
        <PlayerButtons souce={audioData?.source} />
        <FlexContainer>
          <Progress
            trackDuration={trackData?.duration ?? 0}
            handleChangeCurrentPosition={handleChangeCurrentPosition}
          />
          <InputVolume />
          <TriggerVolume gainNode={audioData?.gainNode} />
          <InputStateOfLoop />
        </FlexContainer>
      </div>
    </div>
  );
};

export default PlayerControl;
