import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import {
  selectStateOfLoop,
} from 'store/selectors';
import { PLAYER_STATE } from 'constants/play_state';
import {
  changeStateOfPlay,
  changeStateOfPlayOnPlayFromStart,
  changeActiveTrackIndexToNextTrack,
} from 'store/actions';
import { LOOP_STATE } from 'constants/play_loop';

type Props = {
  source: AudioBufferSourceNode | null;
};

const TriggerOnStopSource: React.FC<Props> = React.memo(
  (props) => {
    const state_of_loop = useSelector(selectStateOfLoop);

    const dispatch = useDispatch();

    React.useEffect(
      () => {
        if (props.source) {
          const handleEnded = () => {
            if (state_of_loop === LOOP_STATE.NO_LOOP) {
              dispatch(changeStateOfPlay(PLAYER_STATE.PAUSE));
            }
            if (state_of_loop === LOOP_STATE.ONE_LOOP) {
              dispatch(changeStateOfPlayOnPlayFromStart());
            }
            if (state_of_loop === LOOP_STATE.ALL_LOOP) {
              dispatch(
                changeActiveTrackIndexToNextTrack(),
              );
              dispatch(changeStateOfPlayOnPlayFromStart());
            }
          };

          props.source.addEventListener('ended', handleEnded);

          return () => {
            props.source.removeEventListener('ended', handleEnded);
          };
        }
      },
      [props.source, state_of_loop],
    );

    return null;
  },
);

export default TriggerOnStopSource;
