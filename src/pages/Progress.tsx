import { useState } from 'react';
import { calculateMastery, type SkillMastery } from '../engine/lessonEngine';
import { getAttempts, getSessions } from '../services/lexi';

type Tab='overview'|'skills'|'sessions';

const skillInfo:Record<string,{name:string;description:string}>={
  'PA-02':{name:'Sound Blending',description:'Combines individual sounds to make a whole word.'},
  'PA-03':{name:'Sound Segmentation',description:'Breaks a spoken word into its individual sounds.'},
  'PA-04':{name:'Changing Sounds',description:'Changes, removes, or replaces sounds inside spoken words.'},
  'PA-05':{name:'Sound-Symbol Mapping',description:'Connects the sounds in a word to the letters that spell them.'},
  'PA-06':{name:'Sound Identification',description:'Listens for and identifies a target sound in a spoken word.'},
  'DC-03':{name:'Mystery Word Decoding',description:'Blends unfamiliar or made-up words without relying on memory.'},
  'FL-01':{name:'Accurate Word Reading',description:'Reads words accurately while applying decoding skills.'},
  'FL-02':{name:'Connected Text Reading',description:'Applies decoding skills while reading sentences and short passages.'},
  'pa-isolation':{name:'Sound Identification',description:'Listens for and identifies a target sound in a spoken word.'},
  'pa-segment':{name:'Sound Segmentation',description:'Breaks a spoken word into its individual sounds.'},
  'pa-blend':{name:'Sound Blending',description:'Combines individual sounds to make a whole word.'},
  'pa-manipulation':{name:'Changing Sounds',description:'Changes, removes, or replaces sounds inside spoken words.'},
  'pa-delete':{name:'Changing Sounds',description:'Removes a sound from a spoken word.'},
  'pa-substitute':{name:'Changing Sounds',description:'Replaces one sound with another in a spoken word.'},
  'sound-symbol':{name:'Sound-Symbol Mapping',description:'Connects speech sounds to the letters that represent them.'},
  'decoding-nonsense':{name:'Mystery Word Decoding',description:'Blends unfamiliar or made-up words without relying on memory.'},
  'decoding':{name:'Word Decoding',description:'Uses sound-symbol knowledge to read unfamiliar words.'},
  'decoding-fluency':{name:'Decoding Fluency',description:'Builds accurate, increasingly automatic word reading.'}
};

const info=(id:string)=>skillInfo[id]||{
  name:id.replace(/[-_]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
  description:'A reading skill currently being practiced in Lexi.'
};
const status=(m:SkillMastery)=>m.score>=88?'Mastered':m.score>=75?'Secure':m.score>=55?'Developing':'Emerging';
const statusClass=(m:SkillMastery)=>status(m).toLowerCase();

export default function Progress(){
  const [tab,setTab]=useState<Tab>('overview');
  const sessions=getSessions(),completed=sessions.filter(s=>s.completedAt);
  const mastery=calculateMastery(getAttempts());
  const avg=completed.length?Math.round(completed.reduce((n,s)=>n+(s.accuracy||0),0)/completed.length):0;
  const avgMin=completed.length?Math.round(completed.reduce((n,s)=>n+(s.durationMs||0),0)/completed.length/60000):0;
  const practiced=mastery.filter(m=>m.attempts>0).sort((a,b)=>a.score-b.score);
  const focus=practiced.slice(0,3);
  const strongest=[...practiced].sort((a,b)=>b.score-a.score)[0];

  const summary=<section className="parent-summary">
    <div><strong>{completed.length}</strong><span>Sessions</span><small>completed</small></div>
    <div><strong>{avgMin}m</strong><span>Avg. time</span><small>per lesson</small></div>
    <div><strong>{avg}%</strong><span>Accuracy</span><small>first try</small></div>
  </section>;

  const sessionsView=<section className="dashboard-section recent-section">
    <div className="section-heading"><div><p className="eyebrow">PRACTICE HISTORY</p><h2>Recent sessions</h2></div></div>
    {completed.length===0?<p className="muted">Complete a lesson to see session history.</p>:<div className="parent-session-list">
      {completed.slice(0,10).map(s=><div className="parent-session" key={s.id}>
        <div><b>{new Date(s.startedAt).toLocaleDateString([],{month:'short',day:'numeric'})}</b><span>{new Date(s.startedAt).toLocaleTimeString([],{hour:'numeric',minute:'2-digit'})}</span></div>
        <div><b>{Math.round((s.durationMs||0)/60000)} min</b><span>Duration</span></div>
        <div><b>{s.accuracy}%</b><span>First try</span></div>
      </div>)}
    </div>}
  </section>;

  return <main className="screen parent-screen">
    <div className="parent-title"><div><p className="eyebrow">PARENT VIEW</p><h1>Progress</h1></div><span className="parent-lock">Parent</span></div>
    <div className="parent-tabs">
      <button className={tab==='overview'?'active':''} onClick={()=>setTab('overview')}>Overview</button>
      <button className={tab==='skills'?'active':''} onClick={()=>setTab('skills')}>Skills</button>
      <button className={tab==='sessions'?'active':''} onClick={()=>setTab('sessions')}>Sessions</button>
    </div>

    {tab==='overview'&&<>
      <p className="parent-note">A quick snapshot of practice and the reading skills that need the most attention.</p>
      {summary}
      <section className="dashboard-section">
        <div className="section-heading"><div><p className="eyebrow">SKILLS TO WATCH</p><h2>Current focus</h2></div><span>{focus.length} skills</span></div>
        {focus.length===0?<p className="muted">Complete a lesson to identify current focus skills.</p>:<div className="focus-list">
          {focus.map(m=><div className="focus-row" key={m.skillId}><div><b>{info(m.skillId).name}</b><span>{info(m.skillId).description}</span></div><em className={statusClass(m)}>{status(m)}</em></div>)}
        </div>}
      </section>
      {strongest&&<section className="parent-insight"><span>STRENGTH TO BUILD ON</span><b>{info(strongest.skillId).name}</b><p>{info(strongest.skillId).description}</p></section>}
      <section className="dashboard-section overview-recent">
        <div className="section-heading"><div><p className="eyebrow">LATEST PRACTICE</p><h2>Most recent session</h2></div></div>
        {completed.length===0?<p className="muted">No completed sessions yet.</p>:<div className="latest-session"><strong>{completed[0].accuracy}%</strong><div><b>first-try accuracy</b><span>{Math.round((completed[0].durationMs||0)/60000)} min • {new Date(completed[0].startedAt).toLocaleDateString([],{month:'short',day:'numeric'})}</span></div></div>}
      </section>
    </>}

    {tab==='skills'&&<>
      <p className="parent-note">Each skill includes what it means, current mastery, accuracy, and independent performance.</p>
      <section className="skills-detail">
        {practiced.length===0?<section className="dashboard-section"><p className="muted">Complete a lesson to begin skill tracking.</p></section>:practiced.map(m=><article className="skill-detail-card" key={m.skillId}>
          <div className="skill-detail-head"><div><h2>{info(m.skillId).name}</h2><p>{info(m.skillId).description}</p></div><em className={statusClass(m)}>{status(m)}</em></div>
          <div className="mastery-line"><span>Mastery</span><b>{m.score}%</b></div><div className="skill-track large"><i style={{width:`${m.score}%`}}/></div>
          <div className="skill-metrics"><div><b>{m.accuracy}%</b><span>Accuracy</span></div><div><b>{m.independentRate}%</b><span>Independent</span></div><div><b>{m.attempts}</b><span>Attempts</span></div></div>
        </article>)}
      </section>
    </>}

    {tab==='sessions'&&<>
      <p className="parent-note">Review practice consistency, lesson time, and first-try accuracy over time.</p>
      {summary}{sessionsView}
    </>}
  </main>
}
