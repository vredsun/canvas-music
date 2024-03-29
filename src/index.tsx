import * as React from 'react';
import * as ReactDom from 'react-dom';

window.AudioContext = window.AudioContext || window.webkitAudioContext;

import AppContainer from './AppContainer';
import GlobalStyle from 'components/ui/GlobalStyle';

ReactDom.render(
  <React.Fragment>
    <AppContainer />
    <GlobalStyle />
  </React.Fragment>,
  document.getElementById('container'),
);
