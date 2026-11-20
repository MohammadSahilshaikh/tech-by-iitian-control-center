import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kupcvxpbfclpysnvpycc.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1cGN2eHBiZmNscHlzbnZweWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNjI3NDgsImV4cCI6MjEwMzczODc0OH0.sGBNU2XfI9gjl7NVkYMkirYaKpAoluIb0zSEULqY7Zg';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
