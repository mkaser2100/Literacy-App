import { activityBank, type Activity, type ActivityType } from '../content/lesson';
import type { Attempt } from '../services/lexi';

export type SkillMastery = {
  skillId: string;
  score: number;
  accuracy: number;
  independentRate: number;
  avgResponseMs: number;
  attempts: number;
};

const TYPES: ActivityType[] = [
  'sound_detective','sound_builder','sound_switch',
  'word_builder','mystery_words','reading_mission'
];

export function calculateMastery(attempts: Attempt[]): SkillMastery[] {
  const skills = [...new Set(activityBank.map(a => a.skillId))];
  return skills.map(skillId => {
    const rows = attempts.filter(a => a.skillId === skillId).slice(-12);
    if (!rows.length) return {skillId,score:35,accuracy:0,independentRate:0,avgResponseMs:0,attempts:0};
    const weighted = rows.map((r,i) => ({r,w:i+1}));
    const denom = weighted.reduce((n,x)=>n+x.w,0);
    const accuracy = weighted.reduce((n,x)=>n+(x.r.isCorrect?x.w:0),0)/denom;
    const independentRate = weighted.reduce((n,x)=>n+(x.r.isCorrect&&!x.r.hintUsed&&x.r.attemptNumber===1?x.w:0),0)/denom;
    const avgResponseMs = Math.round(rows.reduce((n,r)=>n+r.responseTimeMs,0)/rows.length);
    const automaticity = avgResponseMs === 0 ? .5 : avgResponseMs < 9000 ? 1 : avgResponseMs < 16000 ? .75 : .5;
    const score = Math.round(100*(accuracy*.45 + independentRate*.35 + automaticity*.20));
    return {skillId,score,accuracy:Math.round(accuracy*100),independentRate:Math.round(independentRate*100),avgResponseMs,attempts:rows.length};
  });
}

export function buildAdaptiveLesson(attempts: Attempt[]): Activity[] {
  const mastery = calculateMastery(attempts);
  const score = (skillId:string) => mastery.find(m=>m.skillId===skillId)?.score ?? 35;
  const seen = new Map<string,number>();
  attempts.forEach(a=>seen.set(a.contentId,(seen.get(a.contentId)||0)+1));

  // Three meaningful trials per activity block = 18 interactions.
  // Weak skills sort first; within a skill, less-seen content sorts first.
  return TYPES.flatMap(type =>
    activityBank
      .filter(a=>a.type===type)
      .sort((a,b)=>(score(a.skillId)-score(b.skillId)) || ((seen.get(a.id)||0)-(seen.get(b.id)||0)) || (a.difficulty-b.difficulty))
      .slice(0,3)
  );
}

export const progress = (i:number,total:number) => Math.round((i/Math.max(total,1))*100);
