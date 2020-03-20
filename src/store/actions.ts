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
export const CHANGE_LAST_CURSOR_TIME = 'CHANGE_LAST_CURSOR_TIME';
export const CHANGE_STATE_OF_PLAY_ON_PLAY_FROM_START = 'CHANGE_STATE_OF_PLAY_ON_PLAY_FROM_START';
export const CHANGE_ACTIVE_TRACK_INDEX = 'CHANGE_ACTIVE_TRACK_INDEX';
export const CHANGE_TRACK_LIST_ONE_TRACK = 'CHANGE_TRACK_LIST_ONE_TRACK';
export const ADD_INDEX_ACTIVE_TRACK_INDEX = 'ADD_INDEX_ACTIVE_TRACK_INDEX';

export const ADD_TRACKS_FROM_TRACK_LIST = 'ADD_TRACKS_FROM_TRACK_LIST';
export const REMOVE_TRACK_FROM_TRACK_LIST = 'REMOVE_TRACK_FROM_TRACK_LIST';

export const changeTrackListOneTrack = (old_track: VsStoreContextValueState['track_list'][0], new_track: VsStoreContextValueState['track_list'][0]) => ({
  type: CHANGE_TRACK_LIST_ONE_TRACK,
  payload: {
    old_track,
    new_track,
  },
});

export const addTracksFromTrackList = (files: VsStoreContextValueState['track_list']) => ({
  type: ADD_TRACKS_FROM_TRACK_LIST,
  payload: {
    files,
  },
});
export const removeTrackFromTrackList = (file_or_index: VsStoreContextValueState['track_list'][0] | number) => ({
  type: REMOVE_TRACK_FROM_TRACK_LIST,
  payload: {
    file_or_index,
  },
});

export const changeActiveTrackIndex = (active_track_index: VsStoreContextValueState['active_track_index']) => ({
  type: CHANGE_ACTIVE_TRACK_INDEX,
  payload: {
    active_track_index,
  },
});

export const addIndexToActiveTrackIndex = (count_add: number) => ({
  type: ADD_INDEX_ACTIVE_TRACK_INDEX,
  payload: {
    count_add,
  },
});

export const changeActiveTrackIndexToNextTrack = () => addIndexToActiveTrackIndex(1);
export const changeActiveTrackIndexToPrevTrack = () => addIndexToActiveTrackIndex(-1);

export const changeStateOfPlay = (state_of_play: VsStoreContextValueState['state_of_play']) => ({
  type: CHANGE_STATE_OF_PLAY,
  payload: {
    state_of_play,
  },
});

export const changeStateOfPlayOnPlayFromStart = () => ({
  type: CHANGE_STATE_OF_PLAY_ON_PLAY_FROM_START,
  payload: {},
});

export const changeStateOfPlayOnPlay = () => (
  changeStateOfPlay(PLAYER_STATE.PLAY)
);
export const changeStateOfPlayOnPrepare = () => (
  changeStateOfPlay(PLAYER_STATE.PREPARE)
);
export const changeStateOfPlayOnNodata = () => (
  changeStateOfPlay(PLAYER_STATE.NODATA)
);

export const changeLastCursorTime = (last_cursor_time: VsStoreContextValueState['last_cursor_time']) => {
  return {
    type: CHANGE_LAST_CURSOR_TIME,
    payload: {
      last_cursor_time,
    },
  };
};

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
