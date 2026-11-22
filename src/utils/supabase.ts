import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://axednjikcambzbkxyqpp.supabase.co';
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_Vysddy5_b0uZ3iKgnkDTIw_X5O1pBEd';

export const supabase = createClient(supabaseUrl, supabaseKey);
