declare module '*.mp3' {
  const content: string;
  export default content;
}

interface Window {
  AudioContext: typeof AudioContext;
  webkitAudioContext: typeof AudioContext;
}
