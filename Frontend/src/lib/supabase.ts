import { createClient } from '@supabase/supabase-js'
import type { Database } from '@eventos-vero/shared'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || 'https://zetuihzjpnbfhvzclajx.supabase.co'
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_xopbldJcB-FPwrCcWgY6rA_8GTu_XV7'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
