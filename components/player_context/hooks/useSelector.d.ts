import { PlayerContextValueState } from 'components/player_context/PlayerContext';
declare const useSelector: <V extends any>(selector: (state: PlayerContextValueState) => V) => V;
export default useSelector;
