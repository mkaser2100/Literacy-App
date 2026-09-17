export type ActivityType =
  | 'sound_detective' | 'sound_builder' | 'sound_switch'
  | 'word_builder' | 'mystery_words' | 'reading_mission';

export type Activity = {
  id: string; type: ActivityType; skillId: string; title: string;
  instruction: string; prompt: string; audioText?: string;
  choices?: string[]; tokens?: string[]; answer: string;
  hint: string; difficulty: number;
};

export const activityBank: Activity[] = [
  {id:'sd1',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen first. Find the word that starts with the sound.',prompt:'Which word starts with /sh/?',audioText:'ship',choices:['ship','chip','sip'],answer:'ship',hint:'Stretch the beginning: shhh-ip.',difficulty:1},
  {id:'sd2',type:'sound_detective',skillId:'PA-02',title:'Sound Detective',instruction:'Listen first. Find the word that starts with the sound.',prompt:'Which word starts with /ch/?',audioText:'chair',choices:['share','chair','stair'],answer:'chair',hint:'Listen for the quick /ch/ sound at the start.',difficulty:1},
  {id:'sd3',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen for the middle sound.',prompt:'Which word has /ă/ in the middle?',audioText:'map',choices:['map','mop','meep'],answer:'map',hint:'Stretch each word and listen only to the middle.',difficulty:2},
  {id:'sd4',type:'sound_detective',skillId:'PA-03',title:'Sound Detective',instruction:'Listen for the middle sound.',prompt:'Which word has /ĭ/ in the middle?',audioText:'fish',choices:['fish','fash','foosh'],answer:'fish',hint:'Say each slowly. Which middle sound is /ĭ/?',difficulty:2},

  {id:'sb1',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Count the sounds you hear, not the letters.',prompt:'How many sounds are in “phone”?',audioText:'phone',choices:['2 sounds','3 sounds','4 sounds'],answer:'3 sounds',hint:'Say it slowly: /f/ /ō/ /n/.',difficulty:2},
  {id:'sb2',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Count the sounds you hear, not the letters.',prompt:'How many sounds are in “ship”?',audioText:'ship',choices:['2 sounds','3 sounds','4 sounds'],answer:'3 sounds',hint:'/sh/ is one sound. Try /sh/ /ĭ/ /p/.',difficulty:2},
  {id:'sb3',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Count every sound in the word.',prompt:'How many sounds are in “stamp”?',audioText:'stamp',choices:['3 sounds','4 sounds','5 sounds'],answer:'5 sounds',hint:'Stretch it: /s/ /t/ /ă/ /m/ /p/.',difficulty:3},
  {id:'sb4',type:'sound_builder',skillId:'PA-04',title:'Sound Builder',instruction:'Count every sound in the word.',prompt:'How many sounds are in “brush”?',audioText:'brush',choices:['3 sounds','4 sounds','5 sounds'],answer:'4 sounds',hint:'Stretch it: /b/ /r/ /ŭ/ /sh/.',difficulty:3},

  {id:'ss1',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Change one sound and make a new word.',prompt:'Change the first sound in “ship” to /ch/.',audioText:'ship',choices:['chip','shop','chop'],answer:'chip',hint:'Keep /ip/. Replace only /sh/ with /ch/.',difficulty:2},
  {id:'ss2',type:'sound_switch',skillId:'PA-06',title:'Sound Switch',instruction:'Change one sound and make a new word.',prompt:'Change the first sound in “map” to /t/.',audioText:'map',choices:['tap','tip','mat'],answer:'tap',hint:'Keep /ap/ and replace /m/ with /t/.',difficulty:2},
  {id:'ss3',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Take away one sound.',prompt:'Say “snap” without /s/.',audioText:'snap',choices:['nap','sap','snap'],answer:'nap',hint:'Start with /s/ /n/ /ă/ /p/. Take away only /s/.',difficulty:3},
  {id:'ss4',type:'sound_switch',skillId:'PA-05',title:'Sound Switch',instruction:'Take away one sound.',prompt:'Say “fist” without /s/.',audioText:'fist',choices:['fit','fish','ist'],answer:'fit',hint:'Say /f/ /ĭ/ /s/ /t/, then remove /s/.',difficulty:3},

  {id:'wb1',type:'word_builder',skillId:'DC-02',title:'Word Builder',instruction:'Build the word from its sound parts.',prompt:'Build “ship”.',audioText:'ship',tokens:['sh','i','p'],answer:'ship',hint:'Listen: /sh/ /ĭ/ /p/.',difficulty:2},
  {id:'wb2',type:'word_builder',skillId:'DC-02',title:'Word Builder',instruction:'Build the word from its sound parts.',prompt:'Build “chat”.',audioText:'chat',tokens:['ch','a','t'],answer:'chat',hint:'Listen: /ch/ /ă/ /t/.',difficulty:2},
  {id:'wb3',type:'word_builder',skillId:'DC-03',title:'Word Builder',instruction:'Build the word from its sound parts.',prompt:'Build “stop”.',audioText:'stop',tokens:['s','t','o','p'],answer:'stop',hint:'Keep both sounds in the beginning blend: /s/ /t/.',difficulty:3},
  {id:'wb4',type:'word_builder',skillId:'DC-03',title:'Word Builder',instruction:'Build the word from its sound parts.',prompt:'Build “brush”.',audioText:'brush',tokens:['b','r','u','sh'],answer:'brush',hint:'Listen for /b/ /r/ /ŭ/ /sh/.',difficulty:3},

  {id:'mw1',type:'mystery_words',skillId:'DC-03',title:'Mystery Words',instruction:'Decode the pretend word from left to right.',prompt:'Which word says /sh/ /ă/ /p/?',choices:['shap','chap','sap'],answer:'shap',hint:'Blend /sh/ … /ă/ … /p/.',difficulty:2},
  {id:'mw2',type:'mystery_words',skillId:'DC-03',title:'Mystery Words',instruction:'Decode the pretend word from left to right.',prompt:'Which word says /ch/ /ĭ/ /m/?',choices:['chim','shim','cham'],answer:'chim',hint:'Blend /ch/ … /ĭ/ … /m/.',difficulty:2},
  {id:'mw3',type:'mystery_words',skillId:'DC-03',title:'Mystery Words',instruction:'Keep every sound in the blend.',prompt:'Which word says /s/ /l/ /ŏ/ /p/?',choices:['slop','sop','shop'],answer:'slop',hint:'Blend all four sounds: /s/ /l/ /ŏ/ /p/.',difficulty:3},
  {id:'mw4',type:'mystery_words',skillId:'DC-03',title:'Mystery Words',instruction:'Keep every sound in the blend.',prompt:'Which word says /b/ /r/ /ĭ/ /m/?',choices:['brim','bim','grim'],answer:'brim',hint:'Hold onto both beginning sounds: /b/ /r/.',difficulty:3},

  {id:'rm1',type:'reading_mission',skillId:'FL-01',title:'Reading Mission',instruction:'Read the mission, then answer.',prompt:'Mia saw a ship at the dock. The ship had a red flag and a tall mast. She sat on a bench with her dad and watched the ship glide past. A small tug boat followed behind it. Mia waved as the ship moved toward the bridge. What did Mia watch glide past?',choices:['a ship','a train','a fish'],answer:'a ship',hint:'Look for what moved past Mia near the dock.',difficulty:2},
  {id:'rm2',type:'reading_mission',skillId:'FL-01',title:'Reading Mission',instruction:'Read the mission, then answer.',prompt:'Ben packed a snack and went on a short hike with his aunt. The path went past a pond and up a small hill. At the top, Ben spotted a red fox near a log. The fox stood still for a moment and then ran into the brush. What animal did Ben see?',choices:['a fox','a frog','a dog'],answer:'a fox',hint:'Look at what Ben spotted near the log.',difficulty:2},
  {id:'rm3',type:'reading_mission',skillId:'FL-02',title:'Reading Mission',instruction:'Read smoothly and use the details to answer.',prompt:'Lena and Max built a small ramp for their toy cars. Max sent a blue car down first, but it stopped on the rug. Lena raised the ramp with two books. This time the car sped across the floor and bumped the wall. What did Lena change?',choices:['She raised the ramp.','She changed the car.','She moved the wall.'],answer:'She raised the ramp.',hint:'What did Lena do with the two books?',difficulty:3},
  {id:'rm4',type:'reading_mission',skillId:'FL-02',title:'Reading Mission',instruction:'Read smoothly and use the details to answer.',prompt:'A storm passed through town before dinner. When the rain stopped, Noah put on his boots and went outside. He found small branches on the grass and a puddle beside the curb. Then the sun came out, and he saw a bright rainbow over the houses. What happened after the rain stopped?',choices:['Noah went outside.','Dinner started.','The storm got stronger.'],answer:'Noah went outside.',hint:'Find the sentence that begins “When the rain stopped.”',difficulty:3}
];

// Kept for compatibility with any Phase 2 imports.
export const lesson = activityBank;
