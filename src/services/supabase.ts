import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL='https://squcmdsivnnxzblsfciu.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_pumFxQJ7pYyRC8lrjSvtZA_x63TVYtq';

export const supabase=createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{
  auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
});
