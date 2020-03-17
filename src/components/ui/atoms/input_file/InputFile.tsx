import * as React from 'react';
import styled from 'styled-components';

type Props = {
  ref: React.MutableRefObject<HTMLInputElement>;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  accept?: string;
  multiple?: boolean;
};

const HiddenInput = styled.input`
  display: none;
`;

const InputFile = React.forwardRef<HTMLInputElement, React.PropsWithChildren<Props>>(
  (props, ref) => {
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        props.handleChange(event);
      },
      [props.handleChange],
    );

    return (
      <label>
        { props.children }
        <HiddenInput ref={ref} type="file" onChange={handleChange} accept={props.accept} multiple={props.multiple} />
      </label>
    );
  },
);

export default InputFile;
