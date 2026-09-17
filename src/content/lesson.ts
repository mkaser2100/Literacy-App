export type ActivityType =
  | 'sound_detective'
  | 'sound_builder'
  | 'sound_switch'
  | 'word_builder'
  | 'mystery_words'
  | 'reading_mission';

export type Activity = {
  id: string;
  type: ActivityType;
  skillId: string;
  title: string;
  instruction: string;
  prompt: string;
  audioText?: string;
  choices?: string[];
  tokens?: string[];
  answer: string;
  hint: string;
  difficulty: number;
};

export const lesson: Activity[] = [
  {
    id: 'sd1', type: 'sound_detective', skillId: 'PA-02', title: 'Sound Detective',
    instruction: 'Listen first. Find the word that starts with the sound.',
    prompt: 'Which word starts with /sh/?', audioText: 'ship',
    choices: ['ship', 'chip', 'sip'], answer: 'ship',
    hint: 'Stretch the beginning: shhh-ip. What sound comes first?', difficulty: 1
  },
  {
    id: 'sb1', type: 'sound_builder', skillId: 'PA-04', title: 'Sound Builder',
    instruction: 'Tap one sound tile for every sound you hear.',
    prompt: 'How many sounds are in “phone”?', audioText: 'phone',
    choices: ['2 sounds', '3 sounds', '4 sounds'], answer: '3 sounds',
    hint: 'Say it slowly: /f/ /ō/ /n/. Count the sounds, not the letters.', difficulty: 2
  },
  {
    id: 'ss1', type: 'sound_switch', skillId: 'PA-06', title: 'Sound Switch',
    instruction: 'Change one sound and make a new word.',
    prompt: 'Change the first sound in “ship” to /ch/.', audioText: 'ship',
    choices: ['chip', 'shop', 'chop'], answer: 'chip',
    hint: 'Keep /ip/. Replace only /sh/ with /ch/: /ch/ + /ip/.', difficulty: 2
  },
  {
    id: 'wb1', type: 'word_builder', skillId: 'DC-02', title: 'Word Builder',
    instruction: 'Build the word from its sound parts.',
    prompt: 'Build “ship”.', audioText: 'ship',
    tokens: ['sh', 'i', 'p'], answer: 'ship',
    hint: 'Listen for three sounds: /sh/ /i/ /p/. The first sound uses two letters.', difficulty: 2
  },
  {
    id: 'mw1', type: 'mystery_words', skillId: 'DC-03', title: 'Mystery Words',
    instruction: 'Use the sound pattern to decode a pretend word.',
    prompt: 'Which word says /sh/ /a/ /p/?',
    choices: ['shap', 'chap', 'sap'], answer: 'shap',
    hint: 'Blend the sounds from left to right: /sh/ … /a/ … /p/.', difficulty: 2
  },
  {
    id: 'rm1', type: 'reading_mission', skillId: 'FL-01', title: 'Reading Mission',
    instruction: 'Read the short mission, then answer.',
    prompt: 'Mia saw a ship at the dock. The ship had a red flag. She sat on a bench and watched it glide past. Which thing did Mia watch?',
    choices: ['a ship', 'a chip', 'a fish'], answer: 'a ship',
    hint: 'Look back at the first and last sentences. What moved past Mia?', difficulty: 2
  }
];
