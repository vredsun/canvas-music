import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { selectStateOfLoop } from 'store/selectors';
import { changeStateOfLoop } from 'store/actions';
import Button from 'components/ui/atoms/button/Button';
import { LOOP_STATE } from 'constants/play_loop';
import { getNextStateOfLoop } from 'global';

type Props = {};

const InputStateOfLoop: React.FC<Props> = React.memo(
  (props) => {
    const state_of_loop = useSelector(selectStateOfLoop);
    const dispatch = useDispatch();

    const handleClick = React.useCallback(
      () => {
        dispatch(changeStateOfLoop(getNextStateOfLoop(state_of_loop)));
      },
      [state_of_loop],
    );

    return (
      <Button onClick={handleClick}>
        {
          state_of_loop === LOOP_STATE.NO_LOOP && (
            <span>no</span>
          )
        }
        {
          state_of_loop === LOOP_STATE.ALL_LOOP && (
            <span>all</span>
          )
        }
        {
          state_of_loop === LOOP_STATE.ONE_LOOP && (
            <span>one</span>
          )
        }
      </Button>
    );
  },
);

export default InputStateOfLoop;
