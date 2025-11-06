import { createSupabaseAdminClient } from '@launch-solana/shared'
import config from '../config'

/**
 * Backend Supabase admin client
 * Uses service role key - bypasses RLS
 * Should ONLY be used in server-side code
 */
export const supabaseAdmin = createSupabaseAdminClient(
  config.supabase.url,
  config.supabase.serviceKey
)

