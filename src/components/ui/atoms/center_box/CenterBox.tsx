import * as React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  flex: 1 1 auto;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const CenterBox: React.FC<{}> = React.memo(
  (props) => {
    return (
      <Container>
        {props.children}
      </Container>
    );
  },
);

export default CenterBox;
