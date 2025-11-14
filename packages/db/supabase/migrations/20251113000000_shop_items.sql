-- # BEGIN MIGRATION ######################################################
--
-- @file - 20251113000000_shop_items.sql
-- @dev - madjarx - Nov. 13th, 2025
--
-- This migration creates the shop system for in-game purchases
-- Supports balance bundles, upgrades, buildings, and other purchasable items
--
-- Tables:
-- - shop_items (all purchasable items with SOL prices)
--
-- Key Features:
-- - Flexible item types (balance, upgrade, building, building_slot, energy_bundle, etc.)
-- - SOL-based pricing
-- - Metadata field for type-specific data (e.g., balance_amount for balance bundles)
-- - Items can be enabled/disabled
--
-- ####################
-- # TABLES #
-- ####################

-- SHOP_ITEMS table
--
-- Stores all purchasable items in the game shop
-- Prices are in SOL (stored as DECIMAL for precision)
--
CREATE TABLE shop_items (
    id SERIAL PRIMARY KEY,

    -- Item details
    item_type TEXT NOT NULL, -- 'balance', 'upgrade', 'building', 'building_slot', 'energy_bundle', etc.
    name TEXT NOT NULL,
    description TEXT,

    -- Pricing
    sol_price DECIMAL(10, 9) NOT NULL CHECK (sol_price > 0), -- SOL price with 9 decimal precision (lamports)

    -- Item metadata (type-specific data)
    -- For 'balance': { "balance_amount": 1000 }
    -- For 'upgrade': { "upgrade_type": "generator_level", "level": 2 }
    -- For 'building': { "building_type": "trade_slot" }
    metadata JSONB NOT NULL DEFAULT '{}',

    -- Display and availability
    display_order INTEGER DEFAULT 0, -- For sorting items in shop UI
    is_enabled BOOLEAN NOT NULL DEFAULT TRUE, -- Can be purchased
    is_featured BOOLEAN NOT NULL DEFAULT FALSE, -- Highlighted in shop

    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT check_item_type CHECK (
        item_type IN (
            'balance',
            'upgrade',
            'building',
            'building_slot',
            'energy_bundle',
            'cosmetic',
            'boost'
        )
    )
);

-- ####################
-- # INDEXES #
-- ####################

-- Fast lookup by item type (for filtering shop items)
CREATE INDEX idx_shop_items_type ON shop_items(item_type);

-- Fast lookup for enabled items only (common query)
CREATE INDEX idx_shop_items_enabled ON shop_items(is_enabled) WHERE is_enabled = TRUE;

-- Sorting by display order
CREATE INDEX idx_shop_items_display_order ON shop_items(display_order);

-- ####################
-- # FUNCTIONS #
-- ####################

-- Function: Auto-update updated_at timestamp
CREATE TRIGGER trigger_shop_items_updated_at
BEFORE UPDATE ON shop_items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- ####################
-- # RLS & POLICIES #
-- ####################

-- Enable Row Level Security
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view enabled shop items (read-only for users)
CREATE POLICY "Public can view enabled shop items" ON shop_items
FOR SELECT
USING (is_enabled = TRUE);

-- Policy: Only admins can insert/update/delete (backend service role)
-- Service role automatically bypasses RLS, so no explicit policy needed

-- ####################
-- # COMMENTS #
-- ####################

COMMENT ON TABLE shop_items IS 'Purchasable items in the game shop. Includes balance bundles, upgrades, buildings, and more.';

COMMENT ON COLUMN shop_items.item_type IS 'Type of item: balance (in-game currency), upgrade (level ups), building (structures), etc.';
COMMENT ON COLUMN shop_items.sol_price IS 'Price in SOL (9 decimal precision). Example: 0.001 SOL = 0.001000000';
COMMENT ON COLUMN shop_items.metadata IS 'Type-specific data stored as JSON. Structure varies by item_type.';
COMMENT ON COLUMN shop_items.is_enabled IS 'Whether item can currently be purchased. Use to temporarily disable items.';
COMMENT ON COLUMN shop_items.is_featured IS 'Whether item is featured/highlighted in shop UI.';

-- ####################
-- # SEED DATA #
-- ####################

-- Sample balance bundles
INSERT INTO shop_items (item_type, name, description, sol_price, metadata, display_order, is_featured) VALUES
('balance', 'Small Balance Bundle', 'Get 100 balance to start trading', 0.01, '{"balance_amount": 100}', 1, false),
('balance', 'Medium Balance Bundle', 'Get 500 balance for more trades', 0.04, '{"balance_amount": 500}', 2, false),
('balance', 'Large Balance Bundle', 'Get 1,500 balance - Best value!', 0.1, '{"balance_amount": 1500}', 3, true),
('balance', 'Mega Balance Bundle', 'Get 5,000 balance for serious traders', 0.3, '{"balance_amount": 5000}', 4, false);

-- Sample other items (disabled for now, since we're only implementing balance)
INSERT INTO shop_items (item_type, name, description, sol_price, metadata, display_order, is_enabled) VALUES
('building_slot', 'Additional Trade Slot', 'Unlock an extra trade slot in your factory', 0.05, '{"slot_type": "trade"}', 10, false),
('upgrade', 'Generator Level 2', 'Upgrade your generator to level 2', 0.08, '{"upgrade_type": "generator_level", "level": 2}', 20, false),
('energy_bundle', 'Energy Boost', 'Get 100 energy to speed up production', 0.02, '{"energy_amount": 100}', 30, false);

-- # END MIGRATION ########################################################
