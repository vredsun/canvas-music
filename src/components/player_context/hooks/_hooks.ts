import * as React from 'react';
import { PlayerContext } from 'components/player_context/PlayerContext';

export const usePlayerDispatch = () => {
  const dispatch = React.useContext(PlayerContext)[1];

  return React.useMemo(
    () => dispatch,
    [dispatch],
  );
};
