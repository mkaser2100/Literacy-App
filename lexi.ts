export type Attempt={activityId:string;answer:string;correct:boolean;responseMs:number};
const KEY='lexi_phase1_attempts';
export function saveAttempt(a:Attempt){const all=JSON.parse(localStorage.getItem(KEY)||'[]');all.push({...a,at:new Date().toISOString()});localStorage.setItem(KEY,JSON.stringify(all));}
export function getAttempts():Attempt[]{return JSON.parse(localStorage.getItem(KEY)||'[]')}
export function clearAttempts(){localStorage.removeItem(KEY)}
// Phase 1 intentionally uses local persistence until Supabase Auth/RLS policies are approved.
