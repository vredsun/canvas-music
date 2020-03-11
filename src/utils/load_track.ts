import { getAudioCtx } from 'global';

const loadTrack = async (url: string, handleProgress: (event: ProgressEvent<EventTarget>) => void) => {
  return new Promise<AudioBuffer>(
    (res, rej) => {
      const xhr = new XMLHttpRequest();

      xhr.responseType = 'arraybuffer';
      xhr.open('GET', url, true);

      xhr.onprogress = handleProgress;
      xhr.onreadystatechange = async () => {
        if (xhr.readyState !== 4) {
          return;
        }

        if (xhr.status !== 200) {
          alert(xhr.status + ': ' + xhr.statusText);
        } else {
          const audioCtx = getAudioCtx();

          const audioBuffer = await audioCtx.decodeAudioData(xhr.response);
          res(audioBuffer);
        }
      };

      xhr.send();
    }
  );
};

export default loadTrack;
