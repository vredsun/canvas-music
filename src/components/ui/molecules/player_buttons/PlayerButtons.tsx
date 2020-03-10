import * as React from 'react';

import ButtonStop from 'components/ui/molecules/button_stop/ButtonStop';
import ButtonPlay from 'components/ui/molecules/button_play/ButtonPlay';
import { useSelector } from 'vs-react-store';
import { selectStateOfPlay } from 'components/store/selectors';
import { PLAYER_STATE } from 'constants/play_state';

type Props = {
  souce: AudioBufferSourceNode;
};

const PlayerButtons: React.FC<Props> = React.memo(
  (props) => {
    const current_player_state = useSelector(selectStateOfPlay);

    React.useEffect(
      () => {
        if (current_player_state === PLAYER_STATE.PAUSE) {
          props.souce?.stop();
        }
        if (current_player_state === PLAYER_STATE.STOP) {
          props.souce?.stop();
        }
      },
      [current_player_state],
    );

    return (
      <div>
        <ButtonStop />
        <ButtonPlay />
      </div>
    );
  },
);

export default PlayerButtons;
