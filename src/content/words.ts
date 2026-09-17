export type WordLevel = 'cvc' | 'digraph' | 'blend' | 'ccvc_cvcc' | 'advanced_blend';

export type WordEntry = {
  id: string;
  word: string;
  phonemes: string[];
  graphemes: string[];
  pattern: string;
  level: WordLevel;
  difficulty: number;
  realWord: boolean;
};

const rows: Array<[string,string[],string[],string,WordLevel,number]> = [
['map',['m','short_a','p'],['m','a','p'],'CVC','cvc',1],
['tap',['t','short_a','p'],['t','a','p'],'CVC','cvc',1],
['sat',['s','short_a','t'],['s','a','t'],'CVC','cvc',1],
['mat',['m','short_a','t'],['m','a','t'],'CVC','cvc',1],
['nap',['n','short_a','p'],['n','a','p'],'CVC','cvc',1],
['cat',['k','short_a','t'],['c','a','t'],'CVC','cvc',1],
['sit',['s','short_i','t'],['s','i','t'],'CVC','cvc',1],
['fit',['f','short_i','t'],['f','i','t'],'CVC','cvc',1],
['lip',['l','short_i','p'],['l','i','p'],'CVC','cvc',1],
['fin',['f','short_i','n'],['f','i','n'],'CVC','cvc',1],
['mop',['m','short_o','p'],['m','o','p'],'CVC','cvc',1],
['log',['l','short_o','g'],['l','o','g'],'CVC','cvc',1],
['hot',['h','short_o','t'],['h','o','t'],'CVC','cvc',1],
['sun',['s','short_u','n'],['s','u','n'],'CVC','cvc',1],
['run',['r','short_u','n'],['r','u','n'],'CVC','cvc',1],
['ship',['sh','short_i','p'],['sh','i','p'],'DIGRAPH','digraph',2],
['shop',['sh','short_o','p'],['sh','o','p'],'DIGRAPH','digraph',2],
['shut',['sh','short_u','t'],['sh','u','t'],'DIGRAPH','digraph',2],
['chat',['ch','short_a','t'],['ch','a','t'],'DIGRAPH','digraph',2],
['chin',['ch','short_i','n'],['ch','i','n'],'DIGRAPH','digraph',2],
['chip',['ch','short_i','p'],['ch','i','p'],'DIGRAPH','digraph',2],
['fish',['f','short_i','sh'],['f','i','sh'],'DIGRAPH','digraph',2],
['cash',['k','short_a','sh'],['c','a','sh'],'DIGRAPH','digraph',2],
['rush',['r','short_u','sh'],['r','u','sh'],'DIGRAPH','digraph',2],
['stop',['s','t','short_o','p'],['s','t','o','p'],'CCVC','blend',3],
['slip',['s','l','short_i','p'],['s','l','i','p'],'CCVC','blend',3],
['snap',['s','n','short_a','p'],['s','n','a','p'],'CCVC','blend',3],
['plan',['p','l','short_a','n'],['p','l','a','n'],'CCVC','blend',3],
['clap',['k','l','short_a','p'],['c','l','a','p'],'CCVC','blend',3],
['frog',['f','r','short_o','g'],['f','r','o','g'],'CCVC','blend',3],
['drip',['d','r','short_i','p'],['d','r','i','p'],'CCVC','blend',3],
['brush',['b','r','short_u','sh'],['b','r','u','sh'],'BLEND+DIGRAPH','ccvc_cvcc',4],
['crash',['k','r','short_a','sh'],['c','r','a','sh'],'BLEND+DIGRAPH','ccvc_cvcc',4],
['stamp',['s','t','short_a','m','p'],['s','t','a','m','p'],'CCVCC','ccvc_cvcc',4],
['plant',['p','l','short_a','n','t'],['p','l','a','n','t'],'CCVCC','ccvc_cvcc',4],
['grasp',['g','r','short_a','s','p'],['g','r','a','s','p'],'CCVCC','ccvc_cvcc',4],
['shap',['sh','short_a','p'],['sh','a','p'],'DIGRAPH','digraph',2],
['chim',['ch','short_i','m'],['ch','i','m'],'DIGRAPH','digraph',2],
['slop',['s','l','short_o','p'],['s','l','o','p'],'CCVC','blend',3],
['brip',['b','r','short_i','p'],['b','r','i','p'],'CCVC','blend',3],
];

export const wordBank: WordEntry[] = rows.map(([word,phonemes,graphemes,pattern,level,difficulty],i)=>({
  id:`w${String(i+1).padStart(3,'0')}`, word, phonemes, graphemes, pattern, level, difficulty,
  realWord: !['shap','chim','slop','brip'].includes(word)
}));
