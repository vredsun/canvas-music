import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'vs-react-store';

import GithubLink from 'components/ui/molecules/github_link/GithubLink';
import { selectMainIsLoaded } from 'store/selectors';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';
import { main_blue_color } from 'constants/color';
import { DEFAULT_ANIMATION_TIME } from 'constants/animation_time';

type Props = {};

const HeaderLoading = styled.h1`
  margin: 0 20px;
  cursor: default;

  &::after {
    content: "Canvas Music"
  }

  @media (max-width: 400px) {
    &::after {
      content: "VRS.CM"
    }
  }

`;

const Container = styled.div<{ isLoaded: boolean }>`
  flex: 1;
  background-color: ${main_blue_color};
  color: white;
`;

const FlexContainerWrap = styled.div<{ isLoaded: boolean }>`
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
  min-width: max-content;

  width: ${({ isLoaded }) => isLoaded ? 100 : 0}%;
  transition: width ${DEFAULT_ANIMATION_TIME}ms;
`;

const LinkLine = styled(FlexContainer)<{ isLoaded: boolean }>`
  position: absolute;
  right: 0;
  margin: 0 20px;

  transform: ${({ isLoaded }) => !isLoaded ? 'translate(200%, 0px)' : 'translate(0%, 0px)'};
  transition: transform ${ DEFAULT_ANIMATION_TIME}ms cubic-bezier(0.4, 0, 1, 1);
`;

const AppTitle: React.FC<Props> = React.memo(
  () => {
    const [isLoaded, setIsLoaded] = React.useState(false);
    const main_is_loaded = useSelector(selectMainIsLoaded);

    React.useEffect(
      () => {
        if (main_is_loaded) {
          let animationId = null;
          let timeState = performance.now();

          const awaitLoad = (now: number) => {
            // console.log({ now, timeState })
            if (now - timeState > DEFAULT_ANIMATION_TIME) {
              if (animationId) {
                cancelAnimationFrame(animationId);
                setIsLoaded(true);
              }
            } else {
              animationId = requestAnimationFrame(awaitLoad);
            }
          };

          awaitLoad(timeState);

          return () => {
            if (animationId) {
              cancelAnimationFrame(animationId);
            }
          };
        }
      },
      [main_is_loaded],
    );

    return (
      <FlexContainerWrap isLoaded={isLoaded}>
        <Container isLoaded={isLoaded}>
          <HeaderLoading title="vredsun.canvas music"></HeaderLoading>
        </Container>
        <LinkLine isLoaded={isLoaded}>
          <GithubLink />
        </LinkLine>
      </FlexContainerWrap>

    );
  },
);

export default AppTitle;
