import { useState } from 'react';
import { Check, Flame, Lock, Medal, Sparkles, Star, Trophy } from 'lucide-react';
import { getSessions } from '../services/lexi';
const levels=[['Sound Explorer','Discover how words are made of sounds'],['Letter Detective','Connect sounds and symbols'],['Sound-Symbol Superpowers','Build stronger decoding skills'],['Word Wizard','Read more complex word patterns'],['Fluency Finder','Build smooth, confident reading'],['Story Star','Bring skills into connected reading']];
const badges=[['First Mission','Complete your first lesson'],['Sound Scientist','Practice sound skills'],['Word Builder','Build words sound by sound'],['Independent Reader','Solve items without a hint'],['Persistence','Keep working after a tricky item'],['Practice Week','Practice on 5 different days']];
export default function Rewards(){
 const [tab,setTab]=useState<'levels'|'badges'|'streaks'>('levels'),completed=getSessions().filter(s=>s.completedAt),stars=completed.reduce((n,s)=>n+(s.stars||0),0);
 return <main className="screen rewards-screen"><p className="eyebrow">YOUR PROGRESS</p><h1>Rewards</h1>
 <div className="reward-tabs"><button className={tab==='levels'?'active':''} onClick={()=>setTab('levels')}>Levels</button><button className={tab==='badges'?'active':''} onClick={()=>setTab('badges')}>Badges</button><button className={tab==='streaks'?'active':''} onClick={()=>setTab('streaks')}>Streaks</button></div>
 <section className="reward-summary"><div><span className="reward-mini purple"><Star size={18} fill="currentColor"/></span><b>{stars}</b><small>Stars</small></div><div><span className="reward-mini orange"><Flame size={18} fill="currentColor"/></span><b>6</b><small>Day streak</small></div><div><span className="reward-mini gold"><Trophy size={18}/></span><b>3</b><small>Level</small></div></section>
 {tab==='levels'&&<section className="level-list">{levels.map(([name,desc],i)=>{const n=i+1,done=n<3,active=n===3;return <div className={`reward-level ${done?'done':''} ${active?'active':''} ${n>3?'locked':''}`} key={name}><div className="level-medal">{done?<Check/>:active?<Sparkles/>:n>3?<Lock/>:<Medal/>}</div><div><small>LEVEL {n}</small><b>{name}</b><span>{desc}</span></div>{active&&<em>CURRENT</em>}{n>3&&<span className="unlock-note">Keep practicing to unlock</span>}</div>})}</section>}
 {tab==='badges'&&<section className="badge-grid">{badges.map(([name,desc],i)=><div className={`badge-card ${i<Math.min(3,completed.length)?'earned':''}`} key={name}><span><Trophy size={21}/></span><b>{name}</b><small>{desc}</small></div>)}</section>}
 {tab==='streaks'&&<section className="streak-view"><Flame size={46} fill="currentColor"/><h2>6 day streak</h2><p>Practice consistently, not perfectly. Every practice day helps build stronger reading pathways.</p><div className="streak-week">{['M','T','W','T','F','S','S'].map((d,i)=><span className={i<6?'done':''} key={i}>{i<6?'✓':d}</span>)}</div></section>}
 </main>
}
