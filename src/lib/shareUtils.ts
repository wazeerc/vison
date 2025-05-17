import { supabase } from './supabase';

export const shareJson = async (data: any) => {
  const { data: supabaseData, error } = await supabase
    .from('shared_data')
    .insert([{
      data,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString()
    }])
    .select();

  if (error) throw error;
  return `${window.location.origin}/shared/${supabaseData[0].id}`;
};