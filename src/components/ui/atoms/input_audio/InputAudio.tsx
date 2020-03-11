import * as React from 'react';
import styled from 'styled-components';
import Button from 'components/ui/atoms/button/Button';

type Props = {
  trackList: Array<File>;
  handleAddTrack: (files: Array<File>) => void;
  handleRemoveTrack: (file: File) => void;
};

const HiddenInput = styled.input`
  display: none;
`;

const InputAudio: React.FC<Props> = React.memo(
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
      },
      [props.handleAddTrack],
    );

    return (
      <div>
        <label>
          <Button onClick={handleClick}>Добавить трек</Button>

          <HiddenInput ref={ref} type="file" onChange={handleChange} accept=".mp3" />
        </label>
        <ul>
          {
            props.trackList.map((rowData) => (
              <li key={rowData.name}>{rowData.name}</li>
            ))
          }
        </ul>
      </div>

    );
  },
);

export default InputAudio;
