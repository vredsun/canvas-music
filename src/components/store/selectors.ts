import { VsStoreContextValueState } from 'components/store/reducer';

export const selectVolume = (state: VsStoreContextValueState) => {
  return state.volume;
};

export const selectStateOfPlay = (state: VsStoreContextValueState) => {
  return state.state_of_play;
};

export const selectMultiply = (state: VsStoreContextValueState) => {
  return state.multiply;
};

export const selectUnionBlocks = (state: VsStoreContextValueState) => {
  return state.unionBlocks;
};
