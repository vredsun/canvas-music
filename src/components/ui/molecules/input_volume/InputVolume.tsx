import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { selectVolume } from 'components/store/selectors';
import { changeVolume } from 'components/store/actions';

type Props = {};

const InputVolume: React.FC<Props> = React.memo(
  (props) => {
    const volume = useSelector(selectVolume);
    const dispatch = useDispatch();

    const handleChangeVolume = React.useCallback(
      (event: any) => {
        dispatch(changeVolume(Number(event?.target?.value ?? event)));
      },
      [],
    );

    return (
      <label>
        Громкость
        <input type="range" min="0" max="1" step="0.01" onChange={handleChangeVolume} value={volume} />
        ({ volume * 100 }%)
      </label>
    );
  },
);

export default InputVolume;
