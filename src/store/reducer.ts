import { createReducer } from 'vs-react-store';
import groupBy from 'lodash-es/groupBy';

import {
  CHANGE_VOLUME,
  changeVolume,
  CHANGE_MULTIPLY,
  changeMultiply,
  CHANGE_UNION_BLOCKS,
  changeUnionBlocks,
  CHANGE_STATE_OF_PLAY,
  changeStateOfPlay,
  CHANGE_ALL_BYTES,
  changeAllBytes,
  CHANGE_LOADED_BYTES,
  changeLoadedBytes,
  CHANGE_IS_FADING,
  changeIsFading,
  CHANGE_STATE_OF_LOOP,
  changeStateOfLoop,
  CHANGE_LAST_CURSOR_TIME,
  changeLastCursorTime,
  CHANGE_STATE_OF_PLAY_ON_PLAY_FROM_START,
  changeStateOfPlayOnPlayFromStart,
  CHANGE_ACTIVE_TRACK_INDEX,
  changeActiveTrackIndex,
  ADD_TRACKS_FROM_TRACK_LIST,
  addTracksFromTrackList,
  REMOVE_TRACK_FROM_TRACK_LIST,
  removeTrackFromTrackList,
  CHANGE_TRACK_LIST_ONE_TRACK,
  changeTrackListOneTrack,
  addIndexToActiveTrackIndex,
  ADD_INDEX_ACTIVE_TRACK_INDEX,
  SET_MAIN_IS_LOADED,
  setMailIsLoaded,
} from 'store/actions';
import { PLAYER_STATE } from 'constants/play_state';
import { LOOP_STATE } from 'constants/play_loop';
import { isNumber, isNullOrUndefined } from 'util';

export type VsStoreContextValueState = {
  main_is_loaded: boolean;
  last_cursor_time: number;
  state_of_loop: LOOP_STATE;
  state_of_play: PLAYER_STATE;
  volume: number;
  multiply: number;
  unionBlocks: number;

  loaded_bytes: number;
  all_bytes: number;
  isFading: boolean;

  active_track_index: number | null;
  track_list: Array<{ trackFile: File; trackAudioBuffer: AudioBuffer | null }>;
};

const default_value: VsStoreContextValueState = {
  main_is_loaded: false,
  last_cursor_time: 0,
  state_of_loop: LOOP_STATE.ALL_LOOP,
  state_of_play: PLAYER_STATE.NODATA,
  volume: 0.5,
  multiply: 2,
  unionBlocks: 1,
  loaded_bytes: 0,
  all_bytes: 0,
  isFading: false,

  active_track_index: null,
  track_list: [],
};

const initStore = (): VsStoreContextValueState => {
  const userData: Partial<VsStoreContextValueState> = JSON.parse(localStorage.getItem('userData'));

  return {
    main_is_loaded: default_value.main_is_loaded,
    last_cursor_time: default_value.last_cursor_time,
    state_of_play: default_value.state_of_play,
    loaded_bytes: default_value.loaded_bytes,
    all_bytes: default_value.all_bytes,
    active_track_index: default_value.active_track_index,
    track_list: default_value.track_list,

    state_of_loop: userData?.state_of_loop ?? default_value.state_of_loop,
    volume: userData?.volume ?? default_value.volume,
    multiply: userData?.multiply ?? default_value.multiply,
    unionBlocks: userData?.unionBlocks ?? default_value.unionBlocks,
    isFading: userData?.isFading ?? default_value.isFading,
  };
};

export const reducer = createReducer<VsStoreContextValueState>(
  () => {
    return initStore();
  },
  {
    [SET_MAIN_IS_LOADED](state, { payload }: ReturnType<typeof setMailIsLoaded>) {
      return {
        ...state,
        main_is_loaded: true,
      };
    },
    [ADD_INDEX_ACTIVE_TRACK_INDEX](state, { payload }: ReturnType<typeof addIndexToActiveTrackIndex>) {
      const track_list_length = state.track_list.length;
      let active_track_index_new = state.active_track_index;

      if (!isNullOrUndefined(active_track_index_new) && track_list_length) {
        active_track_index_new = (track_list_length + active_track_index_new + payload.count_add) % track_list_length;
      }

      return {
        ...state,
        active_track_index: active_track_index_new,
      };
    },
    [CHANGE_TRACK_LIST_ONE_TRACK](state, { payload }: ReturnType<typeof changeTrackListOneTrack>) {
      const track_list_new = state.track_list.map(
        (trackData) => (
          trackData === payload.old_track
            ? payload.new_track
            : trackData
        )
      );

      const state_of_play_new = state.state_of_play === PLAYER_STATE.NODATA || state.state_of_play === PLAYER_STATE.PREPARE
        ? PLAYER_STATE.PAUSE
        : state.state_of_play;

      return {
        ...state,
        track_list: track_list_new,
        state_of_play: state_of_play_new
      };
    },
    [REMOVE_TRACK_FROM_TRACK_LIST](state, { payload }: ReturnType<typeof removeTrackFromTrackList>) {
      const track_list_new = state.track_list.filter(
        (trackData, index) => (
          isNumber(payload.file_or_index)
            ? payload.file_or_index !== index
            : trackData !== payload.file_or_index
        )
      );

      const track_list_new_lenth = track_list_new.length;
      let active_track_index_new = null;
      let state_of_play_new = state.state_of_play;
      let last_cursor_time_new = state.last_cursor_time;

      if (track_list_new_lenth) {
        active_track_index_new = Math.min(state.active_track_index, track_list_new.length);
      } else {
        active_track_index_new = null;
        state_of_play_new = PLAYER_STATE.NODATA;
        last_cursor_time_new = 0;
      }

      return {
        ...state,
        track_list: track_list_new,
        active_track_index: active_track_index_new,
        state_of_play: state_of_play_new,
        last_cursor_time: last_cursor_time_new,
      };
    },
    [ADD_TRACKS_FROM_TRACK_LIST](state, { payload }: ReturnType<typeof addTracksFromTrackList>) {
      const newStateObj = groupBy(state.track_list, (fileAudio) => fileAudio.trackFile.name);
      const filtredAudio = payload.files.filter((fileAudio) => !newStateObj[fileAudio.trackFile.name]);

      const track_list_new = [
        ...state.track_list,
        ...filtredAudio,
      ];

      const track_list_length = track_list_new.length;

      let active_track_index_new = state.active_track_index;
      let last_cursor_time_new = state.last_cursor_time;
      let state_of_play_new = state.state_of_play;

      if (isNullOrUndefined(active_track_index_new) && track_list_length) {
        active_track_index_new = 0;
        last_cursor_time_new = 0;
      }

      if (active_track_index_new >= track_list_length) {
        active_track_index_new = track_list_length - 1;
        last_cursor_time_new = 0;
      }

      if (active_track_index_new < 0) {
        active_track_index_new = null;
        state_of_play_new = PLAYER_STATE.NODATA;
        last_cursor_time_new = 0;
      }

      return {
        ...state,
        track_list: track_list_new,
        active_track_index: active_track_index_new,
        last_cursor_time: last_cursor_time_new,
        state_of_play: state_of_play_new,
      };
    },
    [CHANGE_ACTIVE_TRACK_INDEX](state, { payload }: ReturnType<typeof changeActiveTrackIndex>) {
      return {
        ...state,
        last_cursor_time: 0,
        active_track_index: payload.active_track_index,
      };
    },
    [CHANGE_STATE_OF_PLAY_ON_PLAY_FROM_START](state, { payload }: ReturnType<typeof changeStateOfPlayOnPlayFromStart>) {
      return {
        ...state,
        state_of_play: PLAYER_STATE.PLAY,
        last_cursor_time: 0,
      };
    },
    [CHANGE_LAST_CURSOR_TIME](state, { payload }: ReturnType<typeof changeLastCursorTime>) {
      return {
        ...state,
        last_cursor_time: state.state_of_play !== PLAYER_STATE.NODATA ? payload.last_cursor_time : 0,
      };
    },
    [CHANGE_STATE_OF_LOOP](state, { payload }: ReturnType<typeof changeStateOfLoop>) {
      return {
        ...state,
        state_of_loop: payload.state_of_loop,
      };
    },
    [CHANGE_ALL_BYTES](state, { payload }: ReturnType<typeof changeAllBytes>) {
      return {
        ...state,
        loaded_bytes: payload.loaded_bytes,
        all_bytes: payload.all_bytes,
      };
    },
    [CHANGE_LOADED_BYTES](state, { payload }: ReturnType<typeof changeLoadedBytes>) {
      return {
        ...state,
        loaded_bytes: payload.loaded_bytes,
        all_bytes: payload.all_bytes,
      };
    },
    [CHANGE_STATE_OF_PLAY](state, { payload }: ReturnType<typeof changeStateOfPlay>) {
      return {
        ...state,
        state_of_play: payload.state_of_play,
      };
    },
    [CHANGE_VOLUME](state, { payload }: ReturnType<typeof changeVolume>) {
      return {
        ...state,
        volume: payload.volume,
      };
    },
    [CHANGE_MULTIPLY](state, { payload }: ReturnType<typeof changeMultiply>) {
      return {
        ...state,
        multiply: payload.multiply,
      };
    },
    [CHANGE_UNION_BLOCKS](state, { payload }: ReturnType<typeof changeUnionBlocks>) {
      return {
        ...state,
        unionBlocks: payload.unionBlocks,
      };
    },
    [CHANGE_IS_FADING](state, { payload }: ReturnType<typeof changeIsFading>) {
      return {
        ...state,
        isFading: payload.isFading,
      };
    },
  },
  (state) => {
    console.info('NEW STATE', state);
    localStorage.setItem('userData', JSON.stringify(state));
  },
);
