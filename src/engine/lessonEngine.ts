import { activityBank, type Activity, type ActivityType } from '../content/lesson';
import { readingMissionActivities } from '../content/readingMissions';
import type { Attempt } from '../services/lexi';

export type SkillMastery = {
  skillId: string; score: number; accuracy: number; independentRate: number;
  avgResponseMs: number; attempts: number;
};

const TYPES: ActivityType[] = [
  'sound_detective','sound_builder','sound_switch',
  'word_builder','mystery_words','reading_mission'
];

const fullBank=[...activityBank.filter(a=>a.type!=='reading_mission'),...readingMissionActivities];

export function calculateMastery(attempts: Attempt[]): SkillMastery[] {
  const skills=[...new Set(fullBank.map(a=>a.skillId))];
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

function exposure(attempts:Attempt[],key:(a:Attempt)=>string){
  const map=new Map<string,{count:number;last:number}>();
  attempts.forEach((a,i)=>{
    const k=key(a),prior=map.get(k);
    map.set(k,{count:(prior?.count||0)+1,last:i});
  });
  return map;
}

function masteryForReading(score:(skillId:string)=>number,attempts:Attempt[]){
  const practiced=['FL-01','FL-02'].filter(skill=>attempts.some(a=>a.skillId===skill));
  return practiced.length?Math.max(...practiced.map(score)):35;
}

function readingMissionPlan(attempts:Attempt[],score:(skillId:string)=>number):Activity[]{
  const history=attempts.filter(a=>a.activityType==='reading_mission');
  const passageKey=(a:Attempt)=>{
    const legacy:Record<string,string>={rm1:'rm11',rm2:'rm21',rm3:'rm22',rm4:'rm23'};
    if(legacy[a.activityId])return legacy[a.activityId];
    const qMatch=a.activityId.match(/^(rm\d+)-q\d+$/);
    return qMatch?qMatch[1]:a.contentId;
  };
  const passageExposure=exposure(history,passageKey);
  const questionExposure=exposure(history,a=>a.activityId);

  // Cool down every passage used in the two most recent Reading Mission sessions.
  const recentSessionIds:string[]=[];
  for(let i=history.length-1;i>=0 && recentSessionIds.length<2;i--){
    if(!recentSessionIds.includes(history[i].sessionId))recentSessionIds.push(history[i].sessionId);
  }
  const cooldown=new Set(
    history.filter(a=>recentSessionIds.includes(a.sessionId)).map(passageKey)
  );

  const byPassage=new Map<string,Activity[]>();
  readingMissionActivities.forEach(activity=>{
    const passageId=activity.passageId||activity.id;
    byPassage.set(passageId,[...(byPassage.get(passageId)||[]),activity]);
  });

  const practicedReading=masteryForReading(score,attempts);
  const targetDifficulty=practicedReading>=75?4:practicedReading>=55?3:2;

  const passageIds=[...byPassage.keys()].sort((a,b)=>{
    const aBlocked=cooldown.has(a)?1:0,bBlocked=cooldown.has(b)?1:0;
    const aSeen=passageExposure.get(a),bSeen=passageExposure.get(b);
    const aDifficulty=byPassage.get(a)?.[0]?.difficulty||1;
    const bDifficulty=byPassage.get(b)?.[0]?.difficulty||1;
    return (aBlocked-bBlocked) ||
      ((aSeen?.count||0)-(bSeen?.count||0)) ||
      (Math.abs(aDifficulty-targetDifficulty)-Math.abs(bDifficulty-targetDifficulty)) ||
      ((aSeen?.last??-1)-(bSeen?.last??-1));
  });

  return passageIds.slice(0,3).map(passageId=>{
    const variants=byPassage.get(passageId)||[];
    return [...variants].sort((a,b)=>
      ((questionExposure.get(a.id)?.count||0)-(questionExposure.get(b.id)?.count||0)) ||
      (score(a.skillId)-score(b.skillId)) ||
      (a.difficulty-b.difficulty)
    )[0];
  });
}

export function buildAdaptiveLesson(attempts: Attempt[]): Activity[] {
  const mastery=calculateMastery(attempts);
  const score=(skillId:string)=>mastery.find(m=>m.skillId===skillId)?.score??35;
  const seen=exposure(attempts,a=>a.contentId);
  const recent=new Set(attempts.slice(-18).map(a=>a.contentId));

  return TYPES.flatMap(type=>{
    if(type==='reading_mission')return readingMissionPlan(attempts,score);

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
