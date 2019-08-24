import { usePlayerState } from 'components/player_context/hooks/_hooks';

export const usePlayerStateOfPlay = () => {
  return usePlayerState().state_of_play;
};
