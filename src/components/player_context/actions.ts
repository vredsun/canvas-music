import { PlayerContextValueState } from 'components/player_context/PlayerContext';

export const CHANGE_STATE_OF_PLAY = 'CHANGE_STATE_OF_PLAY' as const;
export const CHANGE_VOLUME = 'CHANGE_VOLUME' as const;

export const changeStateOfPlay = (state_of_play: PlayerContextValueState['state_of_play']) => ({
  type: CHANGE_STATE_OF_PLAY,
  payload: {
    state_of_play,
  },
});

export const changeVolume = (volume: PlayerContextValueState['volume']) => ({
  type: CHANGE_VOLUME,
  payload: {
    volume,
  },
});
