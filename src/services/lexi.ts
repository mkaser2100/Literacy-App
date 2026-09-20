import type { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

export type Attempt = {
  sessionId:string; activityId:string; activityType:string; skillId:string; contentId:string;
  presentedAt:string; answeredAt:string; response:string; correctAnswer:string; isCorrect:boolean;
  responseTimeMs:number; hintUsed:boolean; attemptNumber:number; difficulty:number;
};

export type Session = {
  id:string; startedAt:string; completedAt?:string; durationMs?:number; itemCount?:number;
  correctCount?:number; accuracy?:number; stars?:number; xp?:number;
};

export type LessonSummary={durationMs:number;accuracy:number;stars:number;xp:number};

export type ProgressSyncRow={
  skillId:string; currentLevel:number; score:number; accuracy:number; independentRate:number;
  retentionRate:number; attempts:number; status:string; lastPracticedAt:string;
};

const LEGACY_ATTEMPTS_KEY='lexi_phase2_attempts';
const LEGACY_SESSIONS_KEY='lexi_phase2_sessions';

let attemptsCache:Attempt[]=[];
let sessionsCache:Session[]=[];
let lastSummary:LessonSummary|null=null;
const startWrites=new Map<string,Promise<void>>();

const rpcError=(label:string,error:{message:string}|null)=>{
  if(error) throw new Error(`${label}: ${error.message}`);
};

export async function getAuthUser():Promise<User|null>{
  const {data,error}=await supabase.auth.getUser();
  if(error && error.message!=='Auth session missing!') throw error;
  return data.user??null;
}

export async function signIn(email:string,password:string){
  const {error}=await supabase.auth.signInWithPassword({email,password});
  if(error) throw error;
}

export async function signUp(email:string,password:string){
  const {data,error}=await supabase.auth.signUp({email,password});
  if(error) throw error;
  return {needsEmailConfirmation:!data.session};
}

export async function signOut(){await supabase.auth.signOut();attemptsCache=[];sessionsCache=[];}

export function onAuthChange(callback:(signedIn:boolean)=>void){
  const {data}=supabase.auth.onAuthStateChange((_event,session)=>callback(!!session?.user));
  return ()=>data.subscription.unsubscribe();
}

async function loadHistory(){
  const {data,error}=await supabase.rpc('lexi_get_history');
  rpcError('Load Lexi history',error);
  const history=(data||{}) as {sessions?:Session[];attempts?:Attempt[]};
  sessionsCache=[...(history.sessions||[])].sort((a,b)=>b.startedAt.localeCompare(a.startedAt));
  attemptsCache=[...(history.attempts||[])];
}

async function migrateLegacyBrowserHistory(){
  const rawSessions=localStorage.getItem(LEGACY_SESSIONS_KEY);
  const rawAttempts=localStorage.getItem(LEGACY_ATTEMPTS_KEY);
  if(!rawSessions && !rawAttempts) return;

  let sessions:Session[]=[]; let attempts:Attempt[]=[];
  try{
    sessions=JSON.parse(rawSessions||'[]');
    attempts=JSON.parse(rawAttempts||'[]');
  }catch{
    throw new Error('Legacy Lexi history exists but could not be read safely.');
  }
  if(!sessions.length && !attempts.length){
    localStorage.removeItem(LEGACY_SESSIONS_KEY);
    localStorage.removeItem(LEGACY_ATTEMPTS_KEY);
    return;
  }

  const {error}=await supabase.rpc('lexi_import_legacy',{p_sessions:sessions,p_attempts:attempts});
  rpcError('Import existing Lexi history',error);
  localStorage.removeItem(LEGACY_SESSIONS_KEY);
  localStorage.removeItem(LEGACY_ATTEMPTS_KEY);
}

export async function initializeLexi(){
  const user=await getAuthUser();
  if(!user) return false;
  const {error}=await supabase.rpc('lexi_bootstrap',{p_display_name:'Lexi'});
  rpcError('Initialize learner profile',error);
  await migrateLegacyBrowserHistory();
  await loadHistory();
  return true;
}

export function startSession():Session{
  const session:Session={id:crypto.randomUUID(),startedAt:new Date().toISOString()};
  sessionsCache=[session,...sessionsCache];
  const write=(async()=>{
    const {error}=await supabase.rpc('lexi_start_session',{p_session_id:session.id,p_started_at:session.startedAt});
    rpcError('Start lesson session',error);
  })();
  startWrites.set(session.id,write);
  write.finally(()=>startWrites.delete(session.id));
  return session;
}

export async function saveAttempt(attempt:Attempt){
  const pending=startWrites.get(attempt.sessionId);
  if(pending) await pending;
  const {error}=await supabase.rpc('lexi_save_attempt',{
    p_session_id:attempt.sessionId,p_activity_id:attempt.activityId,p_activity_type:attempt.activityType,
    p_skill_code:attempt.skillId,p_content_id:attempt.contentId,p_presented_at:attempt.presentedAt,
    p_answered_at:attempt.answeredAt,p_response:attempt.response,p_correct_answer:attempt.correctAnswer,
    p_is_correct:attempt.isCorrect,p_response_ms:attempt.responseTimeMs,p_hint_used:attempt.hintUsed,
    p_attempt_number:attempt.attemptNumber,p_difficulty:attempt.difficulty
  });
  rpcError('Save lesson attempt',error);
  attemptsCache=[...attemptsCache,attempt];
}

export async function syncSkillProgress(rows:ProgressSyncRow[]){
  if(!rows.length)return;
  const {error}=await supabase.rpc('lexi_sync_skill_progress',{p_rows:rows});
  rpcError('Sync adaptive skill progress',error);
}

export async function finishSession(id:string,summary:Omit<Session,'id'|'startedAt'>){
  const pending=startWrites.get(id);
  if(pending) await pending;
  const {error}=await supabase.rpc('lexi_finish_session',{
    p_session_id:id,p_completed_at:summary.completedAt,p_duration_ms:summary.durationMs||0,
    p_item_count:summary.itemCount||0,p_correct_count:summary.correctCount||0,
    p_stars:summary.stars||0,p_xp:summary.xp||0
  });
  rpcError('Finish lesson session',error);
  sessionsCache=sessionsCache.map(s=>s.id===id?{...s,...summary}:s);
  lastSummary={
    durationMs:summary.durationMs||0,accuracy:summary.accuracy||0,
    stars:summary.stars||0,xp:summary.xp||0
  };
}

export const getAttempts=()=>attemptsCache;
export const getSessions=()=>[...sessionsCache].sort((a,b)=>b.startedAt.localeCompare(a.startedAt));
export const getSessionAttempts=(id:string)=>attemptsCache.filter(a=>a.sessionId===id);
export const getLastSummary=()=>lastSummary;

export function speak(text:string){
  if(!('speechSynthesis' in window))return;
  speechSynthesis.cancel();
  const u=new SpeechSynthesisUtterance(text);u.rate=.78;speechSynthesis.speak(u);
}
