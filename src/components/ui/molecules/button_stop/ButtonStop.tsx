import * as React from 'react';
import { useDispatch, useSelector } from 'vs-react-store';

import Button from 'components/ui/atoms/button/Button';
import { changeStateOfPlay } from 'store/actions';
import { PLAYER_STATE } from 'constants/play_state';
import { selectIsDisabledForPlay, selectStateOfPlayIsStop } from 'store/selectors';

type Props = {};

const ButtonStop: React.FC<Props> = React.memo(
  (props) => {
    const isDisabledOwn = useSelector(selectIsDisabledForPlay);
    const isStop = useSelector(selectStateOfPlayIsStop);
    const isDisabled = isDisabledOwn || isStop;

    const dispatch = useDispatch();

    const handleClickStop = React.useCallback(
      () => {
        dispatch(changeStateOfPlay(PLAYER_STATE.STOP));
      },
      [],
    );

    return (
      <Button onClick={handleClickStop} isDisabled={isDisabled}>
        Stop
      </Button>
    );
  },
);

export default ButtonStop;
