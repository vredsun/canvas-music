import * as React from 'react';
import { PLAYER_STATE__PLAY, PLAYER_STATE__STOP, PLAYER_STATE__PAUSE } from 'constants/play_state';
export declare type PlayerContextValueState = {
    state_of_play: typeof PLAYER_STATE__PLAY | typeof PLAYER_STATE__PAUSE | typeof PLAYER_STATE__STOP;
    volume: number;
    multiply: number;
    unionBlocks: number;
};
export declare type PlayerContextValue = [PlayerContextValueState, React.Dispatch<any>];
export declare const PlayerContext: React.Context<PlayerContextValue>;
export declare let _store: PlayerContextValueState;
export declare let _dispatch: React.Dispatch<any>;
export declare const PlayerContextProvider: React.FC<{}>;
