import * as React from 'react';
import { useSelector } from 'vs-react-store';

import {
  selectCurrentTrackTrackData,
  selectLastCursorTime,
  selectStateOfPlay,
} from 'store/selectors';
import { PLAYER_STATE } from 'constants/play_state';

type Props = {
  source: AudioBufferSourceNode | null;
};

const TriggerOnStartPlay: React.FC<Props> = React.memo(
  (props) => {
    const trackAudioBuffer = useSelector(selectCurrentTrackTrackData);
    const last_cursor_time = useSelector(selectLastCursorTime);
    const current_player_state = useSelector(selectStateOfPlay);

    React.useEffect(
      () => {
        if (props?.source && !props?.source?.buffer) {
          props.source.buffer = trackAudioBuffer;
        }
      },
      [props?.source, trackAudioBuffer],
    );

    React.useEffect(
      () => {
        if (current_player_state === PLAYER_STATE.PLAY) {
          if (props.source && trackAudioBuffer) {
            props.source.start(0, last_cursor_time);
          }
        }
      },
      [props.source, trackAudioBuffer, current_player_state],
    );

    return null;
  },
);

export default TriggerOnStartPlay;
