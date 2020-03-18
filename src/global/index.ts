import { LOOP_STATE, NEXT_LOOP_STATE } from 'constants/play_loop';

let audioCtxTemp: AudioContext;
export const getAudioCtx = () => {
  audioCtxTemp = audioCtxTemp || new window.AudioContext();

  return audioCtxTemp;
};

export const getNextStateOfLoop = (state_of_loop: LOOP_STATE) => {
  return NEXT_LOOP_STATE[state_of_loop];
};
