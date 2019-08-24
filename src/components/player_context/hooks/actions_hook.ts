import { usePlayerDispatch } from 'components/player_context/hooks/_hooks';
import { PLAYER_STATE__STOP, PLAYER_STATE__PAUSE, PLAYER_STATE__PLAY } from 'constants/play_state';
import { changeStateOfPlay } from 'components/player_context/actions';

export const useStopMusic = () => {
  const dispatch = usePlayerDispatch();

  return () => {
    dispatch(changeStateOfPlay(PLAYER_STATE__STOP));
  };
};

export const usePauseMusic = () => {
  const dispatch = usePlayerDispatch();

  return () => {
    dispatch(changeStateOfPlay(PLAYER_STATE__PAUSE));
  };
};

export const usePlayMusic = () => {
  const dispatch = usePlayerDispatch();
  return () => {
    dispatch(changeStateOfPlay(PLAYER_STATE__PLAY));
  };
};
