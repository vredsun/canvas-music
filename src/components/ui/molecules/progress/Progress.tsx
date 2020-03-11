import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'vs-react-store';

import { selectStateOfPlay } from 'store/selectors';
import { PLAYER_STATE } from 'constants/play_state';
import { secondsInMMSS } from 'utils/time';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 30px;

  cursor: pointer;

  background-color: rgba(0, 0, 0, 0.25);
`;

const TextPlashkaContainer = styled.div<{ isVisible: boolean }>`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%) scale(1, ${({ isVisible }) => isVisible ? 1 : 0});
  left: 0;
  right: 0;

  height: 100%;

  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 0.15rem 10px;

  color: white;
  pointer-events: none;

  transition: transform 0.3s;
`;

const Status = styled.div<{ trackDuration: number; currentWidth: number }>`
  height: 100%;
  width: ${({ currentWidth }) => currentWidth}px;

  background-color: #5588ff;

  transition: width ${({ trackDuration }) => trackDuration}s linear;
`;

type Props = {
  trackDuration: number;
  currentPosition: number;
  wasMoveByTimeOffset: boolean;

  handleChangeCurrentPosition: (newCurrentPosition: number) => void;
};

const getWidthByData = (maxWidth: number, maxValue: number, value: number) => {
  return maxValue ? maxWidth * value / maxValue : 0;
};

const Progress: React.FC<Props> = React.memo(
  (props) => {
    const refContainer = React.useRef<HTMLDivElement>();

    const [transitionDurection, setTransitionDurection] = React.useState(0);
    const [currentWidth, setCurrentWidth] = React.useState(0);

    const current_player_state = useSelector(selectStateOfPlay);

    React.useEffect(
      () => {
        if (!props.wasMoveByTimeOffset) {
          const maxWidth = refContainer.current.clientWidth;

          if (current_player_state === PLAYER_STATE.PLAY && props.trackDuration) {
            setTransitionDurection(props.trackDuration - props.currentPosition);
            setCurrentWidth(maxWidth);
          }
        }
      },
      [current_player_state, props.wasMoveByTimeOffset, props.trackDuration],
    );

    React.useEffect(
      () => {
        if (props.wasMoveByTimeOffset) {
          const maxWidth = refContainer.current.clientWidth;
          setTransitionDurection(0);
          setCurrentWidth(getWidthByData(maxWidth, props.trackDuration, props.currentPosition));
        }
      },
      [props.wasMoveByTimeOffset, props.currentPosition],
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const maxWidth = refContainer.current.clientWidth;
        const percentOfTrack = (event.screenX - event.currentTarget.getBoundingClientRect().left) / maxWidth;
        const newTrackPosition = props.trackDuration * percentOfTrack;

        props.handleChangeCurrentPosition(newTrackPosition);
      },
      [props.trackDuration, props.handleChangeCurrentPosition],
    );

    return (
      <Container ref={refContainer} onClick={handleClick}>
        <Status
          trackDuration={transitionDurection}
          currentWidth={currentWidth}
        />
        <TextPlashkaContainer isVisible={Boolean(props.trackDuration)}>
          <span>{secondsInMMSS(props.currentPosition)}</span>
          <span>{secondsInMMSS(props.trackDuration ?? 0)}</span>
        </TextPlashkaContainer>
      </Container>
    );
  },
);

export default Progress;
