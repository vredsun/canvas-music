import * as React from 'react';
import GithubImg from './GitHub.png';
import ImgLink from 'components/ui/atoms/img_link/ImgLink';

type Props = {};

const GithubLink: React.FC<Props> = React.memo(
  (props) => {

    return (
      <ImgLink
        src={GithubImg}
        path="https://github.com/vredsun/canvas-music"
      />
    );
  },
);

export default GithubLink;
