import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqqebpnaqntpkckxcmqe.supabase.co';
const supabaseAnonKey = 'sb_publishable_9fJhiFsCSMkMu-GiV5JNfw_G7E-x_4z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);