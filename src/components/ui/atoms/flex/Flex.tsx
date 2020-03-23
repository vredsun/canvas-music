import styled from 'styled-components';

type Props = {
  grow?: number;
  shrink?: number;
  basis?: number | string;
};

const Flex = styled.div<Props>`
  flex-basis: ${({ basis }) => basis ?? 'initial'};
  flex-grow: ${({ grow }) => grow ?? 'initial'};
  flex-shrink: ${({ shrink }) => shrink ?? 'initial'};
`;

export default Flex;
