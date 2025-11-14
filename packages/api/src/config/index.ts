import dotenv from 'dotenv'
import { z } from 'zod'

// Load environment variables
dotenv.config()

/**
 * Environment variable schema with validation
 */
const envSchema = z.object({
	/** Environment */
	NODE_ENV: z
		.enum(['development', 'production', 'test'])
		.default('development'),

	/** Server */
	PORT: z
		.string()
		.default('3000')
		.transform((val) => parseInt(val, 10))
		.pipe(z.number().positive()),

	CORS_ORIGIN: z.string().default('*'),

	/** Supabase */
	SUPABASE_URL: z.string().url('Invalid Supabase URL'),
	SUPABASE_SERVICE_KEY: z.string().min(1, 'Supabase service key is required'),

	/** Solana */
	SOLANA_RPC_URL: z.string().url('Invalid Solana RPC URL'),
	TOKEN_MINT_ADDRESS: z.string().min(32, 'Token mint address is required'),
	DEAD_ADDRESS: z.string().min(32, 'Dead address is required'),
	VAULT_KEYPAIR_PATH: z.string().min(1, 'Vault keypair path is required'),
})

/**
 * Validate and parse environment variables
 */
const validateEnv = () => {
	try {
		const parsed = envSchema.parse(process.env)
		return parsed
	} catch (error) {
		if (error instanceof z.ZodError) {
			const missingVars = error.issues.map((err: z.ZodIssue) => {
				return `${err.path.join('.')}: ${err.message}`
			})

			console.error('Invalid environment variables:')
			missingVars.forEach((msg: string) => console.error(`  - ${msg}`))
			console.error('\nPlease check your .env file')

			process.exit(1)
		}
		throw error
	}
}

// Validate on module load
const env = validateEnv()

/**
 * Typed configuration object
 */
export const config = {
	/** Environment */
	nodeEnv: env.NODE_ENV,

	/** Server */
	port: env.PORT,
	corsOrigin: env.CORS_ORIGIN,

	/** Supabase */
	supabase: {
		url: env.SUPABASE_URL,
		serviceKey: env.SUPABASE_SERVICE_KEY,
	},

	/** Solana */
	solana: {
		rpcUrl: env.SOLANA_RPC_URL,
		tokenMintAddress: env.TOKEN_MINT_ADDRESS,
		deadAddress: env.DEAD_ADDRESS,
		vaultKeypairPath: env.VAULT_KEYPAIR_PATH,
	},

	/** Helpers */
	isDevelopment: env.NODE_ENV === 'development',
	isProduction: env.NODE_ENV === 'production',
	isTest: env.NODE_ENV === 'test',
} as const

export default config

