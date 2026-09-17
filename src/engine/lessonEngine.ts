import { activityBank, type Activity, type ActivityType } from '../content/lesson';
import type { Attempt } from '../services/lexi';

export type SkillMastery = {
  skillId: string; score: number; accuracy: number; independentRate: number;
  avgResponseMs: number; attempts: number;
};

const TYPES: ActivityType[] = [
  'sound_detective','sound_builder','sound_switch',
  'word_builder','mystery_words','reading_mission'
];

export function calculateMastery(attempts: Attempt[]): SkillMastery[] {
  const skills=[...new Set(activityBank.map(a=>a.skillId))];
  return skills.map(skillId=>{
    const rows=attempts.filter(a=>a.skillId===skillId).slice(-12);
    if(!rows.length)return {skillId,score:35,accuracy:0,independentRate:0,avgResponseMs:0,attempts:0};
    const weighted=rows.map((r,i)=>({r,w:i+1}));
    const denom=weighted.reduce((n,x)=>n+x.w,0);
    const accuracy=weighted.reduce((n,x)=>n+(x.r.isCorrect?x.w:0),0)/denom;
    const independentRate=weighted.reduce((n,x)=>n+(x.r.isCorrect&&!x.r.hintUsed&&x.r.attemptNumber===1?x.w:0),0)/denom;
    const avgResponseMs=Math.round(rows.reduce((n,r)=>n+r.responseTimeMs,0)/rows.length);
    const automaticity=avgResponseMs===0?.5:avgResponseMs<9000?1:avgResponseMs<16000?.75:.5;
    const score=Math.round(100*(accuracy*.45+independentRate*.35+automaticity*.20));
    return {skillId,score,accuracy:Math.round(accuracy*100),independentRate:Math.round(independentRate*100),avgResponseMs,attempts:rows.length};
  });
}

function exposure(attempts:Attempt[]){
  const map=new Map<string,{count:number;last:number}>();
  attempts.forEach((a,i)=>{
    const prior=map.get(a.contentId);
    map.set(a.contentId,{count:(prior?.count||0)+1,last:i});
  });
  return map;
}

export function buildAdaptiveLesson(attempts: Attempt[]): Activity[] {
  const mastery=calculateMastery(attempts);
  const score=(skillId:string)=>mastery.find(m=>m.skillId===skillId)?.score??35;
  const seen=exposure(attempts);
  const recent=new Set(attempts.slice(-18).map(a=>a.contentId));

  // Phase 4 selection:
  // 1) prioritize weaker skills
  // 2) prefer unseen/less-seen content
  // 3) cool down items used in the previous lesson when alternatives exist
  // 4) keep difficulty ordered inside otherwise-equal candidates
  return TYPES.flatMap(type=>{
    const candidates=activityBank.filter(a=>a.type===type);
    const fresh=candidates.filter(a=>!recent.has(a.id));
    const pool=fresh.length>=3?fresh:candidates;
    return [...pool].sort((a,b)=>
      (score(a.skillId)-score(b.skillId)) ||
      ((seen.get(a.id)?.count||0)-(seen.get(b.id)?.count||0)) ||
      (a.difficulty-b.difficulty)
    ).slice(0,3);
  });
}

export const progress=(i:number,total:number)=>Math.round((i/Math.max(total,1))*100);
