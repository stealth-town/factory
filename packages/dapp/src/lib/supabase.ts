import { createSupabaseClient } from '@launch-solana/shared'

/**
 * Frontend Supabase client
 * Uses the anon key - respects RLS policies
 */
export const supabase = createSupabaseClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

