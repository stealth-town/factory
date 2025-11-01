-- # BEGIN MIGRATION ######################################################
--
-- @file - 20251029154217_base_entities.sql
-- @dev - madjarx - Nov. 1st, 2025
-- 
-- This file contains the user-related database configurations, 
-- or core entities so to speak
--
-- As the user is our main entity in the system, we aim to create everything
-- related to the user in this file. This includes:
-- - user & balances (and everything related to them)
-- - user's game entities (generator & factory) - a.k.a. "char" and "town" loops
--
-- some stuff is redundant but its our foolproof approach to avoid easier scaling later
--
-- Tables:
-- - users
-- - user_balances_logs
-- - factory (town)
-- - generator (character)
--
-- Functions:
-- - create_user
--



-- ####################
-- # TABLES #
-- ####################


-- USERS table
--
-- We do need a unique ID other than the wallet address
--
CREATE TABLE users (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    wallet_address TEXT NOT NULL UNIQUE, -- wallet is another type of id, but we need regular ID
    wallet_chain TEXT DEFAULT NULL, -- chain of the wallet - keep empty for now
    
    nickname TEXT DEFAULT NULL,
    balance BIGINT NOT NULL DEFAULT 0, -- cannot be decimal, defaults to 0

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- BALANCES logs table
--
-- this table captures all the buys and sells in our app (related to balance purchases)
-- The idea is to capture the 
--
CREATE TABLE user_balances_logs (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    transaction_direction TEXT NOT NULL DEFAULT 'balance_purchase' CHECK (transaction_direction IN ('balance_purchase', 'balance_spend', 'balance_refund', 'admin_action')),
    transaction_amount BIGINT NOT NULL DEFAULT 0 CHECK (transaction_amount > 0), -- represents the amount of balance units spent/purchased/refunded, cannot be 0
    transaction_hash TEXT DEFAULT NULL, -- hash of the transaction (if applicable, if balance is bought using $USDC)

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- GENERATOR table -- a.k.a. "character"
--
-- This table represents the upgradable loop that generates money
-- for the user (once put in the environment such as "the dungeon")
--
CREATE TABLE generator (

    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    current_xp BIGINT NOT NULL DEFAULT 0, -- XP cap for the current level will be defined by some formula
    current_level INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ## FACTORY table ## -- a.k.a. "town"
--
-- This table represents the upgradable factory that generates money
-- for the user (once put in the environment such as "the dungeon")
--
CREATE TABLE factory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

    current_xp BIGINT NOT NULL DEFAULT 0, -- XP cap for the current level will be defined by some formula
    current_level INTEGER NOT NULL DEFAULT 1,

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);



-- ####################
-- # INDEXES #
-- ####################


-- === USERS ===
-- Lookup by wallet address (frequent during login / registration)
CREATE INDEX IF NOT EXISTS idx_users_wallet_address ON users (wallet_address);

-- Lookup by created_at (useful for listing or analytics)
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users (created_at);

-- === USER_BALANCES_LOGS ===
-- Fast access by user and transaction date
CREATE INDEX IF NOT EXISTS idx_user_balances_logs_user_id ON user_balances_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_user_balances_logs_created_at ON user_balances_logs (created_at);
CREATE INDEX IF NOT EXISTS idx_user_balances_logs_direction ON user_balances_logs (transaction_direction);

-- === GENERATOR ===
-- Quick lookup by user_id (join or API fetch)
CREATE INDEX IF NOT EXISTS idx_generator_user_id ON generator (user_id);

-- === FACTORY ===
-- Quick lookup by user_id (join or API fetch)
CREATE INDEX IF NOT EXISTS idx_factory_user_id ON factory (user_id);



-- ####################
-- # FUNCTIONS #
-- ####################


-- ## create_user function
-- 
-- The func creates a new user and inserts it into the users table
-- it also creates the associated user_balances table, factory and generator tables
-- it takes in the wallet address as the only input parameter
--
CREATE OR REPLACE FUNCTION create_user(_wallet TEXT)
RETURNS UUID AS $$
DECLARE
    _user_id UUID;
BEGIN
    INSERT INTO users (wallet_address) VALUES (_wallet)
    RETURNING id INTO _user_id;

    INSERT INTO factory (user_id) VALUES (_user_id);
    INSERT INTO generator (user_id) VALUES (_user_id);

    RETURN _user_id;
END;
$$ LANGUAGE plpgsql;

