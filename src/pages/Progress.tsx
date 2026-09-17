import { calculateMastery } from '../engine/lessonEngine';
import { getAttempts, getSessions } from '../services/lexi';

export default function Progress(){
  const sessions=getSessions(), completed=sessions.filter(s=>s.completedAt), mastery=calculateMastery(getAttempts());
  const avg=completed.length?Math.round(completed.reduce((n,s)=>n+(s.accuracy||0),0)/completed.length):0;
  const practiced=mastery.filter(m=>m.attempts>0).sort((a,b)=>a.score-b.score);
  return <main className="page"><div className="eyebrow">PARENT VIEW</div><h1>Progress</h1>
    <div className="stats">
      <div><strong>{completed.length}</strong><span>Sessions</span></div>
      <div><strong>{avg}%</strong><span>Avg. accuracy</span></div>
      <div><strong>{completed.reduce((n,s)=>n+(s.stars||0),0)}</strong><span>Stars earned</span></div>
    </div>
    <h2>Skill mastery</h2>
    <div className="session-list">{practiced.length===0?<p className="muted">Complete a lesson to begin skill tracking.</p>:practiced.map(m=>
      <div className="session-row" key={m.skillId}><div><strong>{m.skillId}</strong><span>{m.attempts} recent attempts</span></div><div><strong>{m.score}%</strong><span>{m.accuracy}% accuracy</span></div></div>
    )}</div>
    <h2>Recent sessions</h2>
    <div className="session-list">{completed.length===0?<p className="muted">Complete a lesson to see session history.</p>:completed.slice(0,10).map(s=>
      <div className="session-row" key={s.id}><div><strong>{new Date(s.startedAt).toLocaleDateString()}</strong><span>{new Date(s.startedAt).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</span></div><div><strong>{s.accuracy}%</strong><span>{Math.round((s.durationMs||0)/60000)} min · {s.itemCount||0} items</span></div></div>
    )}</div>
  </main>;
}
