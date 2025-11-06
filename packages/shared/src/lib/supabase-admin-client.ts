import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

/**
 * Backend Supabase admin client
 * Uses the service role key and should ONLY be used in server-side code
 * This client bypasses Row Level Security (RLS)
 */
export function createSupabaseAdminClient(url: string, serviceKey: string) {
  return createClient<Database>(url, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

