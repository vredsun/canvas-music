import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import UI from 'components/ui/ui';
// import TestGetLink from 'components/pages/get_link/TestGetLink';
import { BrowserRouter } from 'react-router-dom';

const AppContainer: React.FC<{}> = hot(() => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_PATH}>
      <UI.AppContainer>
        <canvas />
        <div>canvas</div>
      </UI.AppContainer>
    </BrowserRouter>
  );
});

export default AppContainer;
