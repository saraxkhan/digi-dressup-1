import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Public anon keys — safe to expose in frontend code
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://xbzgbhexsflnuumtvmie.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhiemdiaGV4c2ZsbnV1bXR2bWllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU2NDcxMzcsImV4cCI6MjA5MTIyMzEzN30.JOHCtMz6Mvop-vzMz6AGmcJEYqhLr5AAXXYD4QI_KhU";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    persistSession: true,
    autoRefreshToken: true,
  }
});
