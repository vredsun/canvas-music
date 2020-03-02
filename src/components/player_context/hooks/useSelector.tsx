import * as React from 'react';
import { getSelectorValue, addSelectorToStack, removeSelectorToStack } from 'components/player_context/hooks/_state_contorol';
import { PlayerContextValueState } from 'components/player_context/PlayerContext';

const useSelector = <V extends any>(selector: (state: PlayerContextValueState) => V) => {
  const [value, setValue] = React.useState<V>(() => getSelectorValue(selector));

  React.useEffect(
    () => {
      const key = Symbol(selector.name);
      addSelectorToStack(key, selector, value, setValue);

      return () => {
        removeSelectorToStack(key, selector);
      };
    },
    [selector],
  );
  return value;
};

export default useSelector;
