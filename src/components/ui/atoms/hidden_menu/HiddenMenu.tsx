import * as React from 'react';
import styled, { css } from 'styled-components';
import { DEFAULT_ANIMATION_TIME } from 'constants/animation_time';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';
import Flex from 'components/ui/atoms/flex/Flex';
import { main_blue_color } from 'constants/color';

type Props = {
  title?: string;
  position: 'left' | 'right';

  isManual?: boolean;
  isOpen?: boolean;
};

const leftPositionCss = (isOpen: boolean) => css`
  transform: translate(${!isOpen ? 'calc(-100% + 50px)' : '0%'});

  &:hover {
    transform: translate(0%);
  }
`;

const rightPositionCss = (isOpen) => css`
  transform: translate(${!isOpen ? 'calc(100% - 50px)' : '0%'});

  &:hover {
    transform: translate(0%);
  }
`;

const Container = styled.div<Props>`
  height: 100%;

  display: flex;
  flex-direction: column;

  position: relative;
  ${({ position, isOpen }) => (
    position === 'left' && leftPositionCss(isOpen)
  )};

  ${({ position, isOpen }) => (
    position === 'right' && rightPositionCss(isOpen)
  )};


  transition: transform ${DEFAULT_ANIMATION_TIME}ms;
`;

const ChildrenWrap = styled.div`
  flex: 1;
  margin: 20px 0;
  border: 1px solid black;
`;

const FlexContainerWrap = styled(FlexContainer)`
  height: 100%;
`;

const Plashka = styled.div`
  width: 50px;
  height: 100%;

  background-color: ${main_blue_color};

  word-break: break-all;
  font-size: 3rem;
  color: white;
  text-align: center;
`;

const HiddenMenu: React.FC<Props> = React.memo(
  (props) => {
    return (
      <Container position={props.position} isOpen={props.isManual ? props.isOpen : undefined}>
        <ChildrenWrap>
          <FlexContainerWrap flexDirection={props.position === 'right' ? 'row' : 'row-reverse'}>
            <Flex shrink={0}>
              <Plashka>{props.title}</Plashka>
            </Flex>
            <Flex grow={1}>
              {props.children}
            </Flex>
          </FlexContainerWrap>
        </ChildrenWrap>
      </Container>
    );
  },
);

export default HiddenMenu;
