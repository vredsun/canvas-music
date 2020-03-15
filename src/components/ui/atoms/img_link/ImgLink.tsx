import * as React from 'react';
import styled from 'styled-components';

type Props = {
  src: string;
  path: string;
};

const Img = styled.img`
  width: 2rem;
`;

const ImgLink: React.FC<Props> = React.memo(
  (props) => {
    return (
      <a href={props.path} target="_blank">
        <Img
          src={props.src}
        />
      </a>
    );
  },
);

export default ImgLink;
