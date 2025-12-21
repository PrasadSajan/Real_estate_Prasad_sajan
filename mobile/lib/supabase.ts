import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ncwaxgkjbhhhdcbvrmpp.supabase.co';
const supabaseKey = 'sb_publishable_2lxo5J2x0oTEDyEKHPAc7g_CRr2W-fM';

export const supabase = createClient(supabaseUrl, supabaseKey);
