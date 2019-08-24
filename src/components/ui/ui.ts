import styled from 'styled-components';
import { UiPlayerContorl } from 'components/ui/player_contorl';

const UiAppContainer = styled.div`
  height: 100%;
  pointer-events: all;

  background: white;
`;

const UI = {
  AppContainer: UiAppContainer,
  PlayerContorl: UiPlayerContorl,
};

export default UI;
