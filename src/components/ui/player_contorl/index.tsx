import * as React from 'react';
import { usePlayerStateOfPlay, usePlayerVolume } from 'components/player_context/hooks/state_hooks';
import { PLAYER_STATE__STOP, PLAYER_STATE__PAUSE, PLAYER_STATE__PLAY } from 'constants/play_state';
import { usePlayMusic, usePauseMusic, useChangeVolume } from 'components/player_context/hooks/actions_hook';

import NF_Change from 'music/NF_Change.mp3';
import { secondsInMMSS } from 'utils/time';
import UI from 'components/ui/ui';
import { NEED_UPDATE } from 'constants/need_update';

const cache: Record<string, AudioBuffer> = {};

// tslint:disable-next-line: no-console

let audioCtxTemp: AudioContext;
const getAudioCtx = () => {
  audioCtxTemp = audioCtxTemp || new window.AudioContext();

  return audioCtxTemp;
};

export const UiPlayerContorl: React.FC<{}> = () => {
  const [monoData, setMonoData] = React.useState((new Array(2048)).fill(0));
  const [state, setState] = React.useState({
    audioprocessCallback: null,
    sp: null,
    gainNode: null,
    source: null,
    audioBuffer: null,
    timeOffset: null,
    startTime: null,
    intervalId: null,
    lastTimeUpdate: null,
  });

  const current_player_state = usePlayerStateOfPlay();
  const volume = usePlayerVolume();

  const handlePlayMusic = usePlayMusic();
  const handlePauseMusic = usePauseMusic();
  const handleChangeVolume = useChangeVolume();

  const audioprocessCallback = React.useCallback(
    (ape: AudioProcessingEvent) => {
      const inputBuffer = ape.inputBuffer;
      const outputBuffer = ape.outputBuffer;

      const channelsLen = outputBuffer.numberOfChannels;
      const sampleLen = inputBuffer.length;

      // для визулизации создаем монобуфер
      const mono = (new Array(sampleLen)).fill(0);

      for (let channel = 0; channel < channelsLen; channel++ ) {
        const inputData = inputBuffer.getChannelData(channel);
        const outputData = outputBuffer.getChannelData(channel);
        // устанавливаем выходные данные = входным
        // здесь можно изменить в них что-то или наложить эффект
        outputData.set(inputData);

        // микшируем в монобуфер все каналы
        for (let sample = 0; sample < sampleLen; sample++ ) {
          mono[sample] = (mono[sample] + inputData[sample]) / 2;
        }
      }

      setMonoData(mono);
    },
    [],
  );

  const callBackPlay = React.useCallback(
    async () => {
      handlePlayMusic();
      const audioCtx = getAudioCtx();

      // load
      let audioBuffer = cache[NF_Change];
      if (!audioBuffer) {
        audioBuffer = cache[NF_Change] = await fetch(NF_Change)
          .then((response) => response.arrayBuffer())
          .then((arrayBuffer) => audioCtx.decodeAudioData(arrayBuffer));
      }

      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      const sp = audioCtx.createScriptProcessor(monoData.length, 2, 2);

      sp.addEventListener('audioprocess', audioprocessCallback);

      const gainNode = audioCtx.createGain();

      source.connect(gainNode);
      gainNode.connect(sp);
      sp.connect(audioCtx.destination);

      gainNode.gain.value = volume;

      setState(
        (oldState) => {
          const startTime = audioCtx.currentTime;
          const timeOffset = oldState.timeOffset || 0;
          source.start(0, timeOffset);

          const intervalId = setInterval(
            () => {
              setState(
                (oldStateInterval) => {
                  const lastTimeUpdate = audioCtx.currentTime;
                  const timeOffsetInterval = oldStateInterval.timeOffset + (lastTimeUpdate - oldStateInterval.lastTimeUpdate);
                  return {
                    ...oldStateInterval,
                    timeOffset: timeOffsetInterval,
                    lastTimeUpdate,
                  };
                },
              );
            },
            4000,
          );

          return {
            sp,
            audioprocessCallback,
            gainNode,
            audioBuffer,
            source,
            timeOffset,
            startTime,
            lastTimeUpdate: startTime,
            intervalId,
          };
        },
      );
    },
    [handlePlayMusic, volume, audioprocessCallback],
  );

  const callBackPause = React.useCallback(
    () => {
      handlePauseMusic();
      setState(
        (oldState) => {
          const audioCtx = getAudioCtx();

          oldState.source.stop();
          clearInterval(oldState.intervalId);
          oldState.sp.removeEventListener('audioprocess', oldState.audioprocessCallback);
          const timeOffset = oldState.timeOffset + (audioCtx.currentTime - oldState.lastTimeUpdate);

          return {
            ...oldState,
            timeOffset,
            lastTimeUpdate: audioCtx.currentTime,
            intervalId: null,
          };
        },
      );
    },
    [handlePlayMusic],
  );

  React.useEffect(
    () => {
      if (state.gainNode) {
        state.gainNode.gain.value = volume;
      }
    },
    [state.gainNode, volume],
  );

  return React.useMemo(
    () => (
      <div>
        <div>
          {
            Boolean(current_player_state === PLAYER_STATE__STOP || current_player_state === PLAYER_STATE__PAUSE) && (
              <button onClick={callBackPlay} disabled={Boolean(state.intervalId)}>Play</button>
            )
          }
          {
            Boolean(current_player_state === PLAYER_STATE__PLAY) && (
              <button onClick={callBackPause} disabled={NEED_UPDATE || Boolean(!state.intervalId)}>Pause</button>
            )
          }
        </div>
        <div>
          <label>
            <input type="range" min="0" max="1" step="0.01" onChange={handleChangeVolume} value={volume} />
          </label>
        </div>
        <div>
          {secondsInMMSS(state.timeOffset || 0)}
          <progress value={state.timeOffset || 0} max={state.audioBuffer && state.audioBuffer.duration} />
          {secondsInMMSS(state.audioBuffer && state.audioBuffer.duration)}
        </div>
        <UI.CanvasVisualizer monoData={monoData} />
      </div>
    ),
    [
      current_player_state,
      callBackPlay,
      callBackPause,
      volume,
      handleChangeVolume,
    ],
  );
};
