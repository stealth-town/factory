# Transaction System Implementation Tasks

## Overview

Implement the transaction verification system starting with the gacha endpoint. Users burn $TOKEN to a dead address and receive a random item in their inventory. The system follows the pattern: construct transaction → store pending record → user signs → verify on-chain → update game state.

## Task List

### Phase 1: Local Token Environment
- [x] Set up local Solana validator in `packages/token`
- [x] Create and configure $TOKEN (Token-2022)
- [ ] Document token mint address and dead address in config
- [ ] Fund test wallets with SOL and $TOKEN

### Phase 2: Database Setup
- [ ] Run pending_transactions migration (already exists)
- [ ] Create items table (item definitions with rarity)
- [ ] Create generator_items table (user inventory)
- [ ] Add test item data

### Phase 3: Backend - Core Services
- [ ] Create Vault service
  - Load and manage vault wallet keypair
  - Provide signing methods for vault transactions
  - Handle SOL and $TOKEN balance checks
  - Centralize all money-related operations
- [ ] Create transaction construction utility
  - Build unsigned burn transaction (user → dead address)
  - Serialize to base64
- [ ] Create transaction verification service
  - Fetch transaction from Solana RPC
  - Validate burn instruction (program, accounts, amount)
  - Check finalized status
- [ ] Create pending transaction database service
  - Insert/update/query pending_transactions
  - Handle expiration logic

### Phase 4: Backend - Gacha Endpoint
- [ ] POST `/api/gacha/purchase` endpoint
  - Validate user has sufficient $TOKEN
  - Pre-roll random item (cryptographically secure)
  - Construct burn transaction
  - Store in pending_transactions with pre-rolled data
  - Return `{transactionId, unsignedTransaction}`
- [ ] POST `/api/transactions/:id/verify` endpoint
  - Fetch transaction by ID
  - Verify on-chain with signature
  - Add pre-rolled item to generator_items
  - Mark transaction confirmed
  - Return item details

### Phase 5: Frontend - Gacha Component
- [ ] Create gacha purchase button/UI
  - Call `/api/gacha/purchase`
  - Deserialize unsigned transaction
  - Prompt wallet signature
  - Submit to Solana network
- [ ] Create verification flow
  - Get signature from Solana
  - Call `/api/transactions/:id/verify` with signature
  - Handle success/failure
- [ ] Create reveal animation
  - Show loading state during verification
  - Animate item reveal on success
  - Display item with rarity

### Phase 6: Testing & Validation
- [ ] Test full flow end-to-end
- [ ] Test error cases (insufficient funds, network failure)
- [ ] Test idempotency (retry with same signature)
- [ ] Verify burn actually happened on-chain

## Component Overview

### Backend Services

**Vault** - Centralizes all money-related operations; manages vault wallet keypair, signs vault transactions, handles SOL/$TOKEN balance checks

**TransactionConstructor** - Builds unsigned Solana transactions (burn instruction with user ATA → dead address ATA)

**TransactionVerifier** - Fetches transaction from RPC, validates instruction structure, checks finalization status

**PendingTransactionService** - CRUD operations for pending_transactions table

**GachaService** - Random item generation with cryptographic security, rarity calculations; delegates money operations to Vault

### Backend Routes

**POST /api/gacha/purchase** - Pre-rolls item, constructs burn transaction, returns unsigned transaction + ID

**POST /api/transactions/:id/verify** - Verifies on-chain burn, adds item to inventory, marks confirmed

### Frontend Components

**GachaButton** - Triggers purchase flow, handles wallet signing

**GachaVerification** - Submits signature to backend, polls for confirmation

**GachaReveal** - Animates item reveal with rarity indicator

### Database Tables

**pending_transactions** - Stores transaction metadata during verification flow

**items** - Item definitions (name, rarity, attributes)

**generator_items** - User inventory (links user → item)

### Configuration

**Vault keypair** - Vault wallet private key for signing transactions (secure storage)

**Token addresses** - $TOKEN mint address, dead address (packages/token)

**RPC endpoint** - Solana RPC URL for transaction verification (localnet initially)
