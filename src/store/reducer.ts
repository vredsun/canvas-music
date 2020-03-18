import { createReducer } from 'vs-react-store';
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
  CHANGE_START_TIME,
  changeStartTime,
  CHANGE_LAST_CURSOR_TIME,
  changeLastCursorTime,
} from 'store/actions';
import { PLAYER_STATE } from 'constants/play_state';
import { LOOP_STATE } from 'constants/play_loop';

export type VsStoreContextValueState = {
  start_time: number;
  last_cursor_time: number;
  state_of_loop: LOOP_STATE;
  state_of_play: PLAYER_STATE;
  volume: number;
  multiply: number;
  unionBlocks: number;

  loaded_bytes: number;
  all_bytes: number;
  isFading: boolean;
};

const default_value: VsStoreContextValueState = {
  start_time: 0,
  last_cursor_time: 0,
  state_of_loop: LOOP_STATE.ALL_LOOP,
  state_of_play: PLAYER_STATE.NODATA,
  volume: 0.5,
  multiply: 2,
  unionBlocks: 1,
  loaded_bytes: 0,
  all_bytes: 0,
  isFading: false,
};

const initStore = (): VsStoreContextValueState => {
  const userData: Partial<VsStoreContextValueState> = JSON.parse(localStorage.getItem('userData'));

  return {
    start_time: default_value.start_time,
    last_cursor_time: default_value.last_cursor_time,
    state_of_play: default_value.state_of_play,
    loaded_bytes: default_value.loaded_bytes,
    all_bytes: default_value.all_bytes,

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
    [CHANGE_LAST_CURSOR_TIME](state, { payload }: ReturnType<typeof changeLastCursorTime>) {
      return {
        ...state,
        last_cursor_time: payload.last_cursor_time,
      };
    },
    [CHANGE_START_TIME](state, { payload }: ReturnType<typeof changeStartTime>) {
      return {
        ...state,
        start_time: payload.start_time,
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
