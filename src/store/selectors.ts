import { VsStoreContextValueState } from 'store/reducer';
import { PLAYER_STATE } from 'constants/play_state';
import { isNullOrUndefined } from 'util';

export const selectMainIsLoaded = (state: VsStoreContextValueState) => {
  return state.main_is_loaded;
};

export const selectVolume = (state: VsStoreContextValueState) => {
  return state.volume;
};
export const selectActiveTrackIndex = (state: VsStoreContextValueState) => {
  return state.active_track_index;
};
export const selectLastCursorTime = (state: VsStoreContextValueState) => {
  return state.last_cursor_time;
};
export const selectTrackList = (state: VsStoreContextValueState) => {
  return state.track_list;
};
export const selectStateOfLoop = (state: VsStoreContextValueState) => {
  return state.state_of_loop;
};

export const selectCurrentTrack = (state: VsStoreContextValueState) => {
  const active_track_index = selectActiveTrackIndex(state);
  const track_list = selectTrackList(state);
  if (!isNullOrUndefined(active_track_index)) {
    return track_list?.[active_track_index];
  }
  return null;
};

export const selectCurrentTrackTrackDataTrackFile = (state: VsStoreContextValueState) => {
  return selectCurrentTrack(state)?.trackFile;
};

export const selectCurrentTrackTrackData = (state: VsStoreContextValueState) => {
  return selectCurrentTrack(state)?.trackAudioBuffer;
};

export const selectCurrentTrackTrackDataDuration = (state: VsStoreContextValueState) => {
  return selectCurrentTrackTrackData(state)?.duration ?? 0;
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

