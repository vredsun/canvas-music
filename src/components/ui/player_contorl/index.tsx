import * as React from 'react';
import { usePlayerStateOfPlay } from 'components/player_context/hooks/state_hooks';
import { PLAYER_STATE__STOP, PLAYER_STATE__PAUSE, PLAYER_STATE__PLAY } from 'constants/play_state';
import { usePlayMusic, usePauseMusic, useStopMusic } from 'components/player_context/hooks/actions_hook';

export const UiPlayerContorl: React.FC<{}> = () => {
  const current_player_state = usePlayerStateOfPlay();
  const handlePlayMusic = usePlayMusic();
  const handlePauseMusic = usePauseMusic();
  const handleStopMusic = useStopMusic();

  return (
    <div>
      {
        Boolean(current_player_state === PLAYER_STATE__STOP || current_player_state === PLAYER_STATE__PAUSE) && (
          <div onClick={handlePlayMusic}>Play</div>
        )
      }
      {
        Boolean(current_player_state === PLAYER_STATE__PLAY) && (
          <div onClick={handlePauseMusic}>Pause</div>
          )
      }
      {
        Boolean(current_player_state === PLAYER_STATE__PLAY || current_player_state === PLAYER_STATE__PAUSE) && (
          <div onClick={handleStopMusic}>Stop</div>
        )
      }
    </div>
  );
};
