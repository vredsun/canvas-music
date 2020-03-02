import { PlayerContextValueState } from 'components/player_context/PlayerContext';

export const selectVolume = (state: PlayerContextValueState) => {
  return state.volume;
};

export const selectStateOfPlay = (state: PlayerContextValueState) => {
  return state.state_of_play;
};

export const selectMultiply = (state: PlayerContextValueState) => {
  return state.multiply;
};

export const selectUnionBlocks = (state: PlayerContextValueState) => {
  return state.unionBlocks;
};
