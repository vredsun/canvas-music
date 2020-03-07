import * as React from 'react';

import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';
import { createVsProvider } from 'vs-react-store';

import MainContainer from 'components/ui/atoms/main_container/MainContainer';
import CenterBox from 'components/ui/atoms/center_box/CenterBox';
import PlayerControl from 'components/ui/organisms/player_control/PlayerControl';
import { reducer } from 'components/store/reducer';

const VsStoreProvider = createVsProvider(reducer);

const App: React.FC<{}> = React.memo(
  () => {
    return (
      <BrowserRouter basename={process.env.PUBLIC_PATH}>
        <VsStoreProvider>
          <MainContainer>
            <CenterBox>
              <PlayerControl />
            </CenterBox>
          </MainContainer>
        </VsStoreProvider>
      </BrowserRouter>
    );
  },
);

export default hot(App);
