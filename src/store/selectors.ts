import { VsStoreContextValueState } from 'store/reducer';
import { PLAYER_STATE } from 'constants/play_state';

export const selectVolume = (state: VsStoreContextValueState) => {
  return state.volume;
};

export const selectStateOfLoop = (state: VsStoreContextValueState) => {
  return state.state_of_loop;
};

export const selectStateOfPlay = (state: VsStoreContextValueState) => {
  return state.state_of_play;
};

export const selectStateOfPlayNoData = (state: VsStoreContextValueState) => {
  return selectStateOfPlay(state) === PLAYER_STATE.NODATA;
};
export const selectStateOfPlayIsPrepare = (state: VsStoreContextValueState) => {
  return selectStateOfPlay(state) === PLAYER_STATE.PREPARE;
};

export const selectIsDisabledForPlay = (state: VsStoreContextValueState) => {
  return selectStateOfPlayNoData(state) || selectStateOfPlayIsPrepare(state);
};

export const selectMultiply = (state: VsStoreContextValueState) => {
  return state.multiply;
};

export const selectUnionBlocks = (state: VsStoreContextValueState) => {
  return state.unionBlocks;
};

export const selectAllBytes = (state: VsStoreContextValueState) => {
  return state.all_bytes;
};

export const selectLoaded = (state: VsStoreContextValueState) => {
  return state.loaded_bytes;
};

export const selectIsFading = (state: VsStoreContextValueState) => {
  return state.isFading;
};

