import * as React from 'react';
import InputCheckbox from 'components/ui/atoms/input_checkbox/InputCheckbox';
import { useSelector, useDispatch } from 'vs-react-store';
import { selectIsFading } from 'store/selectors';
import { changeIsFading } from 'store/actions';

type Props = {};

const InputFading: React.FC<Props> = React.memo(
  (props) => {
    const isFading = useSelector(selectIsFading);

    const dispatch = useDispatch();

    const handleChange = React.useCallback(
      (isFadingNew) => {
        dispatch(
          changeIsFading(isFadingNew),
        );
      },
      [],
    );

    return (
      <InputCheckbox
        label="Использовать затухание"
        isChecked={isFading}
        onChange={handleChange}
      />
    );
  },
);

export default InputFading;
