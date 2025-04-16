import { createClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://vymbuulgynmxbsfkuvvy.supabase.co';
const supabaseAnonKey: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5bWJ1dWxneW5teGJzZmt1dnZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQyOTE2NDgsImV4cCI6MjA1OTg2NzY0OH0.XEExmAjoZI33GtZ9gF84yLCTCKBqXI-nTNCmu8aHjtQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
