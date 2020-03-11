import * as React from 'react';
import { useDispatch, useSelector } from 'vs-react-store';

import Button from 'components/ui/atoms/button/Button';
import { changeStateOfPlay } from 'store/actions';
import { PLAYER_STATE } from 'constants/play_state';
import { selectStateOfPlayIsPrepare, selectStateOfPlayIsStop } from 'store/selectors';

type Props = {};

const ButtonStop: React.FC<Props> = React.memo(
  (props) => {
    const isPrepare = useSelector(selectStateOfPlayIsPrepare);
    const isStop = useSelector(selectStateOfPlayIsStop);
    const isDisabled = isPrepare || isStop;

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
