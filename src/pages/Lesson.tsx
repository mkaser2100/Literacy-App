import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Lightbulb, Volume2, X } from 'lucide-react';
import { buildAdaptiveLesson } from '../engine/lessonEngine';
import { finishSession, getAttempts, saveAttempt, speak, startSession } from '../services/lexi';

function shuffle<T>(items:T[]):T[] {
  const result=[...items];
  for(let i=result.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [result[i],result[j]]=[result[j],result[i]];
  }
  return result;
}

export default function Lesson({done,exit}:{done:()=>void;exit:()=>void}) {
  const session=useMemo(()=>startSession(),[]);
  const plan=useMemo(()=>buildAdaptiveLesson(getAttempts()),[]);
  const [index,setIndex]=useState(0), [selected,setSelected]=useState('');
  const [built,setBuilt]=useState<string[]>([]);
  const [feedback,setFeedback]=useState<'correct'|'incorrect'|null>(null);
  const [hintUsed,setHintUsed]=useState(false), [attemptNumber,setAttemptNumber]=useState(1);
  const [firstTryCorrect,setFirstTryCorrect]=useState(0), [stars,setStars]=useState(0);
  const presentedAt=useRef(new Date().toISOString()), startedMs=useRef(Date.now());
  const activity=plan[index];

  const wordBuilderTiles=useMemo(()=>{
    if(activity.type!=='word_builder')return [];
    const all=[...(activity.tokens||[]),...(activity.distractorTokens||[])];
    let shuffled=shuffle(all.map((token,i)=>({id:`${activity.id}-${i}-${token}`,token})));
    // Avoid accidentally showing the exact answer order when possible.
    const joined=shuffled.map(x=>x.token).join('');
    if(shuffled.length>1 && joined===activity.answer){
      [shuffled[0],shuffled[1]]=[shuffled[1],shuffled[0]];
    }
    return shuffled;
  },[activity]);

  const builtWord=built.map(x=>x.split('::').slice(1).join('::')).join('');
  const response=activity.type==='word_builder'?builtWord:selected;
  const pct=((index+(feedback==='correct'?1:0))/plan.length)*100;

  const reset=()=>{setSelected('');setBuilt([]);setFeedback(null);setHintUsed(false);setAttemptNumber(1);presentedAt.current=new Date().toISOString();};

  const submit=()=>{
    if(!response)return;
    const correct=response===activity.answer, now=new Date();
    saveAttempt({sessionId:session.id,activityId:activity.id,activityType:activity.type,skillId:activity.skillId,
      contentId:activity.id,presentedAt:presentedAt.current,answeredAt:now.toISOString(),response,
      correctAnswer:activity.answer,isCorrect:correct,responseTimeMs:now.getTime()-new Date(presentedAt.current).getTime(),
      hintUsed,attemptNumber,difficulty:activity.difficulty});
    setFeedback(correct?'correct':'incorrect');
    if(correct){
      if(attemptNumber===1&&!hintUsed){setFirstTryCorrect(v=>v+1);setStars(v=>v+3);}
      else if(hintUsed)setStars(v=>v+2); else setStars(v=>v+1);
    }
  };

  const retry=()=>{setFeedback(null);setSelected('');setBuilt([]);setAttemptNumber(v=>v+1);presentedAt.current=new Date().toISOString();};
  const next=()=>{
    if(index===plan.length-1){
      const durationMs=Date.now()-startedMs.current, accuracy=Math.round(firstTryCorrect/plan.length*100);
      finishSession(session.id,{completedAt:new Date().toISOString(),durationMs,itemCount:plan.length,correctCount:firstTryCorrect,accuracy,stars,xp:20+plan.length*3});
      localStorage.setItem('lexi_last_summary',JSON.stringify({durationMs,accuracy,stars,xp:20+plan.length*3}));
      done(); return;
    }
    setIndex(v=>v+1); reset();
  };

  const addTile=(id:string,token:string)=>{
    if(feedback||built.some(x=>x.startsWith(`${id}::`)))return;
    setBuilt(v=>[...v,`${id}::${token}`]);
  };
  const removeBuilt=(position:number)=>{
    if(feedback)return;
    setBuilt(v=>v.filter((_,i)=>i!==position));
  };
  const usedIds=new Set(built.map(x=>x.split('::')[0]));

  return <main className="lesson-screen">
    <header className="lesson-top">
      <button className="icon-button" onClick={exit} aria-label="Exit lesson"><ArrowLeft/></button>
      <div className="progress-track"><div className="progress-fill" style={{width:`${pct}%`}}/></div>
      <span className="step-count">{index+1}/{plan.length}</span>
    </header>
    <section className="activity-card">
      <div className="activity-kicker">{activity.skillId}</div><h1>{activity.title}</h1>
      <p className="instruction">{activity.instruction}</p>
      {activity.audioText&&<button className="listen-button" onClick={()=>speak(activity.audioText!)}><Volume2/> Listen</button>}
      <h2 className="prompt">{activity.prompt}</h2>

      {activity.type==='word_builder'?<>
        <div className="sound-map" aria-label="Sound boxes">
          {(activity.tokens||[]).map((_,i)=><div key={i} className={`sound-box ${built[i]?'filled':''}`}>{built[i]?built[i].split('::').slice(1).join('::'):<span>{i+1}</span>}</div>)}
        </div>
        <p className="builder-coach">Say the sounds slowly. Then tap the tiles in the order you hear them.</p>
        <div className="token-row">
          {wordBuilderTiles.map(tile=><button key={tile.id} disabled={usedIds.has(tile.id)||!!feedback}
            className={usedIds.has(tile.id)?'token used':'token'} onClick={()=>addTile(tile.id,tile.token)}>{tile.token}</button>)}
        </div>
        {built.length>0&&!feedback&&<button className="clear-builder" onClick={()=>removeBuilt(built.length-1)}>Undo last tile</button>}
      </>:<div className="choice-grid">{activity.choices?.map(c=><button key={c} disabled={!!feedback} className={`choice ${selected===c?'selected':''}`} onClick={()=>setSelected(c)}>{c}</button>)}</div>}

      {feedback==='incorrect'&&<div className="feedback incorrect"><X/><div><strong>Not quite yet.</strong><p>{activity.hint}</p></div></div>}
      {feedback==='correct'&&<div className="feedback correct"><Check/><div><strong>Nice work!</strong><p>{hintUsed?'You used the clue and worked it out.':'You got it independently.'}</p></div></div>}
      {!feedback&&<button className="hint-link" onClick={()=>setHintUsed(true)}><Lightbulb size={18}/> {hintUsed?activity.hint:'Need a hint?'}</button>}
      {!feedback&&<button className="primary" disabled={!response} onClick={submit}>Check</button>}
      {feedback==='incorrect'&&<button className="primary" onClick={retry}>Try Again</button>}
      {feedback==='correct'&&<button className="primary" onClick={next}>{index===plan.length-1?'Finish Lesson':'Continue'}</button>}
    </section>
  </main>;
}
