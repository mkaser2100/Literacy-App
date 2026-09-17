import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Lightbulb, Volume2, X } from 'lucide-react';
import { buildAdaptiveLesson } from '../engine/lessonEngine';
import { finishSession, getAttempts, saveAttempt, speak, startSession } from '../services/lexi';

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
  const builtWord=built.map(x=>x.split(':').slice(1).join(':')).join('');
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
  const toggleToken=(token:string,i:number)=>{
    if(feedback)return; const key=`${i}:${token}`;
    setBuilt(v=>v.includes(key)?v.filter(x=>x!==key):[...v,key]);
  };

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
        <div className="build-zone">{built.length?built.map((x,i)=><span key={i}>{x.split(':').slice(1).join(':')}</span>):<em>Tap the sound parts below</em>}</div>
        <div className="token-row">{activity.tokens?.map((t,i)=><button key={i} className={built.includes(`${i}:${t}`)?'token used':'token'} onClick={()=>toggleToken(t,i)}>{t}</button>)}</div>
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
