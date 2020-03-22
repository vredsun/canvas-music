import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { selectStateOfPlay, selectActiveTrackIndex } from 'store/selectors';
import { PLAYER_STATE } from 'constants/play_state';
import {
  changeStateOfPlayOnPlay,
  changeStateOfPlay,
  changeActiveTrackIndexToPrevTrack,
  changeActiveTrackIndexToNextTrack,
  removeTrackFromTrackList,
} from 'store/actions';

enum KEY_CODE {
  PREV_TRACK = 'KeyK',
  NEXT_TRACK = 'KeyL',
  PLAY_PAUSE = 'Space',
  REMOVE_TRACK_ONE = 'Backspace',
  REMOVE_TRACK_TWO = 'Delete',
}

const useKeyboardEvents = () => {
  const active_track_index = useSelector(selectActiveTrackIndex);
  const current_player_state = useSelector(selectStateOfPlay);
  const dispatch = useDispatch();

  React.useEffect(
    () => {
      const keyboardHandler = (event: KeyboardEvent) => {
        const code = event.code;

        if (code === KEY_CODE.NEXT_TRACK) {
          dispatch(
            changeActiveTrackIndexToNextTrack()
          );
        }

        if (code === KEY_CODE.PREV_TRACK) {
          dispatch(
            changeActiveTrackIndexToPrevTrack()
          );
        }

        if (code === KEY_CODE.PLAY_PAUSE) {
          if (current_player_state === PLAYER_STATE.PAUSE) {
            dispatch(changeStateOfPlayOnPlay());
          }

          if (current_player_state === PLAYER_STATE.PLAY) {
            dispatch(changeStateOfPlay(PLAYER_STATE.PAUSE));
          }
        }

        if (code === KEY_CODE.REMOVE_TRACK_ONE || code === KEY_CODE.REMOVE_TRACK_TWO) {
          dispatch(
            removeTrackFromTrackList(active_track_index),
          );
        }

      };
      document.body.addEventListener('keydown', keyboardHandler);

      return () => {
        document.body.removeEventListener('keydown', keyboardHandler);
      };
    },
    [
      active_track_index,
      current_player_state,
    ],
  );
};

export default useKeyboardEvents;
