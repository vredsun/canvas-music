import { PlayerContextValueState } from 'components/player_context/PlayerContext';
declare type Selector<V = any> = (store: PlayerContextValueState) => V;
export declare const setOfSelectors: Map<any, {
    selector: Selector<any>;
    currentValue: any;
    setValuesMap: Map<Symbol, (value: any) => any>;
}>;
export declare const compareOldValueWithNew: (state: PlayerContextValueState) => void;
export declare const getSelectorValue: <V extends any>(selector: Selector<V>) => V;
export declare const addSelectorToStack: <V extends any>(key: Symbol, selector: Selector<V>, currentValue: V, setValue: (value: any) => any) => void;
export declare const removeSelectorToStack: <V extends any>(key: Symbol, selector: Selector<V>) => void;
export {};
