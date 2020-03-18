import * as React from 'react';
import styled from 'styled-components';

type Props = {
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

const VerticalRangeBlock = styled.div<{ minValue: number; maxValue: number; value: number }>`
  position: absolute;
  bottom: 0;
  background-color: #5588ff;
  width: 100%;
  height: ${({ value, minValue, maxValue }) => 100 * getPercent(minValue, maxValue, value)}px;
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

const VerticalRange: React.FC<Props> = React.memo(
  (props) => {
    const node = React.useRef<HTMLDivElement>();
    const handleClick = React.useCallback(
      (event) => {
        const maxHeight = node.current.clientHeight;

        const newValue = (maxHeight - (event.clientY - event.currentTarget.getBoundingClientRect().top)) / maxHeight;

        props.onChange(newValue);
      },
      [],
    );

    return (
      <Container>
        vol
        <VerticalRangeBlockContainer ref={node} onClick={handleClick}>
          <VerticalRangeBlock value={props.value} maxValue={props.max} minValue={props.min}/>
        </VerticalRangeBlockContainer>
      </Container>
    );
  },
);

export default VerticalRange;
