import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://rbeouckkudskjqdkpqci.supabase.co'

const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiZW91Y2trdWRza2pxZGtwcWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE0NDczNzYsImV4cCI6MjA1NzAyMzM3Nn0.xXSKUtZYvA7eHPqdg6YkP9yKCosguQBThRiD7TJmJtQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
