import { PlayerContextValueState } from 'components/player_context/PlayerContext';
import { CHANGE_STATE_OF_PLAY } from 'components/player_context/actions';

export const reducer: React.Reducer<PlayerContextValueState, any> = (state, action) => {
  switch (action.type) {
    case CHANGE_STATE_OF_PLAY: {
      return {
        ...state,
        state_of_play: action.payload.state_of_play,
      };
    }
    default:
      throw new Error();
  }
};
