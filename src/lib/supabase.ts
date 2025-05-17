import { createClient } from '@supabase/supabase-js';


const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are loaded
// This console log is what's triggering your error message
// Replace existing check with:
if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(`
      Missing Supabase environment variables!
      Add these to your .env file:
      VITE_SUPABASE_URL=your-supabase-url
      VITE_SUPABASE_ANON_KEY=your-anon-key
    `);
  }

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');
