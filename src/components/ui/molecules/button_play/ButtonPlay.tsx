import * as React from 'react';
import { useDispatch, useSelector } from 'vs-react-store';

import Button from 'components/ui/atoms/button/Button';
import { changeStateOfPlay } from 'store/actions';
import { PLAYER_STATE } from 'constants/play_state';
import { selectStateOfPlay, selectIsDisabledForPlay } from 'store/selectors';

type Props = {};

const ButtonPlay: React.FC<Props> = React.memo(
  (props) => {
    const isDisabled = useSelector(selectIsDisabledForPlay);
    const current_player_state = useSelector(selectStateOfPlay);

    const dispatch = useDispatch();

    const current_player_state_is_play = current_player_state !== PLAYER_STATE.PLAY;

    const handleClickPlay = React.useCallback(
      () => {
        if (!isDisabled) {
          if (current_player_state_is_play) {
            dispatch(changeStateOfPlay(PLAYER_STATE.PLAY));
          } else {
            dispatch(changeStateOfPlay(PLAYER_STATE.PAUSE));
          }
        }
      },
      [isDisabled, current_player_state_is_play],
    );

    return (
      <Button onClick={handleClickPlay} isDisabled={isDisabled}>
        { current_player_state_is_play && 'Play'}
        { !current_player_state_is_play && 'Pause'}
      </Button>
    );
  },
);

export default ButtonPlay;
