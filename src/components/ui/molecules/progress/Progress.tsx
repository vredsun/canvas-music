import * as React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'vs-react-store';

import { selectStateOfPlay, selectLastCursorTime, selectCurrentTrackTrackDataDuration } from 'store/selectors';
import { PLAYER_STATE } from 'constants/play_state';
import { secondsInMMSS } from 'utils/time';
import { changeLastCursorTime, changeStateOfPlay } from 'store/actions';

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

const Status = styled.div`
  height: 100%;
  width: 0px;

  background-color: #5588ff;
`;

type Props = {};

const setWidthAndTime = (maxWidth: number, trackDuration: number, diff: number, status: HTMLDivElement, offset: HTMLSpanElement) => {
  const newWidth = `${Math.round((diff / trackDuration) * maxWidth)}px`;
  const curWidth = status.style.width;
  if (newWidth !== curWidth) {
    status.style.width = newWidth;
  }

  const newTime = secondsInMMSS(diff);
  const curTime = offset.innerText;

  if (newTime !== curTime) {
    offset.innerText = newTime;
  }
};

const Progress: React.FC<Props> = React.memo(
  (props) => {
    const refCurrentTime = React.useRef<HTMLSpanElement>();
    const refStatus = React.useRef<HTMLDivElement>();
    const refContainer = React.useRef<HTMLDivElement>();

    const dispatch = useDispatch();

    const current_player_state = useSelector(selectStateOfPlay);
    const last_cursor_time = useSelector(selectLastCursorTime);
    const duration = useSelector(selectCurrentTrackTrackDataDuration);

    React.useEffect(
      () => {
        let animationId = null;
        const time = performance.now();

        const changeStatusWidth = (now: number) => {
          if (current_player_state === PLAYER_STATE.PLAY) {
            animationId = requestAnimationFrame(changeStatusWidth);
          }

          setWidthAndTime(
            refContainer.current.clientWidth,
            duration,
            (now - time) / 1000 + last_cursor_time,
            refStatus.current,
            refCurrentTime.current,
          );
        };

        changeStatusWidth(time);

        return () => {
          if (animationId) {
            cancelAnimationFrame(animationId);
          }
        };
      },
      [current_player_state, last_cursor_time],
    );

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (duration) {
          const maxWidth = refContainer.current.clientWidth;
          const percentOfTrack = (event.screenX - event.currentTarget.getBoundingClientRect().left) / maxWidth;
          const last_cursor_time_new = duration * percentOfTrack;

          const needToPlay = current_player_state === PLAYER_STATE.PLAY;

          if (needToPlay) {
            dispatch(changeStateOfPlay(PLAYER_STATE.PAUSE));
          }
          setImmediate(
            () => {
              dispatch(changeLastCursorTime(last_cursor_time_new));
              if (needToPlay) {
                dispatch(changeStateOfPlay(PLAYER_STATE.PLAY));
              }
            }
          );
        }
      },
      [duration, current_player_state],
    );

    return (
      <Container ref={refContainer} onClick={handleClick}>
        <Status ref={refStatus} />
        <TextPlashkaContainer isVisible={Boolean(duration)}>
          <span ref={refCurrentTime}>{secondsInMMSS(0)}</span>
          <span>{secondsInMMSS(duration)}</span>
        </TextPlashkaContainer>
      </Container>
    );
  },
);

export default Progress;
