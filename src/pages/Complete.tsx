import { Star, Trophy } from 'lucide-react';
export default function Complete({home}:{home:()=>void}) {
  const s = JSON.parse(localStorage.getItem('lexi_last_summary') || '{}');
  const mins = Math.floor((s.durationMs || 0)/60000);
  const secs = Math.floor(((s.durationMs || 0)%60000)/1000).toString().padStart(2,'0');
  return <main className="complete-screen">
    <Trophy size={64}/><h1>Lesson Complete!</h1><p>You showed your sound-symbol superpowers.</p>
    <div className="star-badge"><Star fill="currentColor"/> +{s.stars || 0} stars</div>
    <div className="summary-grid">
      <div><strong>6/6</strong><span>activities</span></div>
      <div><strong>{s.accuracy ?? 0}%</strong><span>first try</span></div>
      <div><strong>{mins}:{secs}</strong><span>time</span></div>
      <div><strong>+{s.xp || 38}</strong><span>XP</span></div>
    </div>
    <button className="primary light" onClick={home}>Back Home</button>
  </main>
}
