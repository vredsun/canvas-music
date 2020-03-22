import * as React from 'react';

import { hot } from 'react-hot-loader/root';
import { BrowserRouter, Route } from 'react-router-dom';
import { createVsProvider } from 'vs-react-store';

import { reducer } from 'store/reducer';
import MainContainer from 'components/ui/atoms/main_container/MainContainer';
import LoadingByPrepare from 'components/ui/molecules/loading_by_prepare';
import MainPage from 'components/ui/pages/main_page/MainPage';

const VsStoreProvider = createVsProvider(reducer);

const App: React.FC<{}> = React.memo(
  () => {
    return (
      <BrowserRouter basename={process.env.PUBLIC_PATH}>
        <VsStoreProvider>
          <MainContainer>
            <Route path="*" component={MainPage} />
          </MainContainer>
          <LoadingByPrepare />
        </VsStoreProvider>
      </BrowserRouter>
    );
  },
);

export default hot(App);
