import { Flame, Play, Star, Target, BarChart3, Trophy, Sparkles } from 'lucide-react';
import { getSessions } from '../services/lexi';
export default function Home({start,go}:{start:()=>void;go:(page:string)=>void}) {
 const completed=getSessions().filter(s=>s.completedAt),totalStars=completed.reduce((n,s)=>n+(s.stars||0),0),streak=6;
 return <main className="screen home-screen">
  <header className="home-header"><div className="lexi-brand">Lexi</div><div className="header-score"><span className="score-item streak"><Flame size={20} fill="currentColor"/><b>{streak}</b></span><span className="score-item stars"><Star size={20} fill="currentColor"/><b>{totalStars}</b></span></div></header>
  <section className="home-greeting"><p className="eyebrow">TODAY</p><h1>Good morning!</h1><p>Small steps. Big progress.</p></section>
  <section className="today-card"><div className="today-card-copy"><span className="today-label"><Sparkles size={15}/> TODAY'S LESSON</span><h2>Sound-Symbol<br/>Superpowers</h2><p>10–15 min <span>•</span> 6 activities</p><div className="lesson-goal"><Target size={18}/><span>Build decoding skills</span></div></div><button className="lesson-play" onClick={start}><Play size={27} fill="currentColor"/></button></section>
  <section className="home-landscape"><div className="sun"/><div className="mountain mountain-back"/><div className="mountain mountain-mid"/><div className="mountain mountain-front"/><div className="landscape-copy"><strong>Braver readers.</strong><span>Brighter futures.</span></div></section>
  <section className="quick-actions"><button onClick={start}><span className="quick-icon"><Target size={22}/></span><b>Practice</b></button><button onClick={()=>go('progress')}><span className="quick-icon"><BarChart3 size={22}/></span><b>My Progress</b></button><button onClick={()=>go('rewards')}><span className="quick-icon"><Trophy size={22}/></span><b>Rewards</b></button></section>
 </main>
}
