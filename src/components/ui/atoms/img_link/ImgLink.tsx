import * as React from 'react';
import styled from 'styled-components';

type Props = {
  src: string;
  path: string;
};

const Img = styled.img`
  width: 2rem;
  cursor: pointer;
`;

const ImgLink: React.FC<Props> = React.memo(
  (props) => {
    const handleClick = React.useCallback(
      () => {
        // history.pushState(props.path);
      },
      [props.path],
    );

    return (
      <a href={props.path}>
        <Img
          src={props.src}
          onClick={handleClick}
        />
      </a>
    );
  },
);

export default ImgLink;
