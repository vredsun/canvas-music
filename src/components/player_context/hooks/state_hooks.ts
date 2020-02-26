import { usePlayerState } from 'components/player_context/hooks/_hooks';

export const usePlayerStateOfPlay = () => {
  return usePlayerState().state_of_play;
};

export const usePlayerVolume = () => {
  return usePlayerState().volume;
};

export const usePlayerMultiply = () => {
  return usePlayerState().multiply;
};

export const usePlayerUnionBlocks = () => {
  return usePlayerState().unionBlocks;
};

