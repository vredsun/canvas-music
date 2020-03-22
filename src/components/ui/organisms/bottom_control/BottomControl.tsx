import * as React from 'react';
import InputVolume from 'components/ui/molecules/input_volume/InputVolume';
import Progress from 'components/ui/molecules/progress/Progress';
import InputStateOfLoop from 'components/ui/molecules/input_state_of_loop/InputStateOfLoop';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';

type Props = {};

const BottomControl: React.FC<Props> = React.memo(
  () => {
    return (
      <FlexContainer>
        <Progress />
        <InputVolume />
        <InputStateOfLoop />
      </FlexContainer>
    );
  },
);

export default BottomControl;
