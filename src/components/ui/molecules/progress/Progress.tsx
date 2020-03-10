import * as React from 'react';
import styled from 'styled-components';
import { useSelector } from 'vs-react-store';
import { selectStateOfPlay } from 'components/store/selectors';
import { NEED_UPDATE } from 'constants/need_update';
import { PLAYER_STATE } from 'constants/play_state';

const Container = styled.div`
  width: 100%;
  height: 20px;

  background-color: rgba(0, 0, 0, 0.25);
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
      [props.wasMoveByTimeOffset],
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const maxWidth = refContainer.current.clientWidth;
        const percentOfTrack = (event.screenX - (event.target as HTMLDivElement).getBoundingClientRect().left) / maxWidth;
        const newTrackPosition = props.trackDuration * percentOfTrack;

        if (NEED_UPDATE) {
          props.handleChangeCurrentPosition(newTrackPosition);
          console.info({ maxWidth, newTrackPosition, trackDuration: props.trackDuration, percentOfTrack });
        }
      },
      [props.trackDuration, props.handleChangeCurrentPosition],
    );

    return (
      <Container ref={refContainer} onClick={handleClick}>
        <Status
          trackDuration={transitionDurection}
          currentWidth={currentWidth}
        />
      </Container>
    );
  },
);

export default Progress;
