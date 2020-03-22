import { getAudioCtx } from 'global';

const loadTrack = async (url: string, handleProgress: (event: ProgressEvent<EventTarget>) => void): Promise<AudioBuffer> => {
  return new Promise<AudioBuffer>(
    (res, rej) => {
      const xhr = new XMLHttpRequest();

      xhr.responseType = 'arraybuffer';
      xhr.open('GET', url, true);

      xhr.onprogress = handleProgress;
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status !== 200) {
          alert(xhr.status + ': ' + xhr.statusText);
        } else {
          const audioCtx = getAudioCtx();
          audioCtx.decodeAudioData(xhr.response, (audioBuffer) => res(audioBuffer));
        }
      };

      xhr.send();
    }
  );
};

export default loadTrack;
