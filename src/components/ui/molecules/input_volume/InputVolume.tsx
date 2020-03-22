import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { selectVolume } from 'store/selectors';
import { changeVolume } from 'store/actions';
import VerticalRange from 'components/ui/atoms/vertical_range/VerticalRange';

type Props = {};

const InputVolume: React.FC<Props> = React.memo(
  (props) => {
    const volume = useSelector(selectVolume);
    const dispatch = useDispatch();

    const handleChange = React.useCallback(
      (newVolume: number) => {
        dispatch(changeVolume(newVolume));
      },
      [],
    );

    return (
      <label>
        <VerticalRange
          label="vol"
          value={volume}
          min={0}
          max={1}
          step={0.01}
          onChange={handleChange}
        />
      </label>
    );
  },
);

export default InputVolume;
