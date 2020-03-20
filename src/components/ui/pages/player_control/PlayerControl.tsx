import * as React from 'react';
import { useSelector } from 'vs-react-store';
import { isNull } from 'util';

import { PLAYER_STATE } from 'constants/play_state';

import CanvasVisualizer from 'components/ui/molecules/canvas_visualizer/CanvasVisualizer';
import {
  selectStateOfPlay,
  selectLastCursorTime,
  selectActiveTrackIndex,
} from 'store/selectors';

import InputUnionBlock from 'components/ui/molecules/input_union_block/InputUnionBlock';
import InputMultiply from 'components/ui/molecules/input_multiply/InputMultiply';
import InputVolume from 'components/ui/molecules/input_volume/InputVolume';
import TriggerVolume from 'components/ui/molecules/trigger_volume/TriggerVolume';
import Progress from 'components/ui/molecules/progress/Progress';
import PlayerButtons from 'components/ui/molecules/player_buttons/PlayerButtons';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';
import useAudio from 'components/ui/pages/player_control/useAudio';
import TrackListControl from 'components/ui/organisms/track_list_control';
import InputFading from 'components/ui/molecules/input_fading/InputFading';
import InputStateOfLoop from 'components/ui/molecules/input_state_of_loop/InputStateOfLoop';
import useKeyboardEvents from 'components/ui/pages/player_control/useKeyboardEvents';
import TriggerOnPause from 'components/ui/molecules/trigger_on_pause/TriggerOnPause';
import TriggerOnGetAudioBuffer from 'components/ui/molecules/trigger_on_get_audio_buffer/TriggerOnGetAudioBuffer';
import TriggerOnStartPlay from 'components/ui/molecules/trigger_on_start_play/TriggerOnStartPlay';
import TriggerOnStopSource from 'components/ui/molecules/trigger_on_stop_source/TriggerOnStopSource';

const PlayerControl: React.FC<{}> = () => {
  const [monoDataLength] = React.useState(256);

  const last_cursor_time = useSelector(selectLastCursorTime);
  const active_track_index = useSelector(selectActiveTrackIndex);

  const current_player_state = useSelector(selectStateOfPlay);

  const audioData = useAudio(
    current_player_state === PLAYER_STATE.PLAY && !isNull(active_track_index),
    last_cursor_time,
    active_track_index,
  );

  useKeyboardEvents();

  return (
    <React.Fragment>
      <div>
        <div>
          <TrackListControl />
          <div>
            <InputMultiply />
          </div>
          <div>
            <InputUnionBlock monoDataLength={monoDataLength} />
          </div>
          <div>
            <InputFading />
          </div>
        </div>
        <CanvasVisualizer analyser={audioData?.analyser} monoDataLength={monoDataLength} />
        <div>
          <PlayerButtons />
          <FlexContainer>
            <Progress />
            <InputVolume />
            <InputStateOfLoop />
          </FlexContainer>
        </div>
      </div>

      <TriggerOnStopSource source={audioData?.source} />
      <TriggerOnStartPlay source={audioData?.source} />
      <TriggerVolume gainNode={audioData?.gainNode} />
      <TriggerOnPause />
      <TriggerOnGetAudioBuffer />

    </React.Fragment>
  );
};

export default PlayerControl;
