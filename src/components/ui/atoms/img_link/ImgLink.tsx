import * as React from 'react';
import styled from 'styled-components';

type Props = {
  title: string;
  alt: string;
  src: string;
  path: string;
};

const Img = styled.img`
  width: 2rem;
`;

const ImgLink: React.FC<Props> = React.memo(
  (props) => {
    return (
      <a title={props.title} href={props.path} target="_blank">
        <Img
          alt={props.alt}
          src={props.src}
        />
      </a>
    );
  },
);

export default ImgLink;
