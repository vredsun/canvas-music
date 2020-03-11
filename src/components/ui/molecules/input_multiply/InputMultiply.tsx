import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { selectMultiply } from 'store/selectors';
import { changeMultiply } from 'store/actions';
import InputSelect from 'components/ui/atoms/input_select/InputSelect';

type Props = {};

const InputMultiply: React.FC<Props> = React.memo(
  (props) => {
    const multiply = useSelector(selectMultiply);
    const dispatch = useDispatch();

    const handleChangeMultiply = React.useCallback(
      (value: number) => {
        dispatch(changeMultiply(value / 2));
      },
      [],
    );

    return (
      <InputSelect
        label="Количество повторений"
        rangeFrom={2}
        rangeTo={20}
        rangeStep={2}
        onChange={handleChangeMultiply}
        value={multiply * 2}
      />
    );
  },
);

export default InputMultiply;
