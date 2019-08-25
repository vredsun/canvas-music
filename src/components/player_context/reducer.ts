import { PlayerContextValueState } from 'components/player_context/PlayerContext';
import { CHANGE_STATE_OF_PLAY, CHANGE_VOLUME } from 'components/player_context/actions';

export const reducer: React.Reducer<PlayerContextValueState, any> = (state, action) => {
  let newState = state;
  switch (action.type) {
    case CHANGE_STATE_OF_PLAY: {
      newState = {
        ...state,
        state_of_play: action.payload.state_of_play,
      };
      break;
    }
    case CHANGE_VOLUME: {
      newState = {
        ...state,
        volume: action.payload.volume,
      };
      break;
    }
    default:
      throw new Error();
  }

  localStorage.setItem('userData', JSON.stringify(newState));
  return newState;
};
