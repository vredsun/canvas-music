import { _store, PlayerContextValueState } from 'components/player_context/PlayerContext';

type Selector<V = any> = (store: PlayerContextValueState) => V;

export const setOfSelectors = new Map<any, {
  selector: Selector;
  currentValue: any;
  setValuesMap: Map<
    Symbol,
    (value: ReturnType<Selector>) => any
  >;
}>();

export const compareOldValueWithNew = (state: PlayerContextValueState) => {
  setOfSelectors.forEach((selectorState) => {
    const newValue = selectorState.selector(state);

    if (newValue !== selectorState.currentValue) {
      selectorState.currentValue = newValue;
      selectorState.setValuesMap.forEach((setValue) => {
        setValue(newValue);
      });
    }
  });
};

export const getSelectorValue = <V extends any>(selector: Selector<V>) => {
  return selector(_store);
};

export const addSelectorToStack = <V extends any>(key: Symbol, selector: Selector<V>, currentValue: V, setValue: (value: ReturnType<Selector>) => any) => {
  if (!setOfSelectors.has(selector)) {
    const setValuesMap = new Map();
    setValuesMap.set(key, setValue);

    setOfSelectors.set(selector, {
      selector,
      currentValue,
      setValuesMap,
    });
  } else {
    setOfSelectors.get(selector).setValuesMap.set(key, setValue);
  }
};

export const removeSelectorToStack = <V extends any>(key: Symbol, selector: Selector<V>) => {
  if (setOfSelectors.has(selector)) {
    setOfSelectors.get(selector).setValuesMap.delete(key);
    if (!setOfSelectors.get(selector).setValuesMap.size) {
      setOfSelectors.delete(selector);
    }
  }
};
