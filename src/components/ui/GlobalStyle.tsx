import { createGlobalStyle } from 'styled-components';
import color_by_type from 'theme/colors';

const GlobalStyle = createGlobalStyle`
  @import url(https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300ita‌​lic,400italic,500,500italic,700,700italic,900italic,900);
  html {
    font-family: 'Roboto', sans-serif;
  }

  html, body {
    margin: 0;
    font-family:  "Roboto script=all rev=2";
    font-size: 1.2rem;
  }
  #container, #modal_container, #image_container, #notification_container {
    width: 100%;
    position: absolute;
    top: 0;
    pointer-events: none;
  }

  ::selection {
    background: ${color_by_type.main.primaryColorRed}; /* WebKit/Blink Browsers */
    color: white;
  }
  ::-moz-selection {
    background: ${color_by_type.main.primaryColorRed}; /* Gecko Browsers */
    color: white;
  }
`;

export default GlobalStyle;
