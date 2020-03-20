import * as React from 'react';

import Button from 'components/ui/atoms/button/Button';
import InputFile from 'components/ui/atoms/input_file/InputFile';
import { useDispatch } from 'vs-react-store';
import { addTracksFromTrackList } from 'store/actions';

type Props = {};

const InputTrack: React.FC<Props> = React.memo(
  (props) => {
    const ref = React.useRef<HTMLInputElement>();

    const dispatch = useDispatch();

    const handleClick = React.useCallback(
      () => {
        ref.current.click();
      },
      [],
    );

    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(
          addTracksFromTrackList(
            Array.from(event.target.files).map(
              (trackFile) => ({
                trackFile,
                trackAudioBuffer: null,
              }),
            ),
          ),
        );
        event.target.value = null;
      },
      [],
    );

    return (
      <InputFile ref={ref} handleChange={handleChange} accept=".mp3" multiple>
        <Button onClick={handleClick}>Добавить трек</Button>
      </InputFile>
    );
  },
);

export default InputTrack;
