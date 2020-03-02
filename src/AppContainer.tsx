import * as React from 'react';

import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';

import { PlayerContextProvider } from 'components/player_context/PlayerContext';
import MainContainer from 'components/ui/atoms/main_container/MainContainer';
import CenterBox from 'components/ui/atoms/center_box/CenterBox';
import PlayerControl from 'components/ui/organisms/player_control/PlayerControl';

const App: React.FC<{}> = React.memo(
  () => {
    return (
      <BrowserRouter basename={process.env.PUBLIC_PATH}>
        <PlayerContextProvider>
          <MainContainer>
            <CenterBox>
              <PlayerControl />
            </CenterBox>
          </MainContainer>
        </PlayerContextProvider>
      </BrowserRouter>
    );
  },
);

export default hot(App);
