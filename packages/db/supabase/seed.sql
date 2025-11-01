

-- Item rarity seed
--
-- @file - 20251101151357_base_item_configuration.sql
--
--
INSERT INTO item_rarity (
    rarity_code,
    rarity_display_name,
    rarity_stat_multiplier_percentage,
    rarity_drop_chance
) VALUES 
    ('rarity1', 'Common', 100, 55),      -- 1.0x multiplier, 55% drop
    ('rarity2', 'Rare', 130, 25),        -- 1.3x multiplier, 25% drop
    ('rarity3', 'Epic', 160, 15),        -- 1.6x multiplier, 15% drop
    ('rarity4', 'Legendary', 200, 5);    -- 2.0x multiplier, 5% drop


