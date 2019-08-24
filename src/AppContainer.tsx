import * as React from 'react';
import { hot } from 'react-hot-loader/root';
import { BrowserRouter } from 'react-router-dom';

import UI from 'components/ui/ui';
import NF_Change from 'music/NF_Change.mp3';

// tslint:disable-next-line: no-console
console.log(NF_Change);

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
