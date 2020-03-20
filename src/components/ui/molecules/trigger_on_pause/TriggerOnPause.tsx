import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';
import { selectStateOfPlay, selectLastCursorTime, selectActiveTrackIndex, selectCurrentTrackTrackDataDuration } from 'store/selectors';
import { PLAYER_STATE } from 'constants/play_state';
import { changeLastCursorTime } from 'store/actions';

type Props = {};

const TriggerOnPause: React.FC<Props> = React.memo(
  (props) => {
    const active_track_index = useSelector(selectActiveTrackIndex);
    const track_duration = useSelector(selectCurrentTrackTrackDataDuration);
    const current_player_state = useSelector(selectStateOfPlay);
    const last_cursor_time = useSelector(selectLastCursorTime);

    const dispatch = useDispatch();

    React.useEffect(
      () => {
        if (current_player_state === PLAYER_STATE.PLAY) {
          const timeStart = performance.now();

          return () => {
            const time = performance.now() - timeStart;
            let last_cursor_time_new = last_cursor_time + time / 1000;
            if (track_duration - last_cursor_time_new < 0.5) {
              last_cursor_time_new = 0;
            }

            dispatch(
              changeLastCursorTime(
                last_cursor_time_new,
              )
            );
          };
        }
      },
      [current_player_state, active_track_index],
    );

    return null;
  },
);

export default TriggerOnPause;
