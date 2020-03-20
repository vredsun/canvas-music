import { ONE_MINUTE_IN_SECONDS } from 'constants/time';
import { TWO } from 'constants/count';

const getMinutesInSeconds = (seconds: number) => {
  return Math.floor(seconds / ONE_MINUTE_IN_SECONDS);
};

const getPartSeconds = (seconds: number) => {
  return Math.floor(seconds % ONE_MINUTE_IN_SECONDS);
};

const setTimeZeroBeforeValue = (value: number) => {
  return value.toString().padStart(TWO, '0');
};

export const secondsInMMSS = (seconds: number) => {
  const minutes = setTimeZeroBeforeValue(
    getMinutesInSeconds(seconds),
  );
  const part_seconds = setTimeZeroBeforeValue(
    getPartSeconds(seconds),
  );

  return `${minutes}:${part_seconds}`;
};
