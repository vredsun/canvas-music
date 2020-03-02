import * as React from 'react';

import { PLAYER_STATE__PLAY, PLAYER_STATE__STOP, PLAYER_STATE__PAUSE } from 'constants/play_state';
import { reducer } from 'components/player_context/reducer';
import { compareOldValueWithNew } from 'components/player_context/hooks/_state_contorol';

export type PlayerContextValueState = {
  state_of_play: typeof PLAYER_STATE__PLAY | typeof PLAYER_STATE__PAUSE | typeof PLAYER_STATE__STOP;
  volume: number;
  multiply: number;
  unionBlocks: number;
};

export type PlayerContextValue = [
  PlayerContextValueState,
  React.Dispatch<any>
];

const default_value: PlayerContextValueState = {
  state_of_play: PLAYER_STATE__STOP,
  volume: 0.5,
  multiply: 2,
  unionBlocks: 1,
};

export const PlayerContext = React.createContext<PlayerContextValue>(
  [
    default_value,
    () => {/* */},
  ],
);

const initStore = (): PlayerContextValueState => {
  const userData: Partial<PlayerContextValueState> = JSON.parse(localStorage.getItem('userData')) || {};

  return {
    state_of_play: default_value.state_of_play,

    volume: userData.volume ?? default_value.volume,
    multiply: userData.multiply ?? default_value.multiply,
    unionBlocks: userData.unionBlocks ?? default_value.unionBlocks,
  };
};

export let _store: PlayerContextValueState = {
  ...default_value,
};

export let _dispatch: React.Dispatch<any> = () => {
  //
};

export const PlayerContextProvider: React.FC<{}> = React.memo(
  (props) => {
    const reducerData = React.useReducer(reducer, default_value, initStore);
    _store = reducerData[0];
    _dispatch = reducerData[1];
    compareOldValueWithNew(_store);

    return (
      <PlayerContext.Provider value={reducerData}>
        {props.children}
      </PlayerContext.Provider>
    );
  },
);
