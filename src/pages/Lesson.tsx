import { useMemo, useRef, useState } from 'react';
import { ArrowLeft, Check, Lightbulb, Volume2, X } from 'lucide-react';
import { lesson } from '../content/lesson';
import { finishSession, saveAttempt, speak, startSession } from '../services/lexi';

export default function Lesson({ done, exit }:{done:()=>void;exit:()=>void}) {
  const session = useMemo(() => startSession(), []);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState('');
  const [built, setBuilt] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<'correct'|'incorrect'|null>(null);
  const [hintUsed, setHintUsed] = useState(false);
  const [attemptNumber, setAttemptNumber] = useState(1);
  const [firstTryCorrect, setFirstTryCorrect] = useState(0);
  const [stars, setStars] = useState(0);
  const presentedAt = useRef(new Date().toISOString());
  const startedMs = useRef(Date.now());

  const activity = lesson[index];
  const response = activity.type === 'word_builder' ? built.join('') : selected;
  const pct = ((index + (feedback === 'correct' ? 1 : 0)) / lesson.length) * 100;

  const resetForNext = () => {
    setSelected(''); setBuilt([]); setFeedback(null); setHintUsed(false); setAttemptNumber(1);
    presentedAt.current = new Date().toISOString();
  };

  const check = () => {
    if (!response) return;
    const correct = response === activity.answer;
    const now = new Date();
    saveAttempt({
      sessionId: session.id, activityId: activity.id, activityType: activity.type,
      skillId: activity.skillId, contentId: activity.id, presentedAt: presentedAt.current,
      answeredAt: now.toISOString(), response, correctAnswer: activity.answer,
      isCorrect: correct, responseTimeMs: now.getTime() - new Date(presentedAt.current).getTime(),
      hintUsed, attemptNumber, difficulty: activity.difficulty
    });
    setFeedback(correct ? 'correct' : 'incorrect');
    if (correct) {
      if (attemptNumber === 1 && !hintUsed) { setFirstTryCorrect(v => v + 1); setStars(v => v + 3); }
      else if (hintUsed) setStars(v => v + 2);
      else setStars(v => v + 1);
    }
  };

  const retry = () => {
    setFeedback(null); setSelected(''); setBuilt([]); setHintUsed(true); setAttemptNumber(v => v + 1);
    presentedAt.current = new Date().toISOString();
  };

  const next = () => {
    if (index === lesson.length - 1) {
      const completedAt = new Date().toISOString();
      const durationMs = Date.now() - startedMs.current;
      const finalStars = stars;
      finishSession(session.id, {
        completedAt, durationMs, itemCount: lesson.length, correctCount: firstTryCorrect,
        accuracy: Math.round((firstTryCorrect / lesson.length) * 100), stars: finalStars, xp: 20 + lesson.length * 3
      });
      localStorage.setItem('lexi_last_summary', JSON.stringify({
        durationMs, accuracy: Math.round((firstTryCorrect / lesson.length) * 100),
        stars: finalStars, xp: 20 + lesson.length * 3
      }));
      done(); return;
    }
    setIndex(v => v + 1); resetForNext();
  };

  const toggleToken = (token:string, tokenIndex:number) => {
    if (feedback) return;
    if (built.includes(`${tokenIndex}:${token}`)) setBuilt(v => v.filter(x => x !== `${tokenIndex}:${token}`));
    else setBuilt(v => [...v, `${tokenIndex}:${token}`]);
  };
  const builtWord = built.map(x => x.split(':').slice(1).join(':')).join('');
  const actualResponse = activity.type === 'word_builder' ? builtWord : selected;

  const submit = () => {
    if (!actualResponse) return;
    const originalBuilt = built;
    if (activity.type === 'word_builder') {
      // save/check against ordered tile text rather than internal tile ids
      const correct = actualResponse === activity.answer;
      const now = new Date();
      saveAttempt({
        sessionId: session.id, activityId: activity.id, activityType: activity.type,
        skillId: activity.skillId, contentId: activity.id, presentedAt: presentedAt.current,
        answeredAt: now.toISOString(), response: actualResponse, correctAnswer: activity.answer,
        isCorrect: correct, responseTimeMs: now.getTime() - new Date(presentedAt.current).getTime(),
        hintUsed, attemptNumber, difficulty: activity.difficulty
      });
      setFeedback(correct ? 'correct' : 'incorrect');
      if (correct) {
        if (attemptNumber === 1 && !hintUsed) { setFirstTryCorrect(v => v + 1); setStars(v => v + 3); }
        else if (hintUsed) setStars(v => v + 2); else setStars(v => v + 1);
      }
      setBuilt(originalBuilt); return;
    }
    check();
  };

  return <main className="lesson-screen">
    <header className="lesson-top">
      <button className="icon-button" onClick={exit} aria-label="Exit lesson"><ArrowLeft/></button>
      <div className="progress-track"><div className="progress-fill" style={{width:`${pct}%`}}/></div>
      <span className="step-count">{index+1}/{lesson.length}</span>
    </header>

    <section className="activity-card">
      <div className="activity-kicker">{activity.skillId}</div>
      <h1>{activity.title}</h1>
      <p className="instruction">{activity.instruction}</p>

      {activity.audioText && <button className="listen-button" onClick={()=>speak(activity.audioText!)}><Volume2/> Listen</button>}
      <h2 className="prompt">{activity.prompt}</h2>

      {activity.type === 'word_builder' ? <>
        <div className="build-zone">{built.length ? built.map((x,i)=><span key={i}>{x.split(':').slice(1).join(':')}</span>) : <em>Tap the sound parts below</em>}</div>
        <div className="token-row">{activity.tokens?.map((t,i)=><button key={i} className={built.includes(`${i}:${t}`)?'token used':'token'} onClick={()=>toggleToken(t,i)}>{t}</button>)}</div>
      </> :
      <div className="choice-grid">{activity.choices?.map(choice =>
        <button key={choice} disabled={!!feedback} className={`choice ${selected===choice?'selected':''}`} onClick={()=>setSelected(choice)}>{choice}</button>
      )}</div>}

      {feedback === 'incorrect' && <div className="feedback incorrect"><X/><div><strong>Not quite yet.</strong><p>{activity.hint}</p></div></div>}
      {feedback === 'correct' && <div className="feedback correct"><Check/><div><strong>Nice decoding!</strong><p>{hintUsed ? 'You used the clue and worked it out.' : 'You got it independently.'}</p></div></div>}

      {!feedback && <button className="hint-link" onClick={()=>setHintUsed(true)}><Lightbulb size={18}/> {hintUsed ? activity.hint : 'Need a hint?'}</button>}
      {!feedback && <button className="primary" disabled={!actualResponse} onClick={submit}>Check</button>}
      {feedback === 'incorrect' && <button className="primary" onClick={retry}>Try Again</button>}
      {feedback === 'correct' && <button className="primary" onClick={next}>{index===lesson.length-1?'Finish Lesson':'Continue'}</button>}
    </section>
  </main>
}
