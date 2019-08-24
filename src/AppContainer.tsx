import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';

import UI from 'components/ui/ui';
import NF_Change from 'music/NF_Change.mp3';

import { PlayerContextProvider } from 'components/player_context/PlayerContext';

// tslint:disable-next-line: no-console
console.log(NF_Change);

const AppContainer: React.FC<{}> = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_PATH}>
      <PlayerContextProvider>
        <UI.AppContainer>
          <UI.PlayerContorl />
        </UI.AppContainer>
      </PlayerContextProvider>
    </BrowserRouter>
  );
};

export default hot(AppContainer);
