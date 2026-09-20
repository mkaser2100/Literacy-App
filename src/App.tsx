import { useEffect, useState } from 'react';
import Nav from './components/Nav';
import Home from './pages/Home';
import Lesson from './pages/Lesson';
import Complete from './pages/Complete';
import Journey from './pages/Journey';
import Rewards from './pages/Rewards';
import Progress from './pages/Progress';
import Auth from './pages/Auth';
import { getAuthUser, initializeLexi, onAuthChange } from './services/lexi';

export default function App(){
  const [page,setPage]=useState('home');
  const [ready,setReady]=useState(false);
  const [signedIn,setSignedIn]=useState(false);
  const [error,setError]=useState('');

  useEffect(()=>{
    let active=true;
    const boot=async()=>{
      try{
        const user=await getAuthUser();
        if(!active)return;
        setSignedIn(!!user);
        if(user)await initializeLexi();
      }catch(err){if(active)setError(err instanceof Error?err.message:'Lexi could not load.');}
      finally{if(active)setReady(true);}
    };
    void boot();
    const unsubscribe=onAuthChange(async isSignedIn=>{
      if(!active)return;
      setSignedIn(isSignedIn);setReady(false);setError('');
      try{if(isSignedIn)await initializeLexi();}
      catch(err){setError(err instanceof Error?err.message:'Lexi could not load.');}
      finally{if(active)setReady(true);}
    });
    return()=>{active=false;unsubscribe();};
  },[]);

  if(!ready)return <main className="auth-screen"><section className="auth-card auth-loading"><div className="lexi-brand">Lexi</div><p>Loading your reading journey…</p></section></main>;
  if(error)return <main className="auth-screen"><section className="auth-card"><div className="lexi-brand">Lexi</div><h1>We couldn't load Lexi</h1><p className="auth-error">{error}</p><button className="primary" onClick={()=>location.reload()}>Try again</button></section></main>;
  if(!signedIn)return <Auth/>;

  if(page==='lesson')return <Lesson done={()=>setPage('complete')} exit={()=>setPage('home')}/>;
  if(page==='complete')return <Complete home={()=>setPage('home')}/>;
  const view=page==='journey'?<Journey/>:page==='rewards'?<Rewards/>:page==='progress'?<Progress/>:<Home start={()=>setPage('lesson')} go={setPage}/>;
  return <div className="app">{view}<Nav page={page} setPage={setPage}/></div>;
}
