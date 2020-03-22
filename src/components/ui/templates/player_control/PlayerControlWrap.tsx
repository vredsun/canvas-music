import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';
import styled from 'styled-components';

import PlayerControl from 'components/ui/templates/player_control/PlayerControl';
import { selectMainIsLoaded } from 'store/selectors';
import { setMailIsLoaded } from 'store/actions';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';
import { DEFAULT_ANIMATION_TIME } from 'constants/animation_time';

type Props = {};

const FlexContainerWrap = styled(FlexContainer)<{ isLoaded: boolean }>`
  overflow: hidden;
  flex: ${({ isLoaded }) => isLoaded ? '1' : '0'};
  opacity: ${({ isLoaded }) => isLoaded ? '1' : '0'};
  transition: flex ${DEFAULT_ANIMATION_TIME}ms, opacity ${DEFAULT_ANIMATION_TIME}ms;
`;

const PlayerControlWrap: React.FC<Props> = React.memo(
  (props) => {
    const main_is_loaded = useSelector(selectMainIsLoaded);
    const dispatch = useDispatch();

    React.useEffect(
      () => {
        dispatch(setMailIsLoaded());
      },
      [],
    );

    return (
      <FlexContainerWrap isLoaded={main_is_loaded} flexDirection="column">
        <PlayerControl />
      </FlexContainerWrap>

    );
  },
);

export default PlayerControlWrap;
