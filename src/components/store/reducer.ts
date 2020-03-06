import { createReducer } from 'vs-react-store';
import { CHANGE_VOLUME, changeVolume, CHANGE_MULTIPLY, changeMultiply, CHANGE_UNION_BLOCKS, changeUnionBlocks, CHANGE_STATE_OF_PLAY, changeStateOfPlay } from 'components/store/actions';
import { PLAYER_STATE__PLAY, PLAYER_STATE__PAUSE, PLAYER_STATE__STOP } from 'constants/play_state';

export type VsStoreContextValueState = {
  state_of_play: typeof PLAYER_STATE__PLAY | typeof PLAYER_STATE__PAUSE | typeof PLAYER_STATE__STOP;
  volume: number;
  multiply: number;
  unionBlocks: number;
};

export const default_value: VsStoreContextValueState = {
  state_of_play: PLAYER_STATE__STOP,
  volume: 0.5,
  multiply: 2,
  unionBlocks: 1,
};

export const initStore = (): VsStoreContextValueState => {
  const userData: Partial<VsStoreContextValueState> = JSON.parse(localStorage.getItem('userData')) || {};

  return {
    state_of_play: default_value.state_of_play,

    volume: userData.volume ?? default_value.volume,
    multiply: userData.multiply ?? default_value.multiply,
    unionBlocks: userData.unionBlocks ?? default_value.unionBlocks,
  };
};

export const reducer = createReducer<VsStoreContextValueState>(
  {
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
  },
  (state) => {
    console.info('NEW STATE', state);
    localStorage.setItem('userData', JSON.stringify(state));
  },
);
