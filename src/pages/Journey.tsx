import { Check, Lock, BookOpen, WandSparkles } from 'lucide-react';

const steps=[
  ['Sound Detective','Hear the sounds'],
  ['Sound Builder','Map every sound'],
  ['Sound Switch','Change the sounds'],
  ['Word Builder','Build what you hear'],
  ['Mystery Words','Blend a new word'],
  ['Reading Mission','Put it all together']
];

export default function Journey(){
  const current=2;
  return <main className="screen journey-screen">
    <div className="journey-heading"><p className="eyebrow">LEVEL 3</p><h1>Sound-Symbol<br/>Superpowers</h1></div>
    <section className="level-map">
      <div className="map-sky"><div className="map-sun"/><div className="map-cloud one"/><div className="map-cloud two"/></div>
      <div className="next-level"><span><Lock size={15}/></span><div><b>Level 4</b><small>Unlocks next!</small></div></div>
      <div className="map-trail"/>
      <div className="map-steps">
        {steps.map(([title,sub],i)=>{
          const done=i<current, active=i===current, locked=i>current;
          return <div className={`map-step step-${i+1} ${done?'done':''} ${active?'active':''} ${locked?'locked':''}`} key={title}>
            <div className="map-node">{done?<Check size={22}/>:i===5?<BookOpen size={20}/>:active?<WandSparkles size={20}/>:i+1}</div>
            <div className="map-label"><b>{i+1}. {title}</b><span>{sub}</span></div>
          </div>
        })}
      </div>
    </section>
    <section className="level-progress"><div><b>Level 3 Progress</b><span>{current}/6</span></div><div className="level-progress-track"><i style={{width:`${current/6*100}%`}}/></div></section>
  </main>
}
