import styled from 'styled-components';

type Props = {
  top?: number;
};

const Absolute = styled.div<Props>`
  position: absolute;

  top: ${({ top }) => top ?? 'initial'};
`;

export default Absolute;
