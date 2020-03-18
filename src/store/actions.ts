import { VsStoreContextValueState } from 'store/reducer';
import { PLAYER_STATE } from 'constants/play_state';

export const CHANGE_STATE_OF_PLAY = 'CHANGE_STATE_OF_PLAY';
export const CHANGE_VOLUME = 'CHANGE_VOLUME';
export const CHANGE_MULTIPLY = 'CHANGE_MULTIPLY';
export const CHANGE_UNION_BLOCKS = 'CHANGE_UNION_BLOCKS';
export const CHANGE_ALL_BYTES = 'CHANGE_ALL_BYTES';
export const CHANGE_LOADED_BYTES = 'CHANGE_LOADED_BYTES';
export const CHANGE_IS_FADING = 'CHANGE_IS_FADING';
export const CHANGE_STATE_OF_LOOP = 'CHANGE_STATE_OF_LOOP';
export const CHANGE_START_TIME = 'CHANGE_START_TIME';
export const CHANGE_LAST_CURSOR_TIME = 'CHANGE_LAST_CURSOR_TIME';

export const changeStateOfPlay = (state_of_play: VsStoreContextValueState['state_of_play']) => ({
  type: CHANGE_STATE_OF_PLAY,
  payload: {
    state_of_play,
  },
});

export const changeStateOfPlayOnPlay = () => (
  changeStateOfPlay(PLAYER_STATE.PLAY)
);
export const changeStateOfPlayOnPause = () => (
  changeStateOfPlay(PLAYER_STATE.PAUSE)
);
export const changeStateOfPlayOnPrepare = () => (
  changeStateOfPlay(PLAYER_STATE.PREPARE)
);
export const changeStateOfPlayOnNodata = () => (
  changeStateOfPlay(PLAYER_STATE.NODATA)
);

export const changeStartTime = (start_time: VsStoreContextValueState['start_time']) => ({
  type: CHANGE_START_TIME,
  payload: {
    start_time,
  },
});

export const changeLastCursorTime = (last_cursor_time: VsStoreContextValueState['last_cursor_time']) => ({
  type: CHANGE_LAST_CURSOR_TIME,
  payload: {
    last_cursor_time,
  },
});

export const changeVolume = (volume: VsStoreContextValueState['volume']) => ({
  type: CHANGE_VOLUME,
  payload: {
    volume,
  },
});

export const changeMultiply = (multiply: VsStoreContextValueState['multiply']) => ({
  type: CHANGE_MULTIPLY,
  payload: {
    multiply,
  },
});

export const changeUnionBlocks = (unionBlocks: VsStoreContextValueState['unionBlocks']) => ({
  type: CHANGE_UNION_BLOCKS,
  payload: {
    unionBlocks,
  },
});

export const changeIsFading = (isFading: VsStoreContextValueState['isFading']) => ({
  type: CHANGE_IS_FADING,
  payload: {
    isFading,
  },
});

export const changeAllBytes = (all_bytes: VsStoreContextValueState['all_bytes']) => ({
  type: CHANGE_ALL_BYTES,
  payload: {
    loaded_bytes: 0,
    all_bytes,
  },
});

export const changeLoadedBytes = (loaded_bytes: VsStoreContextValueState['loaded_bytes'], all_bytes: VsStoreContextValueState['all_bytes']) => ({
  type: CHANGE_LOADED_BYTES,
  payload: {
    loaded_bytes,
    all_bytes,
  },
});

export const changeStateOfLoop = (state_of_loop: VsStoreContextValueState['state_of_loop']) => ({
  type: CHANGE_STATE_OF_LOOP,
  payload: {
    state_of_loop,
  },
});
