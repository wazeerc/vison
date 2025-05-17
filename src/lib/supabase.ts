import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// --- Add this console.log line ---
console.log('Vite environment variables:', import.meta.env);
// ---------------------------------


// Check if environment variables are loaded
// This console log is what's triggering your error message
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key not found in environment variables.');

}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
