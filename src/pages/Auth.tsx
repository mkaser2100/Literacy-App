import { useState } from 'react';
import { BookOpen, Lock, Mail } from 'lucide-react';
import { signIn, signUp } from '../services/lexi';

export default function Auth(){
  const [mode,setMode]=useState<'signin'|'signup'>('signin');
  const [email,setEmail]=useState(''),[password,setPassword]=useState('');
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[error,setError]=useState('');

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();setBusy(true);setError('');setMessage('');
    try{
      if(mode==='signin') await signIn(email.trim(),password);
      else{
        const result=await signUp(email.trim(),password);
        if(result.needsEmailConfirmation)setMessage('Account created. Check your email to confirm it, then sign in.');
        else setMessage('Account created. Lexi is ready.');
      }
    }catch(err){setError(err instanceof Error?err.message:'Could not sign in.');}
    finally{setBusy(false);}
  };

  return <main className="auth-screen">
    <section className="auth-card">
      <div className="auth-mark"><BookOpen/></div>
      <p className="eyebrow">LEXI</p>
      <h1>{mode==='signin'?'Welcome back':'Create your account'}</h1>
      <p className="auth-copy">Sign in so practice history and progress are safely saved to Lexi's database.</p>
      <form onSubmit={submit}>
        <label><span>Email</span><div className="auth-input"><Mail size={18}/><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} required/></div></label>
        <label><span>Password</span><div className="auth-input"><Lock size={18}/><input type="password" autoComplete={mode==='signin'?'current-password':'new-password'} minLength={6} value={password} onChange={e=>setPassword(e.target.value)} required/></div></label>
        {error&&<p className="auth-error">{error}</p>}
        {message&&<p className="auth-message">{message}</p>}
        <button className="primary" disabled={busy}>{busy?'Please wait…':mode==='signin'?'Sign in':'Create account'}</button>
      </form>
      <button className="auth-switch" onClick={()=>{setMode(mode==='signin'?'signup':'signin');setError('');setMessage('')}}>
        {mode==='signin'?'First time here? Create an account':'Already have an account? Sign in'}
      </button>
    </section>
  </main>
}
