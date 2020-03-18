import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';
import { selectStateOfPlay } from 'store/selectors';
import { PLAYER_STATE } from 'constants/play_state';
import { changeStateOfPlayOnPause, changeStateOfPlayOnPlay } from 'store/actions';

enum KEY_CODE {
  PREV_TRACK = 'KeyK',
  NEXT_TRACK = 'KeyL',
  PLAY_PAUSE = 'Space',
  REMOVE_TRACK_ONE = 'Backspace',
  REMOVE_TRACK_TWO = 'Delete',
}

const useKeyboardEvents = (
  setNextTrackIndex: () => void,
  setPrevTrackIndex: () => void,
  removeActiveTrack: () => void,
) => {
  const current_player_state = useSelector(selectStateOfPlay);
  const dispatch = useDispatch();

  React.useEffect(
    () => {
      const keyboardHandler = (event: KeyboardEvent) => {
        const code = event.code;

        if (code === KEY_CODE.NEXT_TRACK) {
          setNextTrackIndex();
        }

        if (code === KEY_CODE.PREV_TRACK) {
          setPrevTrackIndex();
        }

        if (code === KEY_CODE.PLAY_PAUSE) {
          if (current_player_state === PLAYER_STATE.PAUSE) {
            dispatch(changeStateOfPlayOnPlay());
          }

          if (current_player_state === PLAYER_STATE.PLAY) {
            dispatch(changeStateOfPlayOnPause());
          }
        }

        if (code === KEY_CODE.REMOVE_TRACK_ONE || code === KEY_CODE.REMOVE_TRACK_TWO) {
          removeActiveTrack();
        }

      };
      document.body.addEventListener('keydown', keyboardHandler);

      return () => {
        document.body.removeEventListener('keydown', keyboardHandler);
      };
    },
    [
      setNextTrackIndex,
      setPrevTrackIndex,
      current_player_state,
      removeActiveTrack,
    ],
  );
};

export default useKeyboardEvents;
