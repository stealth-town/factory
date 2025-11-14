# API Package

Backend API for the Solana-based game using Express + TypeScript.

## Architecture Overview

This API follows a clean **Route → Service** pattern for organizing code.

```
src/
├── config/           # Configuration with Zod validation
├── errors/           # Custom error classes
├── lib/              # Third-party library setup (Supabase)
├── logger/           # Winston logger configuration
├── middleware/       # Express middleware (auth, etc.)
├── routes/           # API route handlers
├── services/         # Business logic layer
└── index.ts          # Application entry point
```

## Code Structure Pattern

### 1. **Routes** (`src/routes/*.route.ts`)

Routes handle HTTP requests and responses. They:
- Define API endpoints
- Call service methods
- Handle errors
- Return responses

**Example:**

```typescript
import { Router } from 'express'
import * as generatorService from '../services/generator.service'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const data = await generatorService.getAllGenerators()
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Protected route example
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const data = await generatorService.updateGenerator(req.params.id, req.body)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
```

### 2. **Services** (`src/services/*.service.ts`)

Services contain business logic. They:
- Interact with the database (Supabase)
- Perform calculations and data transformations
- Enforce business rules
- Are independent of HTTP concerns

**Example:**

```typescript
export async function getAllGenerators() {
  // Database query logic
  const generators = await db.from('generators').select('*')
  return generators
}

export async function updateGenerator(id: string, updates: any) {
  // Business logic + database update
  const generator = await db
    .from('generators')
    .update(updates)
    .eq('id', id)
    .single()

  return generator
}
```

### 3. **Mounting Routes** (`src/index.ts`)

Routes are mounted in the main application file:

```typescript
import generatorRoutes from './routes/generator.route'

// Mount routes
app.use('/api/generators', generatorRoutes)
```

This creates the following endpoints:
- `GET /api/generators` → `generatorRoutes.get('/')`
- `GET /api/generators/:id` → `generatorRoutes.get('/:id')`
- `PATCH /api/generators/:id` → `generatorRoutes.patch('/:id')`

## Infrastructure

### Configuration (`src/config/index.ts`)

Environment variables are validated using Zod schemas on startup:

```typescript
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string().transform((val) => parseInt(val, 10)),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_KEY: z.string().min(1),
})
```

If validation fails, the app exits with a clear error message.

### Logger (`src/logger/Logger.ts`)

Winston logger with console and file transports:

```typescript
import logger from './logger/Logger'

logger.info('Server started')
logger.error('Error occurred', { error: err.message })
logger.debug('Debug info', { data })
```

- **Development**: Console only (colored, readable)
- **Production**: Console + file logs (`logs/error.log`, `logs/combined.log`)

### Error Handling (`src/errors/`)

Custom error classes for consistent error handling:

```typescript
import { BadRequestError, NotFoundError, UnauthorizedError } from '../errors'

// Throw in services
throw new NotFoundError('Generator not found')

// Caught by global error handler in index.ts
```

Available error classes:
- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `ConflictError` (409)
- `ValidationError` (422)
- `TooManyRequestsError` (429)
- `InternalServerError` (500)
- `ServiceUnavailableError` (503)

### Authentication (`src/middleware/auth.middleware.ts`)

Supabase-based authentication middleware:

```typescript
import { requireAuth } from '../middleware/auth.middleware'

// Protect routes
router.patch('/:id', requireAuth, async (req, res) => {
  // req.user is now available
  const userId = req.user.id
})
```

The middleware:
1. Extracts Bearer token from Authorization header
2. Verifies token with Supabase
3. Attaches user info to `req.user`

## Security

The API includes multiple security layers:

1. **Helmet** - Sets secure HTTP headers
2. **CORS** - Configurable cross-origin requests
3. **Rate Limiting** - 100 req/15min (prod), 1000 req/15min (dev)
4. **JSON Size Limit** - 10MB max payload
5. **Supabase Auth** - Token-based authentication

## Environment Variables

Copy `.env.template` to `.env` and configure:

```env
NODE_ENV=development
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SERVICE_KEY=your_service_key
PORT=3000
CORS_ORIGIN=*
```

## Available Scripts

```bash
# Development (with hot reload)
yarn dev

# Build
yarn build

# Production
yarn start

# Tests
yarn test
yarn test:watch
```

## Adding New Features

### 1. Create a Service

Create `src/services/factory.service.ts`:

```typescript
export async function getFactoryByUserId(userId: string) {
  // Your business logic here
  const factory = await db.from('factories').select('*').eq('user_id', userId).single()
  return factory
}

export async function createTrade(userId: string, tradeData: any) {
  // Trade creation logic
  const trade = await db.from('trades').insert(tradeData).single()
  return trade
}
```

### 2. Create Routes

Create `src/routes/factory.route.ts`:

```typescript
import { Router } from 'express'
import * as factoryService from '../services/factory.service'
import { requireAuth } from '../middleware/auth.middleware'

const router = Router()

router.get('/user/:userId', requireAuth, async (req, res) => {
  try {
    const factory = await factoryService.getFactoryByUserId(req.params.userId)
    res.json(factory)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

router.post('/trades', requireAuth, async (req, res) => {
  try {
    const trade = await factoryService.createTrade(req.user.id, req.body)
    res.json(trade)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
```

### 3. Mount Routes

Update `src/index.ts`:

```typescript
import factoryRoutes from './routes/factory.route'

// Mount routes
app.use('/api/factories', factoryRoutes)
```

## Current API Endpoints

### Health Check
- `GET /health` - Server health status

### Generators
- `GET /api/generators` - Get all generators
- `GET /api/generators/:id` - Get generator by ID
- `GET /api/generators/user/:userId` - Get generator by user ID (protected)
- `PATCH /api/generators/:id` - Update generator (protected)

## Next Steps

Add more routes following the same pattern:
- `/api/factories` - Factory and trading endpoints
- `/api/inventory` - Item inventory management
- `/api/trades` - Trade history and management
- `/api/users` - User profile and stats

## Supabase Integration

The API uses Supabase for:
1. **Authentication** - Handled by Supabase (wallet-based login in frontend)
2. **Database** - PostgreSQL with Row Level Security
3. **Realtime** - Will be used for autonomous runtimes

Authentication flow:
1. Frontend handles wallet signature → Supabase auth (done in frontend)
2. Supabase returns access token
3. Client sends token in Authorization header
4. API validates token with `requireAuth` middleware
5. Protected routes receive authenticated user info in `req.user`
