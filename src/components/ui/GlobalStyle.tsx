import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  html {
    font-family: 'Roboto', sans-serif;
  }

  html, body {
    margin: 0;
    font-size: 1.2rem;
  }
  #container, #modal_container, #image_container, #notification_container {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    pointer-events: none;
  }

  ::selection {
    background-color: #5588ff;
    color: white;
  }
  ::-moz-selection {
    background-color: #5588ff;
    color: white;
  }

  button {
    cursor: pointer;
  }
`;

export default GlobalStyle;
