import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

/**
 * Frontend Supabase client
 * Uses the anon key and should be used in browser/client-side code
 */
export function createSupabaseClient(url: string, anonKey: string) {
  return createClient<Database>(url, anonKey)
}

