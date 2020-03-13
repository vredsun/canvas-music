import * as React from 'react';

import ButtonPlay from 'components/ui/molecules/button_play/ButtonPlay';
import { useSelector } from 'vs-react-store';
import { selectStateOfPlay } from 'store/selectors';
import { PLAYER_STATE } from 'constants/play_state';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';

type Props = {
  souce: AudioBufferSourceNode;
};

const PlayerButtons: React.FC<Props> = React.memo(
  (props) => {
    const current_player_state = useSelector(selectStateOfPlay);

    React.useEffect(
      () => {
        if (props.souce?.buffer) {
          if (current_player_state === PLAYER_STATE.PAUSE) {
            props.souce?.stop();
          }
        }
      },
      [current_player_state],
    );

    return (
      <FlexContainer justifyContent="center">
        <ButtonPlay />
      </FlexContainer>
    );
  },
);

export default PlayerButtons;
