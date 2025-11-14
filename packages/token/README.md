# Token Package

**Token-2022 utilities for local development**. This package allows you to easily create and mint Token-2022 tokens with **transfer tax** on your local Solana validator for testing.

## Features

- ✅ **Token-2022 (Token Extensions Program)** support
- ✅ **Transfer tax** enabled (1% by default)
- ✅ **Minting capability** for testing rewards
- ✅ Local validator integration
- ✅ Automatic token account creation

## Prerequisites

1. **Local Solana Validator Running**
   ```bash
   # Start local validator (from another terminal)
   solana-test-validator
   ```

2. **Install Dependencies**
   ```bash
   yarn install
   ```

## Quick Start

### 1. Create a Token-2022 Token

```bash
yarn create-token
```

This will:
- Generate a mint authority keypair (saved to `keypairs/mint-authority.json`)
- Request SOL airdrop if needed
- Create a new **Token-2022** token with:
  - **9 decimals** (standard for Solana tokens)
  - **1% transfer tax** (configurable in code)
  - **Minting enabled** for reward distribution
- Display the token mint address

**Output Example:**
```
✅ Token created successfully!

📋 Token Details:
   Mint Address: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
   Mint Authority: 4kx...abc
   Program: Token-2022 (Token Extensions)
   Decimals: 9
   Transfer Tax: 1%

📝 Next steps:
   1. Add this to your .env file:
      TOKEN_MINT_ADDRESS=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### 2. Update .env File

Copy the mint address from the output and add it to `.env`:

```env
TOKEN_MINT_ADDRESS=7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
```

### 3. Mint Tokens to an Address

```bash
yarn mint-tokens <recipient-address> <amount>
```

**Example:**
```bash
# Mint 1000 tokens to a wallet
yarn mint-tokens HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH 1000
```

This will:
- Create an associated token account for the recipient if it doesn't exist
- Mint the specified amount of tokens
- Display transaction details

### 4. Check Token Balance

```bash
yarn get-balance <wallet-address>
```

**Example:**
```bash
yarn get-balance HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH
```

## Directory Structure

```
packages/token/
├── src/
│   ├── scripts/          # Executable scripts
│   │   ├── create-token.ts    # Create new SPL token
│   │   ├── mint-tokens.ts     # Mint tokens to address
│   │   └── get-balance.ts     # Check token balance
│   └── utils/            # Utility functions
│       ├── keypair.ts         # Keypair management
│       ├── connection.ts      # Solana connection
│       └── config.ts          # Configuration
├── keypairs/             # Generated keypairs (gitignored!)
│   └── mint-authority.json
├── .env                  # Environment configuration
└── package.json
```

## Configuration

Edit `.env` to configure:

```env
# Solana RPC endpoint
RPC_URL=http://127.0.0.1:8899

# Token mint address (set after creating token)
TOKEN_MINT_ADDRESS=

# Mint authority keypair path
MINT_AUTHORITY_KEYPAIR_PATH=./keypairs/mint-authority.json
```

### Network Options

**Local Validator (Default):**
```env
RPC_URL=http://127.0.0.1:8899
```

**Devnet:**
```env
RPC_URL=https://api.devnet.solana.com
```

**Testnet:**
```env
RPC_URL=https://api.testnet.solana.com
```

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| Create Token | `yarn create-token` | Create a new Token-2022 token with transfer tax |
| Mint Tokens | `yarn mint-tokens <address> <amount>` | Mint Token-2022 tokens to an address |
| Get Balance | `yarn get-balance <address>` | Check Token-2022 token balance |
| Build | `yarn build` | Compile TypeScript |

## Security

⚠️ **IMPORTANT:** Keypairs are stored in `keypairs/` and are automatically gitignored.

- **Never commit keypairs to version control**
- **Never use these keypairs in production**
- This setup is for **local development only**

The `.gitignore` file ensures that all `.json` files in `keypairs/` are excluded from git.

## Common Use Cases

### Testing Game Mechanics

```bash
# 1. Create your game token
yarn create-token

# 2. Mint tokens to test wallets
yarn mint-tokens <player-wallet-1> 10000
yarn mint-tokens <player-wallet-2> 5000

# 3. Check balances
yarn get-balance <player-wallet-1>
```

### Simulating Token Burns (for Gacha System)

After minting tokens, you can burn them to a dead address for the gacha mechanic:

```typescript
import { transfer, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

// Burn tokens by transferring to dead address (in your game logic)
const DEAD_ADDRESS = new PublicKey('1nc1nerator11111111111111111111111111111111')

await transfer(
  connection,
  payer,
  userTokenAccount,
  deadTokenAccount,
  owner,
  amount,
  [],
  { commitment: 'confirmed' },
  TOKEN_2022_PROGRAM_ID
)
```

**Note:** Token-2022 with transfer tax will deduct 1% during the burn transfer.

### Integration with Game API

Use the Token-2022 mint address in your API:

```typescript
// In your game API
import { TOKEN_2022_PROGRAM_ID } from '@solana/spl-token'

const GAME_TOKEN_MINT = process.env.GAME_TOKEN_MINT_ADDRESS

// Verify token transactions (always specify TOKEN_2022_PROGRAM_ID)
// Implement gacha mechanics with burn verification
// Track token burns and transfer tax
```

**Important:** Always use `TOKEN_2022_PROGRAM_ID` when interacting with your token programmatically.

## Troubleshooting

### "Connection refused" or "Failed to connect"

Make sure your local validator is running:
```bash
solana-test-validator
```

### "Insufficient funds" or "Account not found"

The script will automatically request airdrops when needed. If this fails:
```bash
# Manual airdrop
solana airdrop 2 <your-address> --url localhost
```

### "Token account does not exist"

This is normal for addresses that haven't received tokens yet. The `mint-tokens` script will automatically create the token account.

### Starting Fresh

To create a new token:
1. Delete `keypairs/mint-authority.json`
2. Remove `TOKEN_MINT_ADDRESS` from `.env`
3. Run `yarn create-token` again

## Integration Examples

### With Anchor Programs

```rust
// In your Anchor program
use anchor_spl::token::{self, Burn, Mint, Token};

pub fn burn_for_item(ctx: Context<BurnForItem>, amount: u64) -> Result<()> {
    token::burn(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            Burn {
                mint: ctx.accounts.game_token_mint.to_account_info(),
                from: ctx.accounts.user_token_account.to_account_info(),
                authority: ctx.accounts.user.to_account_info(),
            },
        ),
        amount,
    )?;
    // Gacha logic here
    Ok(())
}
```

### With Frontend (React)

```typescript
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { burn } from '@solana/spl-token'

function BurnTokensButton() {
  const { connection } = useConnection()
  const wallet = useWallet()

  const handleBurn = async () => {
    const signature = await burn(
      connection,
      wallet, // Payer
      userTokenAccount,
      gameTokenMint,
      wallet.publicKey,
      1000 * Math.pow(10, 9) // 1000 tokens with 9 decimals
    )
    console.log('Burned!', signature)
  }

  return <button onClick={handleBurn}>Burn Tokens</button>
}
```

## Transfer Tax Configuration

The default transfer tax is **1%** (100 basis points). To change this, edit `src/scripts/create-token.ts`:

```typescript
const transferFeeBasisPoints = 100 // 1% = 100 basis points
const maxFee = BigInt(1_000_000_000) // Max 1 token per transfer

// Examples:
// 0.5% = 50 basis points
// 2% = 200 basis points
// 5% = 500 basis points
```

## Important Notes

⚠️ **Token-2022 Requirements:**
- Always use `TOKEN_2022_PROGRAM_ID` when interacting with the token
- Transfer tax is automatically deducted on all transfers (including burns)
- Associated Token Accounts must be created with Token-2022 program
- Standard SPL Token tools won't work with this token

⚠️ **Security:**
- Keypairs are stored in `keypairs/` and are automatically gitignored
- Never commit keypairs to version control
- Never use these keypairs in production
- This setup is for local development only

## Next Steps

1. ✅ Create Token-2022 token locally
2. ✅ Mint tokens for testing
3. Configure dead address for burn mechanism
4. Integrate with your backend API
5. Implement token burn verification
6. Test gacha mechanics with transfer tax
7. Deploy to devnet for team testing

## Resources

- [Token-2022 Documentation](https://spl.solana.com/token-2022)
- [Token Extensions Guide](https://spl.solana.com/token-2022/extensions)
- [Transfer Fee Extension](https://spl.solana.com/token-2022/extensions#transfer-fee)
- [Solana Cookbook - Tokens](https://solanacookbook.com/references/token.html)
