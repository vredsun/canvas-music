import * as React from 'react';

import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';

import UI from 'components/ui/ui';

import { PlayerContextProvider } from 'components/player_context/PlayerContext';

const App: React.FC<{}> = React.memo(
  () => {
    return (
      <BrowserRouter basename={process.env.PUBLIC_PATH}>
        <PlayerContextProvider>
          <UI.AppContainer>
            <UI.CenterBox>
              <UI.PlayerContorl />
            </UI.CenterBox>
          </UI.AppContainer>
        </PlayerContextProvider>
      </BrowserRouter>
    );
  },
);

export default hot(App);
