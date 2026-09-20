import { activityBank, type Activity, type ActivityType } from '../content/lesson';
import { adaptiveActivityBank } from '../content/adaptiveActivities';
import { readingMissionActivities } from '../content/readingMissions';
import type { Attempt } from '../services/lexi';

export type MasteryStatus='Emerging'|'Developing'|'Secure'|'Mastered';

export type SkillMastery = {
  skillId:string; score:number; accuracy:number; independentRate:number;
  retentionRate:number; avgResponseMs:number; attempts:number;
  currentLevel:number; status:MasteryStatus; lastPracticedAt:string;
};

const TYPES:ActivityType[]=[
  'sound_detective','sound_builder','sound_switch',
  'word_builder','mystery_words','reading_mission'
];

const fullBank:Activity[]=[
  ...activityBank.filter(a=>a.type!=='reading_mission'),
  ...adaptiveActivityBank,
  ...readingMissionActivities
];

const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
const firstAttempts=(rows:Attempt[])=>rows.filter(r=>r.attemptNumber===1);

function weightedRate(rows:Attempt[],predicate:(r:Attempt)=>boolean){
  if(!rows.length)return 0;
  const weighted=rows.map((r,i)=>({r,w:i+1}));
  const denom=weighted.reduce((n,x)=>n+x.w,0);
  return weighted.reduce((n,x)=>n+(predicate(x.r)?x.w:0),0)/denom;
}

function retentionRate(rows:Attempt[]){
  const byContent=new Map<string,Attempt[]>();
  rows.forEach(r=>byContent.set(r.contentId,[...(byContent.get(r.contentId)||[]),r]));
  const checks=[...byContent.values()].filter(group=>new Set(group.map(r=>r.sessionId)).size>=2);
  if(!checks.length)return 0;
  let passed=0,total=0;
  checks.forEach(group=>{
    const bySession=[...new Map(group.map(r=>[r.sessionId,r])).values()];
    bySession.slice(1).forEach(r=>{total++;if(r.isCorrect&&!r.hintUsed&&r.attemptNumber===1)passed++;});
  });
  return total?passed/total:0;
}

function levelEvidence(rows:Attempt[],level:number){
  const levelRows=firstAttempts(rows.filter(r=>r.difficulty===level));
  const sessions=new Set(levelRows.map(r=>r.sessionId)).size;
  const accuracy=weightedRate(levelRows,r=>r.isCorrect);
  const independent=weightedRate(levelRows,r=>r.isCorrect&&!r.hintUsed);
  return {attempts:levelRows.length,sessions,accuracy,independent};
}

function instructionalLevel(rows:Attempt[]){
  if(!rows.length)return 1;
  const practicedLevels=rows.map(r=>clamp(r.difficulty||1,1,5));
  let level=Math.max(1,Math.min(...practicedLevels));
  for(let candidate=1;candidate<=4;candidate++){
    const e=levelEvidence(rows,candidate);
    if(e.attempts>=4&&e.sessions>=2&&e.accuracy>=.85&&e.independent>=.80)level=Math.max(level,candidate+1);
    else if(e.attempts>0)level=Math.max(level,candidate);
  }
  return clamp(level,1,5);
}

export function calculateMastery(attempts:Attempt[]):SkillMastery[]{
  const skills=[...new Set(fullBank.map(a=>a.skillId))];
  return skills.map(skillId=>{
    const all=attempts.filter(a=>a.skillId===skillId);
    const rows=all.slice(-24);
    if(!rows.length)return {skillId,score:35,accuracy:0,independentRate:0,retentionRate:0,avgResponseMs:0,attempts:0,currentLevel:1,status:'Emerging',lastPracticedAt:''};
    const first=firstAttempts(rows);
    const accuracy=weightedRate(first,r=>r.isCorrect);
    const independentRate=weightedRate(first,r=>r.isCorrect&&!r.hintUsed);
    const retention=retentionRate(all);
    const avgResponseMs=Math.round(first.reduce((n,r)=>n+r.responseTimeMs,0)/Math.max(first.length,1));
    const automaticity=avgResponseMs===0?.5:avgResponseMs<9000?1:avgResponseMs<16000?.75:.5;
    // Accuracy and independence drive advancement. Retention is meaningful once repeated content exists.
    const retentionComponent=retention>0?retention:Math.min(accuracy,independentRate);
    const score=Math.round(100*(accuracy*.40+independentRate*.35+retentionComponent*.20+automaticity*.05));
    const currentLevel=instructionalLevel(all);
    const status:MasteryStatus=first.length>=8&&score>=88?'Mastered':first.length>=6&&score>=75?'Secure':first.length>=3&&score>=55?'Developing':'Emerging';
    return {
      skillId,score,accuracy:Math.round(accuracy*100),independentRate:Math.round(independentRate*100),
      retentionRate:Math.round(retentionComponent*100),avgResponseMs,attempts:first.length,currentLevel,status,
      lastPracticedAt:all[all.length-1]?.answeredAt||''
    };
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

function targetFor(skillId:string,mastery:SkillMastery[]){
  return mastery.find(m=>m.skillId===skillId)?.currentLevel??1;
}

function chooseCandidate(
  candidates:Activity[], attempts:Attempt[], mastery:SkillMastery[], mode:'current'|'review'|'challenge',
  excluded:Set<string>
){
  const seen=exposure(attempts,a=>a.contentId);
  const recent=new Set(attempts.slice(-36).map(a=>a.contentId));
  const pool=candidates.filter(a=>!excluded.has(a.id));
  const ranked=[...pool].sort((a,b)=>{
    const ta=targetFor(a.skillId,mastery),tb=targetFor(b.skillId,mastery);
    const desiredA=mode==='review'?Math.max(1,ta-1):mode==='challenge'?Math.min(5,ta+1):ta;
    const desiredB=mode==='review'?Math.max(1,tb-1):mode==='challenge'?Math.min(5,tb+1):tb;
    const recentA=recent.has(a.id)?1:0,recentB=recent.has(b.id)?1:0;
    const ma=mastery.find(m=>m.skillId===a.skillId)?.score??35;
    const mb=mastery.find(m=>m.skillId===b.skillId)?.score??35;
    return (recentA-recentB) ||
      (Math.abs(a.difficulty-desiredA)-Math.abs(b.difficulty-desiredB)) ||
      (ma-mb) ||
      ((seen.get(a.id)?.count||0)-(seen.get(b.id)?.count||0)) ||
      ((seen.get(a.id)?.last??-1)-(seen.get(b.id)?.last??-1));
  });
  return ranked[0];
}

function standardTypePlan(type:ActivityType,attempts:Attempt[],mastery:SkillMastery[],typeIndex:number){
  const candidates=fullBank.filter(a=>a.type===type);
  const chosen:Activity[]=[];
  const excluded=new Set<string>();
  // 2/3 at the learner's current instructional edge.
  for(let i=0;i<2;i++){
    const item=chooseCandidate(candidates,attempts,mastery,'current',excluded);
    if(item){chosen.push(item);excluded.add(item.id);}
  }
  // Across six activity types this alternates review/challenge: ~67% current, 17% review, 17% challenge.
  const mode=typeIndex%2===0?'review':'challenge';
  const third=chooseCandidate(candidates,attempts,mastery,mode,excluded);
  if(third)chosen.push(third);
  return chosen;
}

function readingPassageKey(a:Attempt){
  const legacy:Record<string,string>={rm1:'rm11',rm2:'rm21',rm3:'rm22',rm4:'rm23'};
  if(legacy[a.activityId])return legacy[a.activityId];
  const qMatch=a.activityId.match(/^(rm\d+)-q\d+$/);
  return qMatch?qMatch[1]:a.contentId;
}

function readingMissionPlan(attempts:Attempt[],mastery:SkillMastery[]){
  const history=attempts.filter(a=>a.activityType==='reading_mission');
  const passageExposure=exposure(history,readingPassageKey);
  const questionExposure=exposure(history,a=>a.activityId);
  const recentSessionIds:string[]=[];
  for(let i=history.length-1;i>=0&&recentSessionIds.length<2;i--){
    if(!recentSessionIds.includes(history[i].sessionId))recentSessionIds.push(history[i].sessionId);
  }
  const cooldown=new Set(history.filter(a=>recentSessionIds.includes(a.sessionId)).map(readingPassageKey));
  const byPassage=new Map<string,Activity[]>();
  readingMissionActivities.forEach(activity=>{
    const passageId=activity.passageId||activity.id;
    byPassage.set(passageId,[...(byPassage.get(passageId)||[]),activity]);
  });

  const readingMastery=mastery.filter(m=>m.skillId==='FL-01'||m.skillId==='FL-02');
  const target=Math.max(2,...readingMastery.filter(m=>m.attempts>0).map(m=>m.currentLevel));
  const sessionNumber=new Set(history.map(a=>a.sessionId)).size;
  const desired=[target,target,sessionNumber%2===0?Math.max(2,target-1):Math.min(5,target+1)];

  const selected:string[]=[];
  for(const wanted of desired){
    const candidates=[...byPassage.keys()].filter(id=>!selected.includes(id));
    candidates.sort((a,b)=>{
      const aa=byPassage.get(a)?.[0],bb=byPassage.get(b)?.[0];
      const blockedA=cooldown.has(a)?1:0,blockedB=cooldown.has(b)?1:0;
      return (blockedA-blockedB) ||
        (Math.abs((aa?.difficulty||2)-wanted)-Math.abs((bb?.difficulty||2)-wanted)) ||
        ((passageExposure.get(a)?.count||0)-(passageExposure.get(b)?.count||0)) ||
        ((passageExposure.get(a)?.last??-1)-(passageExposure.get(b)?.last??-1));
    });
    if(candidates[0])selected.push(candidates[0]);
  }

  return selected.map(passageId=>{
    const variants=byPassage.get(passageId)||[];
    return [...variants].sort((a,b)=>
      ((questionExposure.get(a.id)?.count||0)-(questionExposure.get(b.id)?.count||0)) ||
      ((questionExposure.get(a.id)?.last??-1)-(questionExposure.get(b.id)?.last??-1))
    )[0];
  });
}

export function buildAdaptiveLesson(attempts:Attempt[]):Activity[]{
  const mastery=calculateMastery(attempts);
  return TYPES.flatMap((type,index)=>
    type==='reading_mission'?readingMissionPlan(attempts,mastery):standardTypePlan(type,attempts,mastery,index)
  );
}

export const progress=(i:number,total:number)=>Math.round((i/Math.max(total,1))*100);
