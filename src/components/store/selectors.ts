import { VsStoreContextValueState } from 'components/store/reducer';
import { PLAYER_STATE } from 'constants/play_state';

export const selectVolume = (state: VsStoreContextValueState) => {
  return state.volume;
};

export const selectStateOfPlay = (state: VsStoreContextValueState) => {
  return state.state_of_play;
};

export const selectStateOfPlayIsPrepare = (state: VsStoreContextValueState) => {
  return selectStateOfPlay(state) === PLAYER_STATE.PREPARE;
};

export const selectStateOfPlayIsStop = (state: VsStoreContextValueState) => {
  return selectStateOfPlay(state) === PLAYER_STATE.STOP;
};

export const selectMultiply = (state: VsStoreContextValueState) => {
  return state.multiply;
};

export const selectUnionBlocks = (state: VsStoreContextValueState) => {
  return state.unionBlocks;
};
