import { Flame, Star, Target, Timer } from 'lucide-react';

export default function Complete({home}:{home:()=>void}) {
  const s=JSON.parse(localStorage.getItem('lexi_last_summary')||'{}');
  const mins=Math.floor((s.durationMs||0)/60000);
  const secs=Math.floor(((s.durationMs||0)%60000)/1000).toString().padStart(2,'0');
  return <main className="complete-screen">
    <div className="confetti" aria-hidden="true"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
    <div className="completion-medal"><Star size={54} fill="currentColor"/></div>
    <p className="complete-kicker">GREAT WORK</p><h1>Lesson Complete!</h1><p className="complete-sub">You showed your sound-symbol superpowers.</p>
    <div className="xp-pill">+{s.xp||38} XP</div>
    <section className="complete-stats">
      <div><span className="complete-stat-icon green"><Target/></span><strong>6/6</strong><small>Activities</small></div>
      <div><span className="complete-stat-icon purple"><Star/></span><strong>{s.accuracy??0}%</strong><small>First try</small></div>
      <div><span className="complete-stat-icon blue"><Timer/></span><strong>{mins}:{secs}</strong><small>Time</small></div>
    </section>
    <section className="streak-panel"><Flame size={35} fill="currentColor"/><div><strong>6 day streak!</strong><span>Come back tomorrow to keep it going.</span></div></section>
    <button className="primary complete-button" onClick={home}>Continue</button>
    <button className="back-home" onClick={home}>Back to Home</button>
  </main>
}
