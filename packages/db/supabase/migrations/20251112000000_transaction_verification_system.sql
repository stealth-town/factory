-- # BEGIN MIGRATION ######################################################
--
-- @file - 20251112000000_transaction_verification_system.sql
-- @dev - madjarx - Nov. 12th, 2025
--
-- This migration implements the transaction verification system for the game.
-- It handles on-chain token transfers (SOL and $TOKEN) with a secure
-- verification flow that ensures transactions are confirmed before updating game state.
--
-- Core Flow:
-- 1. Backend constructs unsigned transaction and stores in pending_transactions
-- 2. User signs and submits transaction to Solana network
-- 3. User notifies backend with transaction signature
-- 4. Backend verifies transaction on-chain and updates game state
--
-- !IMPORTANT - This system supports 4 transaction types:
-- !IMPORTANT - 1. User → Vault (SOL) - Shop purchases
-- !IMPORTANT - 2. User → Dead Address ($TOKEN) - Gacha token burns
-- !IMPORTANT - 3. Vault → User (SOL) - Generator reward claims
-- !IMPORTANT - 4. Vault → User ($TOKEN) - Token rewards
--
-- !IMPORTANT - Row-level security is enabled for frontend user access
-- !IMPORTANT - Backend bypasses RLS using service role key (automatic)
--
-- Tables:
-- - pending_transactions (main transaction records)
--
-- Functions:
-- - update_updated_at_column() - Auto-update updated_at timestamp
-- - expire_old_transactions() - Mark expired pending transactions
--
-- Indexes:
-- - Optimized for lookups by user, status, signature, expiration
--
-- RLS Policies:
-- - Users can manage their own pending transactions
-- - Backend service role bypasses RLS automatically
--




-- ####################
-- # TABLES #
-- ####################

-- PENDING_TRANSACTIONS table
--
-- Stores transaction records during the verification flow.
-- Each record represents a transaction that has been constructed by the backend
-- and is waiting for user signature + on-chain confirmation.
--
CREATE TABLE pending_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    -- Transaction metadata
    transaction_type TEXT NOT NULL, -- 'purchase_item', 'gacha_roll', 'claim_rewards', 'token_reward', etc.
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'failed', 'expired'

    -- Transaction signatures and data
    expected_signature TEXT, -- Solana transaction signature (filled after verification for idempotency)
    unsigned_transaction TEXT NOT NULL, -- Base64 encoded unsigned transaction bytes
    transaction_data JSONB NOT NULL, -- Context data (item_id, amounts, pre-rolled results, etc.)

    -- Transaction amounts (explicit tracking for easy aggregation)
    sol_amount BIGINT, -- SOL amount in lamports (1 SOL = 1,000,000,000 lamports). NULL if not a SOL transaction
    token_amount BIGINT, -- $TOKEN amount (with decimals included). NULL if not a token transaction

    -- Timestamps
    expires_at TIMESTAMPTZ NOT NULL, -- Typically NOW() + 5 minutes
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_status CHECK (status IN ('pending', 'confirmed', 'failed', 'expired')),
    CONSTRAINT check_transaction_type CHECK (
        transaction_type IN (
            'purchase_item',
            'purchase_balance',
            'gacha_roll',
            'claim_rewards',
            'token_reward',
            'admin_action'
        )
    ),
    -- At least one amount must be present
    CONSTRAINT check_has_amount CHECK (sol_amount IS NOT NULL OR token_amount IS NOT NULL)
);




-- ####################
-- # INDEXES #
-- ####################

-- Fast lookup by user (for listing user's pending transactions)
CREATE INDEX idx_pending_tx_user_id ON pending_transactions(user_id);

-- Fast lookup by status (for cleanup jobs and status-based queries)
CREATE INDEX idx_pending_tx_status ON pending_transactions(status);

-- Fast lookup by signature (for idempotency checks during verification)
CREATE INDEX idx_pending_tx_signature ON pending_transactions(expected_signature)
WHERE expected_signature IS NOT NULL;

-- Fast lookup for expiration cleanup job
CREATE INDEX idx_pending_tx_expires ON pending_transactions(expires_at)
WHERE status = 'pending';

-- Composite index for user + status queries (common pattern)
CREATE INDEX idx_pending_tx_user_status ON pending_transactions(user_id, status);




-- ####################
-- # FUNCTIONS #
-- ####################

-- Function: Auto-update updated_at timestamp
--
-- Automatically updates the updated_at column whenever a row is modified
-- This is a common pattern used across the database
--
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_pending_tx_updated_at
BEFORE UPDATE ON pending_transactions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();


-- Function: Expire old transactions
--
-- Marks pending transactions as 'expired' if they have passed their expiration time.
-- This function should be called periodically (e.g., every 5 minutes) by a cron job.
--
-- Returns the number of transactions that were expired.
--
CREATE OR REPLACE FUNCTION expire_old_transactions()
RETURNS INTEGER AS $$
DECLARE
    expired_count INTEGER;
BEGIN
    UPDATE pending_transactions
    SET status = 'expired'
    WHERE status = 'pending'
    AND expires_at < NOW();

    GET DIAGNOSTICS expired_count = ROW_COUNT;
    RETURN expired_count;
END;
$$ LANGUAGE plpgsql;


-- Function: Clean up old completed/expired transactions
--
-- Permanently deletes transaction records older than X days (default 30).
-- Only removes confirmed, failed, or expired transactions (keeps pending for safety).
-- This function should be called periodically to prevent table bloat.
--
-- Returns the number of records deleted.
--
CREATE OR REPLACE FUNCTION cleanup_old_transactions(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM pending_transactions
    WHERE status IN ('confirmed', 'failed', 'expired')
    AND created_at < NOW() - (days_old || ' days')::INTERVAL;

    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;




-- ####################
-- # RLS & POLICIES #
-- ####################

-- Enable Row Level Security
ALTER TABLE pending_transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own pending transactions
CREATE POLICY "Users can view own transactions" ON pending_transactions
FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can insert their own pending transactions
-- (typically done by backend, but allowing user-initiated for flexibility)
CREATE POLICY "Users can create own transactions" ON pending_transactions
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own pending transactions
-- (backend typically updates status, but users might need to update in some flows)
CREATE POLICY "Users can update own transactions" ON pending_transactions
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own expired transactions
CREATE POLICY "Users can delete own expired transactions" ON pending_transactions
FOR DELETE
USING (auth.uid() = user_id AND status = 'expired');


-- NOTE: Backend service role key automatically bypasses all RLS policies
-- No special handling needed for backend operations



-- ####################
-- # COMMENTS #
-- ####################

-- Add table and column comments for documentation
COMMENT ON TABLE pending_transactions IS 'Stores transaction records during the verification flow. Each record represents a transaction constructed by the backend awaiting user signature and on-chain confirmation.';

COMMENT ON COLUMN pending_transactions.transaction_type IS 'Type of transaction: purchase_item, gacha_roll, claim_rewards, token_reward, etc.';
COMMENT ON COLUMN pending_transactions.status IS 'Transaction status: pending (awaiting confirmation), confirmed (verified on-chain), failed (transaction failed), expired (timeout)';
COMMENT ON COLUMN pending_transactions.expected_signature IS 'Solana transaction signature after verification. Used for idempotency checks.';
COMMENT ON COLUMN pending_transactions.unsigned_transaction IS 'Base64 encoded unsigned transaction bytes returned to user for signing.';
COMMENT ON COLUMN pending_transactions.transaction_data IS 'JSONB context data: item_id, amounts, pre-rolled gacha results, etc. Structure varies by transaction_type.';
COMMENT ON COLUMN pending_transactions.expires_at IS 'Expiration timestamp (typically 5 minutes after creation). Expired pending transactions are marked as expired by cleanup job.';

-- # END MIGRATION ########################################################
