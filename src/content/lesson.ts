import { wordBank } from './words';

export type ActivityType =
  | 'sound_detective' | 'sound_builder' | 'sound_switch'
  | 'word_builder' | 'mystery_words' | 'reading_mission';

export type Activity = {
  id: string; type: ActivityType; skillId: string; title: string;
  instruction: string; prompt: string; audioText?: string; phonemes?: string[];
  choices?: string[]; tokens?: string[]; distractorTokens?: string[]; answer: string;
  manipulation?: 'substitute' | 'delete';
  hint: string; difficulty: number;
  pattern?: string; level?: string; wordId?: string;
};

const w=(word:string)=>wordBank.find(x=>x.word===word)!;
const meta=(word:string)=>({wordId:w(word).id,pattern:w(word).pattern,level:w(word).level});

export const activityBank: Activity[] = [
  {id:'sd1',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen first. Find the word that starts with the sound.',prompt:'Which word starts with /sh/?',audioText:'Listen for the sh sound. Shhh.',choices:['ship','chip','sip'],answer:'ship',hint:'Stretch the beginning: shhh-ip.',difficulty:1,...meta('ship')},
  {id:'sd2',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen first. Find the word that starts with the sound.',prompt:'Which word starts with /ch/?',audioText:'Listen for the ch sound. Ch.',choices:['share','chair','stair'],answer:'chair',hint:'Listen for the quick /ch/ sound at the start.',difficulty:1,pattern:'DIGRAPH',level:'digraph'},
  {id:'sd3',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen for the middle sound.',prompt:'Which word has /ă/ in the middle?',audioText:'Listen for the short a sound, like the middle sound in apple.',choices:['map','mop','meep'],answer:'map',hint:'Stretch each word and listen only to the middle.',difficulty:2,...meta('map')},
  {id:'sd4',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen for the middle sound.',prompt:'Which word has /ĭ/ in the middle?',audioText:'Listen for the short i sound, like the middle sound in sit.',choices:['fish','fash','foosh'],answer:'fish',hint:'Say each slowly. Which middle sound is /ĭ/?',difficulty:2,...meta('fish')},
  {id:'sd5',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen for the middle sound.',prompt:'Which word has /ŏ/ in the middle?',audioText:'Listen for the short o sound, like the middle sound in hot.',choices:['hot','hit','hat'],answer:'hot',hint:'Stretch each word and listen to the vowel.',difficulty:2,...meta('hot')},
  {id:'sd6',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen to the beginning blend.',prompt:'Which word starts with /sl/?',audioText:'Listen for sss-lll at the beginning.',choices:['slip','ship','sip'],answer:'slip',hint:'Listen for two separate beginning sounds: /s/ then /l/.',difficulty:3,...meta('slip')},

  {id:'sb1',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Tap one box for every sound you hear.',prompt:'How many sounds are in “ship”?',audioText:'ship',answer:'3 sounds',hint:'/sh/ is one sound. Try /sh/ /ĭ/ /p/.',difficulty:2,...meta('ship')},
  {id:'sb2',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Tap one box for every sound you hear.',prompt:'How many sounds are in “chat”?',audioText:'chat',answer:'3 sounds',hint:'/ch/ /ă/ /t/ — three sounds.',difficulty:2,...meta('chat')},
  {id:'sb3',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Tap one box for every sound you hear.',prompt:'How many sounds are in “stop”?',audioText:'stop',answer:'4 sounds',hint:'Stretch it: /s/ /t/ /ŏ/ /p/.',difficulty:3,...meta('stop')},
  {id:'sb4',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Tap one box for every sound you hear.',prompt:'How many sounds are in “snap”?',audioText:'snap',answer:'4 sounds',hint:'Stretch it: /s/ /n/ /ă/ /p/.',difficulty:3,...meta('snap')},
  {id:'sb5',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Tap one box for every sound you hear.',prompt:'How many sounds are in “brush”?',audioText:'brush',answer:'4 sounds',hint:'/b/ /r/ /ŭ/ /sh/. Remember /sh/ is one sound.',difficulty:4,...meta('brush')},
  {id:'sb6',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Tap one box for every sound you hear.',prompt:'How many sounds are in “stamp”?',audioText:'stamp',answer:'5 sounds',hint:'Stretch it: /s/ /t/ /ă/ /m/ /p/.',difficulty:4,...meta('stamp')},

  {id:'ss1',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change the sound in your head.',prompt:'Change the first sound in the word you hear to /ch/. What new word do you make?',audioText:'ship',choices:['chip','chin','chat'],answer:'chip',hint:'Hold /ip/ in your head. Replace only /sh/ with /ch/.',difficulty:2,manipulation:'substitute',...meta('ship')},
  {id:'ss2',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change the sound in your head.',prompt:'Change the first sound in the word you hear to /t/. What new word do you make?',audioText:'map',choices:['tap','tan','tag'],answer:'tap',hint:'Hold /ap/ in your head. Replace only /m/ with /t/.',difficulty:2,manipulation:'substitute',...meta('map')},
  {id:'ss3',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Listen first. Take one sound away in your head.',prompt:'Take away /s/ from the word you hear. What word is left?',audioText:'snap',choices:['nap','nab','nat'],answer:'nap',hint:'Remove only the first /s/.',difficulty:3,manipulation:'delete',...meta('snap')},
  {id:'ss4',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Listen first. Take one sound away in your head.',prompt:'Take away /s/ from the word you hear. What word is left?',audioText:'fist',choices:['fit','fin','fib'],answer:'fit',hint:'Remove /s/ but keep the final /t/.',difficulty:3,manipulation:'delete',pattern:'CVCC',level:'blend'},
  {id:'ss5',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change a sound inside the blend.',prompt:'Change /l/ in the word you hear to /k/. What new word do you make?',audioText:'slip',choices:['skip','skit','skim'],answer:'skip',hint:'Keep /s/ and /ip/. Change only /l/ to /k/.',difficulty:4,manipulation:'substitute',...meta('slip')},
  {id:'ss6',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Listen first. Take a sound out of the blend.',prompt:'Take away /r/ from the word you hear. What word is left?',audioText:'crash',choices:['cash','cap','cab'],answer:'cash',hint:'Remove only /r/, then blend what remains.',difficulty:4,manipulation:'delete',...meta('crash')},
  {id:'ss7',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Listen first. Take a sound out of the blend.',prompt:'Take away /t/ from the word you hear. What mystery word is left?',audioText:'stamp',choices:['samp','sam','sap'],answer:'samp',hint:'Remove only /t/ and keep every other sound.',difficulty:5,manipulation:'delete',...meta('stamp')},
  {id:'ss8',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change one sound.',prompt:'Change /n/ in “snap” to /l/. What new word do you make?',audioText:'snap',choices:['slap','slip','clap'],answer:'slap',hint:'Keep /s/, /ă/, and /p/. Change only /n/ to /l/.',difficulty:4,manipulation:'substitute',...meta('snap')},

  ...['map','tap','ship','chat','stop','slip','snap','brush','crash','stamp'].map((word,i):Activity=>({
    id:`wb${i+1}`,type:'word_builder',skillId:i<4?'DC-02':'DC-03',title:'Word Builder',
    instruction:'Listen to the word. Build it from left to right.',prompt:'Build the word you hear.',
    audioText:word,tokens:w(word).graphemes,distractorTokens:i>=4?['e']:undefined,answer:word,
    hint:`Say it slowly and map one spelling to each sound.`,difficulty:w(word).difficulty,...meta(word)
  })),

  ...['shap','chim','slop','brip'].map((word,i):Activity=>({
    id:`mw${i+1}`,type:'mystery_words',skillId:'DC-03',title:'Mystery Words',
    instruction:'Listen first. Blend the sounds in your head.',prompt:'Blend the sounds. What mystery word do they make?',
    audioText:word,phonemes:w(word).phonemes,
    choices:i===0?['shap','sham','shad']:i===1?['chim','chip','chit']:i===2?['slop','slot','slom']:['brip','brim','brin'],
    answer:word,hint:'Listen again. Hold each sound, then blend from left to right.',difficulty:w(word).difficulty,...meta(word)
  })),

  {id:'rm1',type:'reading_mission',skillId:'FL-01',title:'Reading Mission',instruction:'Read the mission, then answer.',prompt:'Mia saw a ship at the dock. The ship had a red flag and a tall mast. She sat on a bench with her dad and watched the ship glide past. A small tug boat followed behind it. Mia waved as the ship moved toward the bridge. What did Mia watch glide past?',choices:['a ship','a train','a fish'],answer:'a ship',hint:'Look for what moved past Mia near the dock.',difficulty:2,pattern:'DIGRAPH',level:'digraph'},
  {id:'rm2',type:'reading_mission',skillId:'FL-01',title:'Reading Mission',instruction:'Read the mission, then answer.',prompt:'Ben packed a snack and went on a short hike with his aunt. The path went past a pond and up a small hill. At the top, Ben spotted a red fox near a log. The fox stood still for a moment and then ran into the brush. What animal did Ben see?',choices:['a fox','a frog','a dog'],answer:'a fox',hint:'Look at what Ben spotted near the log.',difficulty:2,pattern:'CVC',level:'cvc'},
  {id:'rm3',type:'reading_mission',skillId:'FL-02',title:'Reading Mission',instruction:'Read smoothly and use the details to answer.',prompt:'Lena and Max built a small ramp for their toy cars. Max sent a blue car down first, but it stopped on the rug. Lena raised the ramp with two books. This time the car sped across the floor and bumped the wall. What did Lena change?',choices:['She raised the ramp.','She changed the car.','She moved the wall.'],answer:'She raised the ramp.',hint:'What did Lena do with the two books?',difficulty:3,pattern:'BLEND',level:'blend'},
  {id:'rm4',type:'reading_mission',skillId:'FL-02',title:'Reading Mission',instruction:'Read smoothly and use the details to answer.',prompt:'A storm passed through town before dinner. When the rain stopped, Noah put on his boots and went outside. He found small branches on the grass and a puddle beside the curb. Then the sun came out, and he saw a bright rainbow over the houses. What happened after the rain stopped?',choices:['Noah went outside.','Dinner started.','The storm got stronger.'],answer:'Noah went outside.',hint:'Find the sentence that begins “When the rain stopped.”',difficulty:3,pattern:'BLEND',level:'blend'}
];

export const lesson = activityBank;
