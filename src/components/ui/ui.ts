import styled from 'styled-components';
import { UiPlayerContorl } from 'components/ui/player_contorl';
import { UiCenterBox } from 'components/ui/center_box';

const UiAppContainer = styled.div`
  height: 100%;
  pointer-events: all;

  background: white;
`;

const UI = {
  AppContainer: UiAppContainer,
  PlayerContorl: UiPlayerContorl,
  CenterBox: UiCenterBox,
};

export default UI;
