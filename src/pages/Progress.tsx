import { calculateMastery } from '../engine/lessonEngine';
import { getAttempts, getSessions } from '../services/lexi';

const skillNames:Record<string,string>={
  'pa-isolation':'Sound Isolation',
  'pa-segment':'Sound Segmentation',
  'pa-blend':'Sound Blending',
  'pa-delete':'Sound Deletion',
  'pa-substitute':'Sound Substitution',
  'sound-symbol':'Sound-Symbol Mapping',
  'decoding-nonsense':'Mystery Word Decoding',
  'decoding':'Word Decoding',
  'decoding-fluency':'Decoding Fluency'
};
const pretty=(s:string)=>skillNames[s]||s.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase());

export default function Progress(){
  const sessions=getSessions(),completed=sessions.filter(s=>s.completedAt),mastery=calculateMastery(getAttempts());
  const avg=completed.length?Math.round(completed.reduce((n,s)=>n+(s.accuracy||0),0)/completed.length):0;
  const avgMin=completed.length?Math.round(completed.reduce((n,s)=>n+(s.durationMs||0),0)/completed.length/60000):0;
  const practiced=mastery.filter(m=>m.attempts>0).sort((a,b)=>a.score-b.score);
  return <main className="screen parent-screen">
    <div className="parent-title"><div><p className="eyebrow">PARENT VIEW</p><h1>Progress</h1></div><span className="parent-lock">Parent</span></div>
    <div className="parent-tabs"><button className="active">Overview</button><button>Skills</button><button>Sessions</button></div>
    <p className="parent-note">A quick look at recent practice, developing skills, and independent accuracy.</p>
    <section className="parent-summary">
      <div><strong>{completed.length}</strong><span>Sessions</span><small>completed</small></div>
      <div><strong>{avgMin}m</strong><span>Avg. time</span><small>per lesson</small></div>
      <div><strong>{avg}%</strong><span>Accuracy</span><small>first try</small></div>
    </section>
    <section className="dashboard-section">
      <div className="section-heading"><div><p className="eyebrow">SKILL PROGRESS</p><h2>Growing skills</h2></div><span>Recent</span></div>
      {practiced.length===0?<p className="muted">Complete a lesson to begin skill tracking.</p>:<div className="skill-bars">
        {practiced.slice(0,8).map(m=><div className="skill-bar" key={m.skillId}>
          <div><b>{pretty(m.skillId)}</b><span>{m.score}%</span></div><div className="skill-track"><i style={{width:`${m.score}%`}}/></div>
        </div>)}
      </div>}
    </section>
    <section className="dashboard-section recent-section">
      <div className="section-heading"><div><p className="eyebrow">RECENT SESSIONS</p><h2>Practice history</h2></div></div>
      {completed.length===0?<p className="muted">Complete a lesson to see session history.</p>:<div className="parent-session-list">
        {completed.slice(0,5).map(s=><div className="parent-session" key={s.id}>
          <div><b>{new Date(s.startedAt).toLocaleDateString([],{month:'short',day:'numeric'})}</b><span>{new Date(s.startedAt).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</span></div>
          <div><b>{Math.round((s.durationMs||0)/60000)} min</b><span>Duration</span></div>
          <div><b>{s.accuracy}%</b><span>Accuracy</span></div>
        </div>)}
      </div>}
    </section>
  </main>
}
