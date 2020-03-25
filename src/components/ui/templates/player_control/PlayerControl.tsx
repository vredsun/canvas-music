import * as React from 'react';
import { useSelector } from 'vs-react-store';
import { isNull } from 'util';

import { PLAYER_STATE } from 'constants/play_state';

import CanvasVisualizer from 'components/ui/molecules/canvas_visualizer/CanvasVisualizer';
import {
  selectStateOfPlay,
  selectLastCursorTime,
  selectActiveTrackIndex,
  selectStateOfPlayNoData,
} from 'store/selectors';

import useAudio from 'components/ui/templates/player_control/useAudio';

import InputUnionBlock from 'components/ui/molecules/input_union_block/InputUnionBlock';
import InputMultiply from 'components/ui/molecules/input_multiply/InputMultiply';
import TriggerVolume from 'components/ui/molecules/trigger_volume/TriggerVolume';
import PlayerButtons from 'components/ui/molecules/player_buttons/PlayerButtons';

import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';
import TrackListControl from 'components/ui/organisms/track_list_control';
import InputFading from 'components/ui/molecules/input_fading/InputFading';
import TriggerOnPause from 'components/ui/molecules/trigger_on_pause/TriggerOnPause';
import TriggerOnGetAudioBuffer from 'components/ui/molecules/trigger_on_get_audio_buffer/TriggerOnGetAudioBuffer';
import TriggerOnStartPlay from 'components/ui/molecules/trigger_on_start_play/TriggerOnStartPlay';
import TriggerOnStopSource from 'components/ui/molecules/trigger_on_stop_source/TriggerOnStopSource';
import TriggerOnKeyboard from 'components/ui/molecules/trigger_on_keyboard/TriggerOnKeyboard';
import styled from 'styled-components';
import BottomControl from 'components/ui/organisms/bottom_control/BottomControl';
import Flex from 'components/ui/atoms/flex/Flex';
import HiddenMenu from 'components/ui/atoms/hidden_menu/HiddenMenu';

const FlexContainerWrap = styled(FlexContainer)`
  width: 100%;
  flex: 1;
`;

const FlexContainerFullHeight = styled(FlexContainer)`
  width: 100%;
  height: 100%;
  flex: 1;
`;

const PlayerControl: React.FC<{}> = () => {
  const [monoDataLength] = React.useState(256);

  const last_cursor_time = useSelector(selectLastCursorTime);
  const active_track_index = useSelector(selectActiveTrackIndex);

  const current_player_state = useSelector(selectStateOfPlay);
  const no_data = useSelector(selectStateOfPlayNoData);

  const audioData = useAudio(
    current_player_state === PLAYER_STATE.PLAY && !isNull(active_track_index),
    last_cursor_time,
    active_track_index,
  );

  return (
    <FlexContainerWrap flexDirection="column">
      <FlexContainerWrap>
        <Flex basis="500px">
          <HiddenMenu position="left">
            <FlexContainer flexDirection="column">
              <InputMultiply />
              <InputUnionBlock monoDataLength={monoDataLength} />
              <InputFading />
            </FlexContainer>
          </HiddenMenu>
        </Flex>
        <Flex basis="900px" grow={1}>
          <FlexContainerFullHeight alignItems="center" justifyContent="center">
            <CanvasVisualizer analyser={audioData?.analyser} monoDataLength={monoDataLength} />
          </FlexContainerFullHeight>
        </Flex>
        <Flex basis="500px">
          <HiddenMenu position="right" isManual={no_data} isOpen={no_data}>
            <FlexContainer>
              <TrackListControl />
            </FlexContainer>
          </HiddenMenu>
        </Flex>
      </FlexContainerWrap>
      <FlexContainer justifyContent="center">
        <PlayerButtons />
      </FlexContainer>
      <BottomControl />

      <TriggerOnKeyboard />
      <TriggerOnStopSource source={audioData?.source} />
      <TriggerOnStartPlay source={audioData?.source} />
      <TriggerVolume gainNode={audioData?.gainNode} />
      <TriggerOnPause />
      <TriggerOnGetAudioBuffer />

    </FlexContainerWrap>
  );
};

export default PlayerControl;
