import * as React from 'react';
import useKeyboardEvents from 'components/ui/molecules/trigger_on_keyboard/useKeyboardEvents';

type Props = {};

const TriggerOnKeyboard: React.FC<Props> = React.memo(
  () => {
    useKeyboardEvents();

    return null;
  },
);

export default TriggerOnKeyboard;
