import * as React from 'react';

import { PLAYER_STATE__PLAY, PLAYER_STATE__STOP, PLAYER_STATE__PAUSE } from 'constants/play_state';
import { reducer } from 'components/player_context/reducer';

export type PlayerContextValueState = {
  state_of_play: typeof PLAYER_STATE__PLAY | typeof PLAYER_STATE__PAUSE | typeof PLAYER_STATE__STOP;
};

export type PlayerContextValue = [
  PlayerContextValueState,
  React.Dispatch<any>
];

const default_value: PlayerContextValueState = {
  state_of_play: PLAYER_STATE__STOP,
};

export const PlayerContext = React.createContext<PlayerContextValue>(
  [
    default_value,
    () => {/* */},
  ],
);

export const PlayerContextProvider: React.FC<{}> = React.memo(
  (props) => {
    const reducerData = React.useReducer(reducer, default_value);

    return (
      <PlayerContext.Provider value={reducerData}>
        {props.children}
      </PlayerContext.Provider>
    );
  },
);
