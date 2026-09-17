/**
 * Lexi phoneme playback service.
 *
 * Clean human-recorded MP3 clips in /public/audio/phonemes are preferred.
 * Until a clip is present, Lexi uses a per-sound browser-speech fallback
 * rather than sending a letter sequence to speechSynthesis.
 *
 * Recording note: stop consonants should be recorded without an added schwa:
 * /p/, not "puh"; /t/, not "tuh"; /k/, not "kuh".
 */

const PHONEME_FILES: Record<string, string> = {
  b: 'b.mp3',
  ch: 'ch.mp3',
  l: 'l.mp3',
  m: 'm.mp3',
  p: 'p.mp3',
  r: 'r.mp3',
  s: 's.mp3',
  sh: 'sh.mp3',
  short_a: 'short-a.mp3',
  short_i: 'short-i.mp3',
  short_o: 'short-o.mp3',
};

const FALLBACK_CUES: Record<string, string> = {
  b: 'b',
  ch: 'ch',
  l: 'lll',
  m: 'mmm',
  p: 'p',
  r: 'rrr',
  s: 'sss',
  sh: 'shhh',
  short_a: 'ah',
  short_i: 'ih',
  short_o: 'ah',
};

let currentAudio: HTMLAudioElement | null = null;
let generation = 0;

const wait = (ms: number) =>
  new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/**
 * Resolve public assets relative to the deployed page.
 * This works locally and when Lexi is hosted beneath the repository path
 * on GitHub Pages, without requiring additional Vite environment typings.
 */
function urlFor(key: string): string | null {
  const filename = PHONEME_FILES[key];
  if (!filename) return null;

  return new URL(`audio/phonemes/${filename}`, document.baseURI).toString();
}

async function recordedClipExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, {
      method: 'HEAD',
      cache: 'force-cache',
    });
    return response.ok;
  } catch {
    return false;
  }
}

function speakCue(text: string, token: number): Promise<void> {
  return new Promise<void>((resolve) => {
    if (token !== generation || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.62;
    utterance.pitch = 1;
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    speechSynthesis.speak(utterance);
  });
}

async function playOne(key: string, token: number): Promise<void> {
  if (token !== generation) return;

  const url = urlFor(key);

  if (url && (await recordedClipExists(url))) {
    await new Promise<void>((resolve) => {
      if (token !== generation) {
        resolve();
        return;
      }

      const audio = new Audio(url);
      currentAudio = audio;
      audio.preload = 'auto';

      audio.onended = () => {
        if (currentAudio === audio) currentAudio = null;
        resolve();
      };

      audio.onerror = () => {
        if (currentAudio === audio) currentAudio = null;
        resolve();
      };

      void audio.play().catch(() => {
        if (currentAudio === audio) currentAudio = null;
        resolve();
      });
    });
    return;
  }

  await speakCue(FALLBACK_CUES[key] || key, token);
}

export function stopPhonemeAudio(): void {
  generation += 1;

  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }

  if ('speechSynthesis' in window) {
    speechSynthesis.cancel();
  }
}

export async function playPhonemeSequence(
  keys: string[],
  gapMs = 400,
): Promise<void> {
  stopPhonemeAudio();
  const token = generation;

  for (let i = 0; i < keys.length; i += 1) {
    if (token !== generation) return;

    await playOne(keys[i], token);

    if (i < keys.length - 1) {
      await wait(gapMs);
    }
  }
}
