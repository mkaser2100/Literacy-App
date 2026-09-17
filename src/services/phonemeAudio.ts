/**
 * Plays Mystery Word phonemes one at a time.
 * Clean human-recorded MP3s in /public/audio/phonemes are preferred.
 * Until a clip is present, Lexi uses a per-sound browser-speech fallback
 * rather than sending a letter sequence to speechSynthesis.
 */
const PHONEME_FILES: Record<string,string> = {
  b:'b.mp3', ch:'ch.mp3', l:'l.mp3', m:'m.mp3', p:'p.mp3', r:'r.mp3',
  s:'s.mp3', sh:'sh.mp3', short_a:'short-a.mp3', short_i:'short-i.mp3', short_o:'short-o.mp3',
};
const FALLBACK_CUES: Record<string,string> = {
  b:'b', ch:'ch', l:'lll', m:'mmm', p:'p', r:'rrr', s:'sss', sh:'shhh',
  short_a:'ah', short_i:'ih', short_o:'ah',
};
let currentAudio:HTMLAudioElement|null=null;
let generation=0;
const wait=(ms:number)=>new Promise<void>(r=>window.setTimeout(r,ms));
const urlFor=(key:string)=>`${import.meta.env.BASE_URL || '/'}audio/phonemes/${PHONEME_FILES[key]||''}`;

async function recordedClipExists(url:string){
  if(!url || url.endsWith('/'))return false;
  try{return (await fetch(url,{method:'HEAD',cache:'force-cache'})).ok;}catch{return false;}
}
function speakCue(text:string,token:number){
  return new Promise<void>(resolve=>{
    if(token!==generation || !('speechSynthesis' in window)){resolve();return;}
    const u=new SpeechSynthesisUtterance(text); u.rate=.62; u.pitch=1;
    u.onend=()=>resolve(); u.onerror=()=>resolve(); speechSynthesis.speak(u);
  });
}
async function playOne(key:string,token:number){
  if(token!==generation)return;
  const url=urlFor(key);
  if(PHONEME_FILES[key] && await recordedClipExists(url)){
    await new Promise<void>(resolve=>{
      if(token!==generation){resolve();return;}
      const audio=new Audio(url); currentAudio=audio; audio.preload='auto';
      audio.onended=()=>resolve(); audio.onerror=()=>resolve();
      void audio.play().catch(()=>resolve());
    });
  }else{
    await speakCue(FALLBACK_CUES[key]||key,token);
  }
}
export function stopPhonemeAudio(){
  generation++;
  if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;currentAudio=null;}
  if('speechSynthesis' in window)speechSynthesis.cancel();
}
export async function playPhonemeSequence(keys:string[],gapMs=400){
  stopPhonemeAudio(); const token=generation;
  for(let i=0;i<keys.length;i++){
    if(token!==generation)return;
    await playOne(keys[i],token);
    if(i<keys.length-1)await wait(gapMs);
  }
}
