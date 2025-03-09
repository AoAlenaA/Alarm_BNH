import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://rbeouckkudskjqdkpqci.supabase.co'
const SUPABASE_KEY = 'SUPABASE_CLIENT_API_KEY'

const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseKey) {
  throw new Error('SUPABASE_KEY environment variable not set!'); 
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

