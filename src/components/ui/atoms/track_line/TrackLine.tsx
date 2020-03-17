import * as React from 'react';
import capitalize from 'lodash-es/capitalize';
import styled from 'styled-components';
import { darken } from 'polished';

import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';

type Props = {
  isActive: boolean;
  index: number;
  trackData: File;
  handleRemoveTrack: (file: Props['trackData']) => void;
  setActiveIndex: (index: number) => void;
};

const FlexContainerWrap = styled(FlexContainer)<{ isActive?: boolean }>`
  cursor: pointer;
  background-color: ${({ isActive }) => darken(0.05, !isActive ? 'white' : '#5588ff')};
  color: ${({ isActive }) => !isActive ? 'black' : 'white'};

  &:hover {
    background-color: ${({ isActive }) => darken(0.1, !isActive ? 'white' : '#5588ff')};
  }

  transition: border 0.3s;
`;

const ReplaceFormatStrRegExp = new RegExp(/\.mp3/g);

const prepareTrackName = (name: string) => {
  return capitalize(
    name
      .replace(ReplaceFormatStrRegExp, '')
  );
};

const TrackLine: React.FC<Props> = React.memo(
  (props) => {
    const handleClickLine = React.useCallback(
      (event) => {
        event.preventDefault();
        props.setActiveIndex(props.index);
      },
      [props.setActiveIndex, props.index],
    );

    const handleClickRemove = React.useCallback(
      () => {
        props.handleRemoveTrack(props.trackData);
      },
      [props.handleRemoveTrack, props.trackData],
    );

    return (
      <FlexContainerWrap justifyContent="space-between" onClick={handleClickLine} isActive={props.isActive}>
        <span>{prepareTrackName(props.trackData.name)}</span>
        <button onClick={handleClickRemove}>remove</button>
      </FlexContainerWrap>
    );
  },
);

export default TrackLine;
