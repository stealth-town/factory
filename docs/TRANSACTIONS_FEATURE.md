# Transaction Verification System

## Overview

This document describes the transaction verification architecture for our Solana-based game. The system handles on-chain token transfers (SOL and $TOKEN) and ensures transactions are verified before updating game state.

## Transaction Types

Our game has 4 primary transaction flows:

1. **User → Vault (SOL)** - Shop purchases with native SOL
2. **User → Dead Address ($TOKEN)** - Burning tokens for gacha rolls
3. **Vault → User (SOL)** - Claiming daily generator rewards in native SOL
4. **Vault → User ($TOKEN)** - Issuing token rewards

### Token Type Considerations

**SOL (Native Token):**
- Transfers use Solana's **System Program**
- Direct wallet-to-wallet transfers (no token accounts needed)
- Simpler transaction structure
- Lower fees (no token account rent)
- Used for: shop purchases, generator rewards

**$TOKEN (SPL Token):**
- Transfers use **Token Program** (or Token-2022)
- Requires Associated Token Accounts (ATA)
- More complex instruction structure
- Used for: gacha burns, token rewards

This architecture simplifies verification for SOL transactions while maintaining full SPL token support for $TOKEN mechanics.

### Impact on Verification System

**Simplified aspects (SOL):**
- No need to verify token account ownership or initialization
- No token mint validation required for SOL transfers
- Simpler instruction parsing (System Program is straightforward)
- Lower risk of token account-related errors

**Unchanged complexity ($TOKEN):**
- Still need to verify ATAs for $TOKEN transfers
- Token Program instruction validation remains necessary
- Must validate token mint address matches expected $TOKEN
- Need to handle decimal conversions for token amounts

**The core verification flow remains identical** - the difference is only in what we validate within step 8 (on-chain verification). The overall architecture (construct → store → sign → verify → update) works the same for both token types.

## Core Verification Flow

### Step-by-Step Process

1. **User initiates action** via API call
   - Example: `POST /api/shop/purchase-item` with `{itemId: 123}`

2. **Backend validates request**
   - Check user has sufficient balance/tokens
   - Verify requirements are met (item exists, user eligible, etc.)
   - Return early with error if validation fails

3. **Backend constructs unsigned transaction**
   - Build Solana transaction with proper instructions
   - For vault→user flows: Backend pre-signs with vault authority
   - Calculate exact amounts, accounts, and instruction data

4. **Backend creates pending transaction record**
   ```sql
   INSERT INTO pending_transactions (
     user_id,
     transaction_type,
     status,
     transaction_data,
     expires_at
   )
   ```

5. **Backend returns unsigned transaction to user**
   ```json
   {
     "transactionId": "uuid",
     "unsignedTransaction": "base64..."
   }
   ```

6. **Frontend: User signs and submits to Solana**
   - Wallet prompts for signature
   - Frontend submits signed transaction to Solana network
   - Receives signature/txid back from Solana

7. **Frontend notifies backend with signature**
   - Call: `POST /api/transactions/{transactionId}/verify`
   - Body: `{signature: "abc123..."}`
   - **No polling needed** - user explicitly notifies backend

8. **Backend verifies transaction on-chain**
   - Fetch transaction from Solana via RPC using signature
   - Verify transaction status is "finalized"
   - Validate transaction structure matches expected:
     - **For SOL transfers**: System Program instruction, correct lamports amount
     - **For $TOKEN transfers**: Token Program instruction, correct token accounts and amounts
     - Correct accounts (user, vault, program IDs)
     - Correct instruction data
     - Matches the original unsigned transaction

9. **Backend updates database atomically**
   - Mark `pending_transactions.status = 'confirmed'`
   - Execute business logic (add item, update balance, etc.)
   - Store `expected_signature` for idempotency
   - All updates in single DB transaction (atomic)

10. **Backend returns success to frontend**
    - User sees confirmation UI

## How Backend Receives Transaction Status

**User-initiated notification** (recommended approach):

- Frontend explicitly calls `/api/transactions/{id}/verify` after submission
- Backend immediately fetches and validates transaction from Solana
- No expensive polling infrastructure needed
- Immediate feedback to user

**Edge cases:**
- Browser crash after submit: User can retry verification later with same signature
- Transaction failed on Solana: Backend detects failure and updates DB
- User abandons: Pending transaction expires after 5 minutes

## Gacha System Flow

Special handling for "burn token → reveal random item" mechanic.

### Pre-roll Approach

1. **User requests gacha roll**
   - `POST /api/gacha/purchase`

2. **Backend pre-rolls item result**
   - Generate cryptographically secure random item
   - Store in `pending_transactions.transaction_data`:
     ```json
     {
       "item_id": 42,
       "item_rarity": "rare",
       "cost_amount": 1000
     }
     ```
   - Construct burn transaction (send $TOKEN to dead address)
   - Return `{transactionId, unsignedTransaction}`

3. **Frontend shows "spinning" animation**
   - User sees loading/anticipation UI
   - Item result is hidden until verification

4. **User signs and submits transaction**

5. **Frontend calls verify endpoint**

6. **Backend verifies burn transaction**
   - Confirms tokens burned to dead address
   - Correct amount burned
   - Transaction finalized

7. **Backend adds pre-rolled item to inventory**
   - Insert into `generator_items` from stored `transaction_data`
   - Mark transaction confirmed

8. **Frontend reveals item with drop animation**
   - "You got a Rare Sword!"

### Why Pre-roll?

- **Deterministic**: Item locked in when transaction created
- **Idempotent**: Retry verification reveals same item
- **Atomic**: Roll and burn are inseparable
- **Fair**: Can't manipulate randomness after seeing transaction
- **UX**: Smooth reveal animation after confirmation

## Transaction Construction Details

### SOL Transfers (System Program)

**User → Vault (Shop Purchase):**
```typescript
// Simplified example
const transaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: userWallet,
    toPubkey: vaultWallet,
    lamports: amount, // SOL amount in lamports (1 SOL = 1e9 lamports)
  })
);
```

**Vault → User (Reward Claim):**
```typescript
// Backend pre-signs with vault authority
const transaction = new Transaction().add(
  SystemProgram.transfer({
    fromPubkey: vaultWallet,
    toPubkey: userWallet,
    lamports: rewardAmount,
  })
);
// Backend signs with vault private key
transaction.partialSign(vaultKeypair);
// Return to user for their signature (for fees)
```

**Verification:**
- Check instruction program ID is `11111111111111111111111111111111` (System Program)
- Verify instruction type is "Transfer"
- Validate `from`, `to`, and `lamports` values match expected

### $TOKEN Transfers (Token Program)

**User → Dead Address (Gacha Burn):**
```typescript
const transaction = new Transaction().add(
  createTransferInstruction(
    userTokenAccount,    // from ATA
    deadTokenAccount,    // to dead address ATA
    userWallet,          // owner
    burnAmount,          // token amount (with decimals)
    [],                  // no multisig
    TOKEN_PROGRAM_ID
  )
);
```

**Vault → User (Token Reward):**
```typescript
const transaction = new Transaction().add(
  createTransferInstruction(
    vaultTokenAccount,   // from vault ATA
    userTokenAccount,    // to user ATA
    vaultAuthority,      // vault authority
    rewardAmount,        // token amount
    [],
    TOKEN_PROGRAM_ID
  )
);
// Backend pre-signs with vault authority
transaction.partialSign(vaultAuthorityKeypair);
```

**Verification:**
- Check instruction program ID is Token Program ID
- Verify instruction type is "Transfer"
- Validate source/destination token accounts
- Verify amount and decimals
- Confirm token mint matches $TOKEN mint

### Key Differences

| Aspect | SOL Transfers | $TOKEN Transfers |
|--------|---------------|------------------|
| Program | System Program | Token Program |
| Accounts | 2 (from, to) | 3+ (from ATA, to ATA, authority) |
| Complexity | Simple | Moderate |
| Fees | ~0.000005 SOL | ~0.00001 SOL + ATA rent (if creating) |
| Verification | Straightforward | Token account validation required |

## Database Schema

### Required Table: `pending_transactions`

```sql
CREATE TABLE pending_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  transaction_type TEXT NOT NULL, -- 'purchase_item', 'gacha_roll', 'claim_rewards', etc.
  expected_signature TEXT, -- filled after verification for idempotency
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'failed', 'expired'

  transaction_data JSONB NOT NULL, -- stores context (item_id, amounts, etc.)
  unsigned_transaction TEXT NOT NULL, -- base64 encoded unsigned transaction

  expires_at TIMESTAMPTZ NOT NULL, -- typically NOW() + 5 minutes
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CHECK (status IN ('pending', 'confirmed', 'failed', 'expired'))
);

CREATE INDEX idx_pending_tx_user_id ON pending_transactions(user_id);
CREATE INDEX idx_pending_tx_status ON pending_transactions(status);
CREATE INDEX idx_pending_tx_signature ON pending_transactions(expected_signature);
CREATE INDEX idx_pending_tx_expires ON pending_transactions(expires_at);
```

### Cleanup Job

Run periodic job (every 5 minutes) to expire stale transactions:

```sql
UPDATE pending_transactions
SET status = 'expired'
WHERE status = 'pending'
  AND expires_at < NOW();
```

## Key Design Principles

### Security
- Always verify on-chain transaction structure
- Never trust user-provided amounts or data
- Validate transaction is finalized before updating state
- Check instruction data matches expected values

### Atomicity
- Use database transactions for state updates
- All-or-nothing: verify + update in single transaction
- Rollback if any step fails

### Idempotency
- Store `expected_signature` after first verification
- Return cached result if same signature submitted twice
- Prevents double-processing

### User Experience
- Immediate verification (no polling delays)
- Clear error messages for failures
- Smooth animations for gacha reveals
- Retry mechanisms for network issues

### Vault Transactions
For vault→user flows:
- Backend constructs transaction with vault as signer
- Backend pre-signs with vault private key
- User included as recipient
- May require user co-signature for rent/fees

### Transaction Expiration
- Pending transactions expire after 5 minutes
- Prevents replay attacks
- Cleanup job removes expired records
- User can create new transaction if expired

## API Endpoints

### Create Transaction
```
POST /api/{action}
Body: action-specific parameters
Response: {transactionId, unsignedTransaction}
```

### Verify Transaction
```
POST /api/transactions/{transactionId}/verify
Body: {signature: "string"}
Response: {success: true, data: {...}}
```

### Examples
- `POST /api/shop/purchase-item` - Buy item with SOL
- `POST /api/gacha/purchase` - Buy gacha roll with $TOKEN
- `POST /api/generator/claim-rewards` - Claim daily SOL rewards
- `POST /api/transactions/{id}/verify` - Verify any transaction

## Implementation Checklist

- [ ] Create `pending_transactions` table migration
- [ ] Implement transaction construction utilities
- [ ] Build verification service (fetch + validate from Solana)
- [ ] Create API endpoints for each transaction type
- [ ] Add `/transactions/{id}/verify` universal endpoint
- [ ] Implement cleanup job for expired transactions
- [ ] Add idempotency checks
- [ ] Build frontend transaction signing flow
- [ ] Create gacha reveal UI with animations
- [ ] Add error handling and retry logic
- [ ] Test transaction verification edge cases
