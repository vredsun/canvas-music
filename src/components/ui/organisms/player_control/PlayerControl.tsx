import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { PLAYER_STATE } from 'constants/play_state';

import CanvasVisualizer from 'components/ui/molecules/canvas_visualizer/CanvasVisualizer';
import { selectStateOfPlay } from 'store/selectors';
import { changeStateOfPlay, changeLoadedBytes } from 'store/actions';

import InputUnionBlock from 'components/ui/molecules/input_union_block/InputUnionBlock';
import InputMultiply from 'components/ui/molecules/input_multiply/InputMultiply';
import InputVolume from 'components/ui/molecules/input_volume/InputVolume';
import TriggerVolume from 'components/ui/molecules/trigger_volume/TriggerVolume';
import Progress from 'components/ui/molecules/progress/Progress';
import PlayerButtons from 'components/ui/molecules/player_buttons/PlayerButtons';
import { getAudioCtx } from 'global';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';
import loadTrack from 'utils/load_track';
import InputAudio from 'components/ui/atoms/input_audio/InputAudio';
import { isNull } from 'util';
import groupBy from 'lodash-es/groupBy';
import useAudio from 'components/ui/organisms/player_control/useAudio';

const PlayerControl: React.FC<{}> = () => {
  const [currentTrackPlayIndex, setCurrentTrackPlayIndex] = React.useState(null);
  const [trackList, setTrackList] = React.useState<Array<File>>([]);

  const [trackData, setTrackData] = React.useState<AudioBuffer>();

  const [monoDataLength] = React.useState(256);
  const [state, setState] = React.useState<{
    timeOffset: number;
    startTime: number;
    wasMoveByTimeOffset: boolean;
  }>({
    timeOffset: null,
    startTime: null,
    wasMoveByTimeOffset: false,
  });

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
      if (!isNull(currentTrackPlayIndex)) {
        const track = trackList[currentTrackPlayIndex];
        const trackUrl = window.URL.createObjectURL(track);

        dispatch(changeStateOfPlay(PLAYER_STATE.PREPARE));

        setImmediate(
          async () => {
            const trackDecode = await loadTrack(
              trackUrl,
              (event) => {
                dispatch(changeLoadedBytes(event.loaded, event.total));
              },
            );

            setTrackData(trackDecode);
            dispatch(changeStateOfPlay(PLAYER_STATE.STOP));
          }
        );
      }
    },
    [currentTrackPlayIndex, trackList],
  );

  const audioData = useAudio(
    trackData,
    monoDataLength,
    current_player_state === PLAYER_STATE.PLAY,
    state.wasMoveByTimeOffset,
  );

  React.useEffect(
    () => {
      if (audioData) {
        setState(
          (oldState) => {
            const audioCtx = getAudioCtx();

            const timeOffset = oldState.timeOffset || 0;
            const startTime = audioCtx.currentTime - timeOffset;

            audioData.source.start(0, timeOffset);

            return {
              ...oldState,
              timeOffset,
              startTime,
            };
          },
        );
      }
    },
    [audioData, trackData],
  );

  React.useEffect(
    () => {
      if (audioData) {
        const audioCtx = getAudioCtx();

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

        return () => {
          clearInterval(intervalId);
        };
      }
    },
    [audioData],
  );

  React.useEffect(
    () => {
      if (audioData?.source) {
        const handleEnded = () => {
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
        };

        audioData.source.addEventListener('ended', handleEnded);

        return () => {
          audioData.source.removeEventListener('ended', handleEnded);
        };
      }
    },
    [audioData?.source, current_player_state],
  );

  const handleChangeCurrentPosition = React.useCallback(
    (newTimeOffset) => {
      setState((oldState) => {
        const audioCtx = getAudioCtx();

        const timeOffset = newTimeOffset;
        const startTime = audioCtx.currentTime - timeOffset;

        return {
          ...oldState,
          startTime,
          timeOffset,
          wasMoveByTimeOffset: true,
        };
      });
    },
    [
      current_player_state,
    ],
  );

  return (
    <div>
      <div>
        <InputAudio
          trackList={trackList}
          handleAddTrack={handleAddTrack}
          handleRemoveTrack={handleRemoveTrack}
        />
        <div>
          <InputMultiply />
        </div>
        <div>
          <InputUnionBlock
            monoDataLength={monoDataLength}
          />
        </div>
      </div>
      <CanvasVisualizer sp={audioData?.sp} monoDataLength={monoDataLength} />
      <div>
        <PlayerButtons souce={audioData?.source} />
        <FlexContainer>
          <Progress
            trackDuration={trackData?.duration ?? 0}
            currentPosition={state.timeOffset || 0}
            handleChangeCurrentPosition={handleChangeCurrentPosition}
            wasMoveByTimeOffset={state.wasMoveByTimeOffset}
          />
          <InputVolume />
          <TriggerVolume gainNode={audioData?.gainNode} />
        </FlexContainer>
      </div>
    </div>
  );
};

export default PlayerControl;
