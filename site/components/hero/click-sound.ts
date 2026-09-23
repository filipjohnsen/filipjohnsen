let audio: AudioContext | null = null;

/** A short synthesized "click". Only called when the visitor turns sound on. */
export function playClick() {
  audio ??= new AudioContext();
  if (audio.state === "suspended") void audio.resume();
  const t = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = "square";
  osc.frequency.setValueAtTime(1600 + Math.random() * 300, t);
  osc.frequency.exponentialRampToValueAtTime(380, t + 0.035);
  gain.gain.setValueAtTime(0.06, t);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.05);
  osc.connect(gain).connect(audio.destination);
  osc.start(t);
  osc.stop(t + 0.06);
}
