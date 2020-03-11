import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { selectUnionBlocks } from 'store/selectors';
import { changeUnionBlocks } from 'store/actions';
import InputSelect from 'components/ui/atoms/input_select/InputSelect';

type Props = {
  monoDataLength: number;
};

const InputUnionBlock: React.FC<Props> = React.memo(
  (props) => {
    const unionBlocks = useSelector(selectUnionBlocks);
    const dispatch = useDispatch();

    const handleChangeUnionBlocks = React.useCallback(
      (event: any) => {
        dispatch(changeUnionBlocks(Number(event?.target?.value ?? event)));
      },
      [],
    );

    return (
      <InputSelect
        label="Количество объединений"
        rangeFrom={0}
        rangeTo={Math.log2(props.monoDataLength) - 1}
        rangeStep={1}
        onChange={handleChangeUnionBlocks}
        value={unionBlocks}
      />
    );
  },
);

export default InputUnionBlock;
