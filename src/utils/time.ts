export const secondsInMMSS = (seconds: number) => {
  return `${Math.floor(seconds / 60)}:${Math.round(seconds % 60).toString().padStart(2, '0')}`;
};
