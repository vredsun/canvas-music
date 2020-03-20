import * as React from 'react';

import ButtonPlay from 'components/ui/molecules/button_play/ButtonPlay';
import FlexContainer from 'components/ui/atoms/flex_container/FlexContainer';

type Props = {};

const PlayerButtons: React.FC<Props> = React.memo(
  () => {
    return (
      <FlexContainer justifyContent="center">
        <ButtonPlay />
      </FlexContainer>
    );
  },
);

export default PlayerButtons;
