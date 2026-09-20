import { wordBank } from './words';
import type { Activity } from './lesson';

const w=(word:string)=>wordBank.find(x=>x.word===word)!;
const meta=(word:string)=>({wordId:w(word).id,pattern:w(word).pattern,level:w(word).level});

const detective:Activity[]=[
  {id:'asd01',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen first. Find the word that starts with the sound.',prompt:'Which word starts with /m/?',audioText:'Listen for mmm.',choices:['map','tap','sat'],answer:'map',hint:'Stretch the beginning: mmm-ap.',difficulty:1,...meta('map')},
  {id:'asd02',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen first. Find the word that starts with the sound.',prompt:'Which word starts with /s/?',audioText:'Listen for sss.',choices:['sat','mat','nap'],answer:'sat',hint:'Listen to the first sound only.',difficulty:1,...meta('sat')},
  {id:'asd03',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen for the middle sound.',prompt:'Which word has /ĭ/ in the middle?',audioText:'Listen for short i.',choices:['sit','sat','mop'],answer:'sit',hint:'Stretch each word and listen to the vowel.',difficulty:2,...meta('sit')},
  {id:'asd04',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen for the middle sound.',prompt:'Which word has /ŏ/ in the middle?',audioText:'Listen for short o.',choices:['shop','ship','chat'],answer:'shop',hint:'Stretch each word and listen to the vowel.',difficulty:2,...meta('shop')},
  {id:'asd05',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen to the beginning blend.',prompt:'Which word starts with /st/?',audioText:'Listen for sss-t.',choices:['stop','shop','snap'],answer:'stop',hint:'Listen for two beginning sounds: /s/ then /t/.',difficulty:3,...meta('stop')},
  {id:'asd06',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen to the beginning blend.',prompt:'Which word starts with /pl/?',audioText:'Listen for p-l.',choices:['plan','clap','plant'],answer:'plan',hint:'Listen for /p/ followed by /l/.',difficulty:3,...meta('plan')},
  {id:'asd07',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen carefully to the vowel inside the blend.',prompt:'Which word has /ă/ in the middle?',audioText:'Listen for short a inside a longer word.',choices:['crash','brush','drip'],answer:'crash',hint:'Say each word slowly and listen to the vowel.',difficulty:4,...meta('crash')},
  {id:'asd08',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen carefully to the beginning cluster.',prompt:'Which word starts with /gr/?',audioText:'Listen for g-r.',choices:['grasp','crash','brush'],answer:'grasp',hint:'Keep both beginning sounds separate.',difficulty:4,...meta('grasp')},
  {id:'asd09',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen across the whole word.',prompt:'Which word has five separate sounds?',audioText:'Listen and count every sound.',choices:['stamp','ship','plan'],answer:'stamp',hint:'Stretch stamp: /s/ /t/ /ă/ /m/ /p/.',difficulty:5,...meta('stamp')},
  {id:'asd10',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen across the whole word.',prompt:'Which word has five separate sounds?',audioText:'Listen and count every sound.',choices:['plant','chat','slip'],answer:'plant',hint:'Stretch plant one sound at a time.',difficulty:5,...meta('plant')}
];

const builderWords=['map','sit','mop','ship','chat','stop','slip','plan','brush','crash','stamp','plant','grasp'];
const builders:Activity[]=builderWords.map((word,i)=>({
  id:`asb${String(i+1).padStart(2,'0')}`,type:'sound_builder',skillId:'PA-04',title:'Sound Builder',
  instruction:'Tap one box for every sound you hear.',prompt:'How many sounds do you hear?',audioText:word,
  answer:`${w(word).phonemes.length} sounds`,hint:`Stretch ${word} one sound at a time.`,
  difficulty:Math.min(5,Math.max(1,w(word).difficulty)),...meta(word)
}));

const switches:Activity[]=[
  {id:'ass01',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change one sound in your head.',prompt:'Change /m/ in “map” to /t/. What word do you make?',audioText:'map',choices:['tap','nap','mat'],answer:'tap',hint:'Keep /ap/. Change only the first sound.',difficulty:1,manipulation:'substitute',...meta('map')},
  {id:'ass02',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change one sound in your head.',prompt:'Change /s/ in “sit” to /f/. What word do you make?',audioText:'sit',choices:['fit','fin','sat'],answer:'fit',hint:'Keep /it/. Change only the first sound.',difficulty:1,manipulation:'substitute',...meta('sit')},
  {id:'ass03',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change one sound in your head.',prompt:'Change /sh/ in “ship” to /ch/. What word do you make?',audioText:'ship',choices:['chip','chin','chat'],answer:'chip',hint:'Keep /ip/. Change only the first sound.',difficulty:2,manipulation:'substitute',...meta('ship')},
  {id:'ass04',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Listen first. Take one sound away.',prompt:'Take away /s/ from “snap.” What word is left?',audioText:'snap',choices:['nap','sap','map'],answer:'nap',hint:'Remove only the first /s/.',difficulty:3,manipulation:'delete',...meta('snap')},
  {id:'ass05',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change one sound inside the blend.',prompt:'Change /l/ in “slip” to /t/. What word do you make?',audioText:'slip',choices:['stip','slap','skip'],answer:'stip',hint:'Keep /s/ and /ip/. Change only /l/.',difficulty:3,manipulation:'substitute',...meta('slip')},
  {id:'ass06',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Listen first. Take one sound away.',prompt:'Take away /r/ from “crash.” What word is left?',audioText:'crash',choices:['cash','rash','cram'],answer:'cash',hint:'Remove only /r/, then blend what remains.',difficulty:4,manipulation:'delete',...meta('crash')},
  {id:'ass07',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Listen first. Take one sound away.',prompt:'Take away /t/ from “stamp.” What word is left?',audioText:'stamp',choices:['samp','sap','tam'],answer:'samp',hint:'Keep every sound except /t/.',difficulty:4,manipulation:'delete',...meta('stamp')},
  {id:'ass08',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Listen first. Take one sound away from a longer cluster.',prompt:'Take away /l/ from “plant.” What word is left?',audioText:'plant',choices:['pant','plan','ant'],answer:'pant',hint:'Keep /p/, /ă/, /n/, /t/.',difficulty:5,manipulation:'delete',...meta('plant')},
  {id:'ass09',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Listen first. Change one sound inside a longer word.',prompt:'Change /r/ in “grasp” to /l/. What new word do you make?',audioText:'grasp',choices:['glasp','gasp','gramp'],answer:'glasp',hint:'Keep every sound except /r/.',difficulty:5,manipulation:'substitute',...meta('grasp')}
];

const wordBuilders:Activity[]=wordBank.filter(x=>x.realWord).map((entry,i)=>({
  id:`awb${String(i+1).padStart(2,'0')}`,type:'word_builder',
  skillId:entry.difficulty<=2?'DC-02':'DC-03',title:'Word Builder',
  instruction:'Listen to the word. Build it from left to right.',prompt:'Build the word you hear.',
  audioText:entry.word,tokens:entry.graphemes,distractorTokens:entry.difficulty>=3?['e']:undefined,
  answer:entry.word,hint:'Say it slowly and map one spelling to each sound.',
  difficulty:Math.min(5,Math.max(1,entry.difficulty)),wordId:entry.id,pattern:entry.pattern,level:entry.level
}));

const mysteryRows:Array<[string,string[],string[],number,string]>=[
  ['mip',['m','short_i','p'],['mip','map','mop'],1,'CVC'],
  ['lom',['l','short_o','m'],['lom','lam','lim'],1,'CVC'],
  ['shom',['sh','short_o','m'],['shom','shim','chom'],2,'DIGRAPH'],
  ['cham',['ch','short_a','m'],['cham','chim','sham'],2,'DIGRAPH'],
  ['blip',['b','l','short_i','p'],['blip','brip','slip'],3,'CCVC'],
  ['slap',['s','l','short_a','p'],['slap','slop','snap'],3,'CCVC'],
  ['bram',['b','r','short_a','m'],['bram','brim','blam'],4,'CCVC'],
  ['plom',['p','l','short_o','m'],['plom','plan','slom'],4,'CCVC'],
  ['splim',['s','p','l','short_i','m'],['splim','slim','plim'],5,'CCCVC'],
  ['bramp',['b','r','short_a','m','p'],['bramp','bram','cramp'],5,'CCVCC']
];
const mysteries:Activity[]=mysteryRows.map(([word,phonemes,choices,difficulty,pattern],i)=>({
  id:`amw${String(i+1).padStart(2,'0')}`,type:'mystery_words',skillId:'DC-03',title:'Mystery Words',
  instruction:'Listen first. Blend the sounds in your head.',prompt:'Blend the sounds. What mystery word do they make?',
  audioText:word,phonemes,choices,answer:word,hint:'Listen again. Hold each sound, then blend from left to right.',
  difficulty,pattern,level:difficulty<=1?'cvc':difficulty===2?'digraph':difficulty===3?'blend':difficulty===4?'ccvc_cvcc':'advanced_blend'
}));

export const adaptiveActivityBank:Activity[]=[
  ...detective,...builders,...switches,...wordBuilders,...mysteries
];
