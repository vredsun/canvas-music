import * as React from 'react';

import Button from 'components/ui/atoms/button/Button';
import InputFile from 'components/ui/atoms/input_file/InputFile';

type Props = {
  handleAddTrack: (files: Array<File>) => void;
};

const InputTrack: React.FC<Props> = React.memo(
  (props) => {
    const ref = React.useRef<HTMLInputElement>();

    const handleClick = React.useCallback(
      () => {
        ref.current.click();
      },
      [],
    );

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        props.handleAddTrack(Array.from(event.target.files));
        event.target.value = null;
      },
      [props.handleAddTrack],
    );

    return (
      <InputFile ref={ref} handleChange={handleChange} accept=".mp3" multiple>
        <Button onClick={handleClick}>Добавить трек</Button>
      </InputFile>
    );
  },
);

export default InputTrack;
