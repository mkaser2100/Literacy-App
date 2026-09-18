import { Check, Flame, Lock, Medal, Sparkles, Star, Trophy } from 'lucide-react';
import { getSessions } from '../services/lexi';

const levels=[
  ['Sound Explorer','Discover how words are made of sounds'],
  ['Letter Detective','Connect sounds and symbols'],
  ['Sound-Symbol Superpowers','Build stronger decoding skills'],
  ['Word Wizard','Read more complex word patterns'],
  ['Fluency Finder','Build smooth, confident reading'],
  ['Story Star','Bring skills into connected reading']
];

export default function Rewards(){
  const completed=getSessions().filter(s=>s.completedAt);
  const stars=completed.reduce((n,s)=>n+(s.stars||0),0);
  return <main className="screen rewards-screen">
    <p className="eyebrow">YOUR PROGRESS</p><h1>Rewards</h1>
    <div className="reward-tabs"><button className="active">Levels</button><button>Badges</button><button>Streaks</button></div>
    <section className="reward-summary">
      <div><span className="reward-mini purple"><Star size={18} fill="currentColor"/></span><b>{stars}</b><small>Stars</small></div>
      <div><span className="reward-mini orange"><Flame size={18} fill="currentColor"/></span><b>6</b><small>Day streak</small></div>
      <div><span className="reward-mini gold"><Trophy size={18}/></span><b>3</b><small>Level</small></div>
    </section>
    <section className="level-list">
      {levels.map(([name,desc],i)=>{
        const n=i+1,done=n<3,active=n===3;
        return <div className={`reward-level ${done?'done':''} ${active?'active':''} ${n>3?'locked':''}`} key={name}>
          <div className="level-medal">{done?<Check/>:active?<Sparkles/>:n>3?<Lock/>:<Medal/>}</div>
          <div><small>LEVEL {n}</small><b>{name}</b><span>{desc}</span></div>
          {active&&<em>CURRENT</em>}
        </div>
      })}
    </section>
  </main>
}
