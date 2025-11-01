-- # BEGIN MIGRATION ######################################################
--
-- @file - 20251101174123_generator_items_and_rules.sql
-- @dev - madjarx - Nov. 1st, 2025
--
-- Generator (a.k.a. "character") is the main feature of the app,
-- it is the entity that generates money for the user
-- user upgrades it via items
--
-- This migration tackles the user's (generator related) inventory
-- and the rules that enforce the inventory system and equipped items
--
--
-- !IMPORTANT - generator is already created in the base_entities.sql file
-- !IMPORTANT - all rules are enforced via constraints
-- !IMPORTANT - user's item stats are calculated via a function
--
-- !IMPORTANT - RULE - only 20 items can be held in inventory
-- !IMPORTANT - RULE - equipped items must match the slot they are equipped in
-- !IMPORTANT - RULE - only one item per slot per generator
-- !IMPORTANT - RULE - equipped items number is same as the number of item types
--
-- Tables:
-- - generator_items
-- - rules (functions, triggers, constraints)


-- ####################
-- # TABLES #
-- ####################

-- generator_items (a.k.a. inventory) 
--
CREATE TABLE generator_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    generator_id UUID NOT NULL REFERENCES generator(id) ON DELETE CASCADE,
    item_id INT NOT NULL REFERENCES item_list(id) ON DELETE CASCADE,
    
    -- Instance-specific rarity (rolled when item is awarded)
    instance_rarity_id INT NOT NULL REFERENCES item_rarity(id),
    
    -- Equipment state
    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,
    equipped_slot_type_id INT,  -- which slot (item_type) this is equipped in, NULL if unequipped
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Constraint: if equipped, must have a slot assigned
    CONSTRAINT check_equipped_has_slot CHECK (
        (is_equipped = TRUE AND equipped_slot_type_id IS NOT NULL) OR
        (is_equipped = FALSE AND equipped_slot_type_id IS NULL)
    ),
    
    -- Constraint: equipped slot must match item's type
    CONSTRAINT fk_equipped_slot_type FOREIGN KEY (equipped_slot_type_id) REFERENCES item_types(id),
    
    -- Unique: only one item per slot per generator
    CONSTRAINT unique_equipped_slot_per_generator UNIQUE (generator_id, equipped_slot_type_id)
);

-- generator_item_stats (calculated stats for each item instance)
-- Pre-calculated stats = base_stat * (rarity_multiplier / 100)
--
CREATE TABLE generator_item_stats (
    generator_item_id UUID NOT NULL REFERENCES generator_items(id) ON DELETE CASCADE,
    attribute_id INT NOT NULL REFERENCES item_attributes(id),
    calculated_value DECIMAL(10,2) NOT NULL,  -- pre-calculated stat with rarity multiplier applied
    
    PRIMARY KEY (generator_item_id, attribute_id)
);

-- Index for faster lookups
CREATE INDEX idx_generator_items_generator_id ON generator_items(generator_id);
CREATE INDEX idx_generator_items_equipped ON generator_items(generator_id, is_equipped);
CREATE INDEX idx_generator_item_stats_item_id ON generator_item_stats(generator_item_id);




-- ####################
-- # AUTO-CALCULATE STATS FUNCTION
-- ####################

-- Function: Automatically calculate and insert stats when item is added to inventory
CREATE OR REPLACE FUNCTION calculate_item_instance_stats()
RETURNS TRIGGER AS $$
DECLARE
    base_stat RECORD;
    rarity_multiplier DECIMAL(10,2);
BEGIN
    -- Get rarity multiplier (convert percentage to decimal: 130% -> 1.30)
    SELECT (rarity_stat_multiplier_percentage::DECIMAL / 100) INTO rarity_multiplier
    FROM item_rarity
    WHERE id = NEW.instance_rarity_id;
    
    -- Calculate stats for this item instance
    FOR base_stat IN 
        SELECT attribute_id, attribute_value
        FROM item_attribute_values
        WHERE item_id = NEW.item_id
    LOOP
        INSERT INTO generator_item_stats (generator_item_id, attribute_id, calculated_value)
        VALUES (
            NEW.id,
            base_stat.attribute_id,
            base_stat.attribute_value * rarity_multiplier
        );
    END LOOP;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_item_stats
AFTER INSERT ON generator_items
FOR EACH ROW
EXECUTE FUNCTION calculate_item_instance_stats();




-- ####################
-- # CONSTRAINTS & FUNCTIONS #
-- ####################

-- Function: Check inventory size limit (unequipped items only)
CREATE OR REPLACE FUNCTION check_inventory_limit()
RETURNS TRIGGER AS $$
DECLARE
    max_inventory_size INT := 20;  -- Y value - change as needed
    current_inventory_count INT;
BEGIN
    -- Only check if item is unequipped
    IF NEW.is_equipped = FALSE THEN
        SELECT COUNT(*) INTO current_inventory_count
        FROM generator_items
        WHERE generator_id = NEW.generator_id 
        AND is_equipped = FALSE
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);
        
        IF current_inventory_count >= max_inventory_size THEN
            RAISE EXCEPTION 'Inventory full: maximum % unequipped items allowed', max_inventory_size;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_inventory_limit
BEFORE INSERT OR UPDATE ON generator_items
FOR EACH ROW
EXECUTE FUNCTION check_inventory_limit();


-- Function: Validate equipped item type matches slot
CREATE OR REPLACE FUNCTION check_equipped_item_type_matches_slot()
RETURNS TRIGGER AS $$
DECLARE
    item_type_id INT;
BEGIN
    IF NEW.is_equipped = TRUE THEN
        -- Get the item's type
        SELECT il.item_type_id INTO item_type_id
        FROM item_list il
        WHERE il.id = NEW.item_id;
        
        -- Check if item type matches the slot
        IF item_type_id != NEW.equipped_slot_type_id THEN
            RAISE EXCEPTION 'Item type does not match equipment slot';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_item_type_matches_slot
BEFORE INSERT OR UPDATE ON generator_items
FOR EACH ROW
EXECUTE FUNCTION check_equipped_item_type_matches_slot();


-- Function: Check equipped items limit (max = number of item types)
CREATE OR REPLACE FUNCTION check_equipped_limit()
RETURNS TRIGGER AS $$
DECLARE
    max_equipped_slots INT;
    current_equipped_count INT;
BEGIN
    IF NEW.is_equipped = TRUE THEN
        -- Max equipped = number of item types
        SELECT COUNT(*) INTO max_equipped_slots FROM item_types;
        
        SELECT COUNT(*) INTO current_equipped_count
        FROM generator_items
        WHERE generator_id = NEW.generator_id 
        AND is_equipped = TRUE
        AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID);
        
        IF current_equipped_count >= max_equipped_slots THEN
            RAISE EXCEPTION 'All equipment slots full: maximum % equipped items allowed', max_equipped_slots;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_equipped_limit
BEFORE INSERT OR UPDATE ON generator_items
FOR EACH ROW
EXECUTE FUNCTION check_equipped_limit();


