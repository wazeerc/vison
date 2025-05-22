// src/lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

// Use environment variables for Supabase credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_KEY || process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  if (typeof window !== 'undefined' && 'alert' in window) {
    window.alert('Supabase credentials are missing – please check .env');
  }
  throw new Error('Supabase credentials are missing.');
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
