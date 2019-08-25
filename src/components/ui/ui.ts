import styled from 'styled-components';
import { UiPlayerContorl } from 'components/ui/player_contorl';
import { UiCenterBox } from 'components/ui/center_box';
import { UiCanvasVisualizer } from 'components/ui/canvas_visualizer';

const UiAppContainer = styled.div`
  height: 100%;
  pointer-events: all;

  background: white;
`;

const UI = {
  AppContainer: UiAppContainer,
  PlayerContorl: UiPlayerContorl,
  CenterBox: UiCenterBox,
  CanvasVisualizer: UiCanvasVisualizer,
};

export default UI;
