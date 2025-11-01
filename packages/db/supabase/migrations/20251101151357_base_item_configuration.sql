-- # BEGIN MIGRATION ######################################################
--
-- @file - 20251101151357_base_item_configuration.sql
-- @dev - madjarx - Nov. 1st, 2025
--
-- This file contains the configurations for the item system
-- It is a modular system that will allow us to bend our items to our needs
--
-- Tables:
-- - item_types
-- - item_attributes
-- - item_list
-- - item_rarity
--



-- ####################
-- # TABLES #
-- ####################

-- rarity type
CREATE TABLE item_rarity (
    id SERIAL PRIMARY KEY,
    rarity_code TEXT UNIQUE NOT NULL,  -- 'rarity1', 'rarity2' for server-side code
    rarity_display_name TEXT NOT NULL,  -- 'Common', 'Rare', etc.
    rarity_stat_multiplier_percentage INT NOT NULL, -- (described in % e.g. 130 = 1.3x)
    rarity_drop_chance INT NOT NULL, -- (described in % e.g. 10 = 10% chance)
    created_at TIMESTAMP DEFAULT NOW()
);



-- item_types table
--
CREATE TABLE item_types (
    id SERIAL PRIMARY KEY,
    type_code TEXT UNIQUE NOT NULL,  -- 'type1', 'type2' for server-side code
    type_display_name TEXT NOT NULL,  -- 'Interface', 'Sword', etc.
    type_description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- item_attributes table
--
CREATE TABLE item_attributes (
    id SERIAL PRIMARY KEY,

    attribute_code TEXT UNIQUE NOT NULL,  -- 'attribute1', 'attribute2' for server-side code
    attribute_display_name TEXT NOT NULL,  -- 'Power Output', 'Crit Chance', etc.
    attribute_description TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

-- item_list (main items table)
--
CREATE TABLE item_list (
    id SERIAL PRIMARY KEY,

    item_name TEXT NOT NULL,
    item_description TEXT,

    item_type_id INT NOT NULL REFERENCES item_types(id),
    item_rarity_id INT NOT NULL REFERENCES item_rarity(id),

    created_at TIMESTAMP DEFAULT NOW()
);

-- item_attribute_values (junction: items <-> attributes with values)
--
CREATE TABLE item_attribute_values (
    item_id INT,
    attribute_id INT,
    attribute_value DECIMAL(10,2) NOT NULL,  -- the stat value for this attribute

    PRIMARY KEY (item_id, attribute_id),
    CONSTRAINT fk_item_attribute_values_item_id FOREIGN KEY (item_id) REFERENCES item_list(id) ON DELETE CASCADE,
    CONSTRAINT fk_item_attribute_values_attribute_id FOREIGN KEY (attribute_id) REFERENCES item_attributes(id) ON DELETE CASCADE
);










