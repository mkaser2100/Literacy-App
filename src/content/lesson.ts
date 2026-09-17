export type Activity={id:string;type:'sound_detective'|'word_builder'|'sound_switch'|'mystery_words'|'reading_mission';title:string;prompt:string;choices?:string[];answer:string};
export const lesson:Activity[]=[
{id:'sd1',type:'sound_detective',title:'Sound Detective',prompt:'Which word starts with the /sh/ sound?',choices:['ship','chip','sip'],answer:'ship'},
{id:'sd2',type:'sound_detective',title:'Sound Detective',prompt:'Which word ends with the /ch/ sound?',choices:['fish','match','map'],answer:'match'},
{id:'wb1',type:'word_builder',title:'Word Builder',prompt:'Build the word that means a small boat.',choices:['sh','i','p'],answer:'ship'},
{id:'ss1',type:'sound_switch',title:'Sound Switch',prompt:'Change the first sound in “ship” to /ch/.',choices:['chip','shop','chop'],answer:'chip'},
{id:'mw1',type:'mystery_words',title:'Mystery Words',prompt:'Read this pretend word.',choices:['shap','chap','sap'],answer:'shap'},
{id:'rm1',type:'reading_mission',title:'Reading Mission',prompt:'Choose the sentence with the word “ship”.',choices:['The ship is big.','The chip is hot.','I sip milk.'],answer:'The ship is big.'}
];
