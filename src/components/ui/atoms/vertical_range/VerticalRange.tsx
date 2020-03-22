import * as React from 'react';
import styled from 'styled-components';
import { isNullOrUndefined } from 'util';

type Props = {
  label?: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: Props['value']) => void;
};

const getPercent = (minValue: number, maxValue: number, value: number) => {
  return (value - minValue) / (maxValue - minValue);
};

const VerticalRangeBlockContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
  width: 100%;
  height: 100px;

  transform: translate(0, -50%) scale(1, 0);

  transition: transform 0.3s;
`;

const VerticalRangeBlock = styled.div`
  position: absolute;
  bottom: 0;
  background-color: #5588ff;
  width: 100%;
  height: 0px;
`;

const Container = styled.div`
  background-color: rgba(0, 0, 0, 0.25);
  height: 30px;
  border-left: 1px solid black;
  width: 30px;
  position: relative;
  padding: 0 5px;
  cursor: pointer;

  &:hover, &:focus, &:active {
    ${VerticalRangeBlockContainer} {
      transform: translate(0, -100%) scale(1, 1);
    }
  }

  transition: background-color 0.3s;
`;

const calcNewValue = (min: number, max: number, refWithMaxHeight: React.MutableRefObject<HTMLDivElement>, clientY: number, currentTarget: HTMLDivElement, step: number) => {
  const maxHeight = refWithMaxHeight.current.clientHeight;

  let newValue = (maxHeight - (clientY - currentTarget.getBoundingClientRect().top)) / maxHeight;

  newValue = Math.max(min, newValue);
  newValue = Math.min(max, newValue);
  newValue = newValue - (newValue % step);

  return newValue;
};

const VerticalRange: React.FC<Props> = React.memo(
  (props) => {
    const [beforeMuteValue, setBeforeMuteValue] = React.useState<number>(null);
    const [isMouseDown, setIsMouseDown] = React.useState(false);
    const node = React.useRef<HTMLDivElement>();
    const verticalRangeRef = React.useRef<HTMLDivElement>();

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
        setIsMouseDown(true);
        let clientY = 0;

        if ('touches' in event) {
          const touchEvent = event.touches?.[0];

          clientY = touchEvent.clientY;
        } else {
          clientY = event.clientY;
        }

        props.onChange(
          calcNewValue(
            props.min,
            props.max,
            node,
            clientY,
            event.currentTarget,
            props.step,
          )
        );
      },
      [
        props.onChange,
        props.min,
        props.max,
        props.step,
      ],
    );

    const handleMouseLeave = React.useCallback(
      (event) => {
        setIsMouseDown(false);
      },
      [],
    );

    const handleMouseMove = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement, MouseEvent> | React.TouchEvent<HTMLDivElement>) => {
        if (isMouseDown) {
          let clientY = 0;

          if ('touches' in event) {
            const touchEvent = event.touches?.[0];

            clientY = touchEvent.clientY;
          } else {
            clientY = event.clientY;
          }

          props.onChange(
            calcNewValue(
              props.min,
              props.max,
              node,
              clientY,
              event.currentTarget,
              props.step,
            )
          );
        }
      },
      [
        isMouseDown,
        props.onChange,
        props.min,
        props.max,
        props.step,
      ],
    );

    React.useEffect(
      () => {
        if (verticalRangeRef.current) {
          verticalRangeRef.current.style.height = `${100 * getPercent(props.min, props.max, props.value)}px`;
        }
      },
      [props.value, props.max, props.min],
    );

    const handleMute = React.useCallback(
      () => {
        if (props.value) {
          setBeforeMuteValue(props.value);
          props.onChange(props.min);
        } else if (!isNullOrUndefined(beforeMuteValue)) {
          props.onChange(beforeMuteValue);
        }
      },
      [props.onChange, props.value, beforeMuteValue],
    );

    return (
      <Container>
        <span onClick={handleMute}>
          {props.label}
        </span>
        <VerticalRangeBlockContainer
          ref={node}
          onTouchStart={handleClick}
          onMouseDown={handleClick}
          onTouchMove={handleMouseMove}
          onMouseMove={handleMouseMove}
          onTouchEnd={handleMouseLeave}
          onMouseUp={handleMouseLeave}
          onMouseLeave={handleMouseLeave}
        >
          <VerticalRangeBlock ref={verticalRangeRef} />
        </VerticalRangeBlockContainer>
      </Container>
    );
  },
);

export default VerticalRange;
