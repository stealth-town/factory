import dotenv from 'dotenv'

dotenv.config()

export const config = {
  /** Environment */
  nodeEnv: process.env.NODE_ENV || 'development',

  /** Server */
  port: process.env.PORT || 3000,
  corsOrigin: process.env.CORS_ORIGIN || '*',

  /** Supabase */
  supabase: {
    url: process.env.SUPABASE_URL || '',
    serviceKey: process.env.SUPABASE_SERVICE_KEY || '',
  },
}

export default config

