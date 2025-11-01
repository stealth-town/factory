-- # AUTO-GENERATED SEED FILE
-- Generated from: items.csv

-- ####################
-- # ITEM TYPES
-- ####################

INSERT INTO item_types (type_code, type_display_name, type_description)
VALUES ('type1', 'Cooling System', 'Cooling System equipment slot');

INSERT INTO item_types (type_code, type_display_name, type_description)
VALUES ('type2', 'Extraction Tool', 'Extraction Tool equipment slot');

INSERT INTO item_types (type_code, type_display_name, type_description)
VALUES ('type3', 'Interface', 'Interface equipment slot');

INSERT INTO item_types (type_code, type_display_name, type_description)
VALUES ('type4', 'Module', 'Module equipment slot');

INSERT INTO item_types (type_code, type_display_name, type_description)
VALUES ('type5', 'Platform', 'Platform equipment slot');

INSERT INTO item_types (type_code, type_display_name, type_description)
VALUES ('type6', 'Power Module', 'Power Module equipment slot');

-- ####################
-- # ITEM ATTRIBUTES
-- ####################

INSERT INTO item_attributes (attribute_code, attribute_display_name, attribute_description)
VALUES ('attribute1', 'Power Output (MW)', 'Power Output (MW) stat');

INSERT INTO item_attributes (attribute_code, attribute_display_name, attribute_description)
VALUES ('attribute2', 'Reactor Stability/core health', 'Reactor Stability/core health stat');

INSERT INTO item_attributes (attribute_code, attribute_display_name, attribute_description)
VALUES ('attribute3', 'Cycle Rate (Hz)', 'Cycle Rate (Hz) stat');

INSERT INTO item_attributes (attribute_code, attribute_display_name, attribute_description)
VALUES ('attribute4', 'Surge Efficiency (%)', 'Surge Efficiency (%) stat');

INSERT INTO item_attributes (attribute_code, attribute_display_name, attribute_description)
VALUES ('attribute5', 'Surge Yield', 'Surge Yield stat');

INSERT INTO item_attributes (attribute_code, attribute_display_name, attribute_description)
VALUES ('attribute6', 'Thermal Shielding (%)', 'Thermal Shielding (%) stat');

-- ####################
-- # ITEM RARITY (default)
-- ####################

INSERT INTO item_rarity (rarity_code, rarity_display_name, rarity_stat_multiplier_percentage, rarity_drop_chance)
VALUES ('rarity1', 'Common', 100, 100)
ON CONFLICT (rarity_code) DO NOTHING;

-- ####################
-- # ITEMS
-- ####################

-- Rusted Control Node
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Rusted Control Node',
    'Outdated but reliable analog interface.',
    (SELECT id FROM item_types WHERE type_code = 'type3'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Overclock Interface Chip
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Overclock Interface Chip',
    'Increases reaction output, unstable at high loads.',
    (SELECT id FROM item_types WHERE type_code = 'type3'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Guardian Relay Hub
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Guardian Relay Hub',
    'Balanced regulator node for mid-tier control.',
    (SELECT id FROM item_types WHERE type_code = 'type3'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Neural Sync Array
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Neural Sync Array',
    'Links reactor cycles to operator systems.',
    (SELECT id FROM item_types WHERE type_code = 'type3'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Helios Processor
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Helios Processor',
    'Experimental solar-core control board.',
    (SELECT id FROM item_types WHERE type_code = 'type3'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Phase-Link Uplink
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Phase-Link Uplink',
    'Protects control feedback from overload.',
    (SELECT id FROM item_types WHERE type_code = 'type3'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Titan Command Node
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Titan Command Node',
    'Heavy industrial-grade control system.',
    (SELECT id FROM item_types WHERE type_code = 'type3'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Hollow Signal Core
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Hollow Signal Core',
    'Adaptive control processor that risks instability for power.',
    (SELECT id FROM item_types WHERE type_code = 'type3'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Arc Induction Coil
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Arc Induction Coil',
    'Basic starter-grade power coil.',
    (SELECT id FROM item_types WHERE type_code = 'type2'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Thermal Bore Unit
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Thermal Bore Unit',
    'Compact extractor for steady cycles.',
    (SELECT id FROM item_types WHERE type_code = 'type2'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Plasma Drill Head
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Plasma Drill Head',
    'Deep-mining plasma unit for dense energy nodes.',
    (SELECT id FROM item_types WHERE type_code = 'type2'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Ignition Extractor Arm
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Ignition Extractor Arm',
    'Fast and volatile extraction rig.',
    (SELECT id FROM item_types WHERE type_code = 'type2'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Flux Grinder
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Flux Grinder',
    'High-risk rotating extractor.',
    (SELECT id FROM item_types WHERE type_code = 'type2'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Spectral Conduit
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Spectral Conduit',
    'Stable multi-phase output system.',
    (SELECT id FROM item_types WHERE type_code = 'type2'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Entropy Lance Array
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Entropy Lance Array',
    'Dangerous overvoltage extractor.',
    (SELECT id FROM item_types WHERE type_code = 'type2'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Copper Sync Relay
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Copper Sync Relay',
    'Basic regulation module.',
    (SELECT id FROM item_types WHERE type_code = 'type4'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Dual Coil Amplifier
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Dual Coil Amplifier',
    'Boosts rhythm across both extraction arms.',
    (SELECT id FROM item_types WHERE type_code = 'type4'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Toxic Surge Module
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Toxic Surge Module',
    'Forces unstable plasma loops for higher yield.',
    (SELECT id FROM item_types WHERE type_code = 'type4'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Noctis Regulator
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Noctis Regulator',
    'Balances cycle intensity for advanced cores.',
    (SELECT id FROM item_types WHERE type_code = 'type4'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Specter Node Array
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Specter Node Array',
    'Peak surge node for burst builds.',
    (SELECT id FROM item_types WHERE type_code = 'type4'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Subroutine Injector
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Subroutine Injector',
    'Optimizes feedback loops for speed builds.',
    (SELECT id FROM item_types WHERE type_code = 'type4'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Quantum Feedback Core
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Quantum Feedback Core',
    'Rare device; produces chain reactions in surges.',
    (SELECT id FROM item_types WHERE type_code = 'type4'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Ground Stabilizer Pads
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Ground Stabilizer Pads',
    'Standard anti-shock foundation.',
    (SELECT id FROM item_types WHERE type_code = 'type5'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Kinetic Lift Platform
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Kinetic Lift Platform',
    'Light-grade oscillation support frame.',
    (SELECT id FROM item_types WHERE type_code = 'type5'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Treadline Mount
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Treadline Mount',
    'Improves base rhythm during operation.',
    (SELECT id FROM item_types WHERE type_code = 'type5'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Phantom Pedestal
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Phantom Pedestal',
    'High-precision balance stabilizer.',
    (SELECT id FROM item_types WHERE type_code = 'type5'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Ignis Anchor Base
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Ignis Anchor Base',
    'Heat-reactive baseplate, reroutes pressure.',
    (SELECT id FROM item_types WHERE type_code = 'type5'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Titan Ground Frame
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Titan Ground Frame',
    'Industrial reactor anchor platform.',
    (SELECT id FROM item_types WHERE type_code = 'type5'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Phase-Lock Base
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Phase-Lock Base',
    'Advanced anti-vibration pedestal.',
    (SELECT id FROM item_types WHERE type_code = 'type5'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Cracked Capacitor
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Cracked Capacitor',
    'Simple voltage storage node.',
    (SELECT id FROM item_types WHERE type_code = 'type6'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Ember Core Cell
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Ember Core Cell',
    'Converts residual heat into usable energy.',
    (SELECT id FROM item_types WHERE type_code = 'type6'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Hemoflux Regulator
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Hemoflux Regulator',
    'Circulates superheated plasma safely.',
    (SELECT id FROM item_types WHERE type_code = 'type6'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Phase Prism Core
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Phase Prism Core',
    'Splits energy flow across systems for speed builds.',
    (SELECT id FROM item_types WHERE type_code = 'type6'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Chrono Sync Relay
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Chrono Sync Relay',
    'Stabilizes timing mismatches in energy bursts.',
    (SELECT id FROM item_types WHERE type_code = 'type6'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Overdrive Beacon
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Overdrive Beacon',
    'Pushes cycle acceleration at high risk.',
    (SELECT id FROM item_types WHERE type_code = 'type6'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Entropy Token
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Entropy Token',
    'Uses chaotic energy for self-stabilization.',
    (SELECT id FROM item_types WHERE type_code = 'type6'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Basic Fan Array
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Basic Fan Array',
    'Simple air-cooled system.',
    (SELECT id FROM item_types WHERE type_code = 'type1'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Alloy Coolant Pipes
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Alloy Coolant Pipes',
    'Standard fluid cooling circuit.',
    (SELECT id FROM item_types WHERE type_code = 'type1'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Carbon Fiber Shell
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Carbon Fiber Shell',
    'Durable containment casing.',
    (SELECT id FROM item_types WHERE type_code = 'type1'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Cryo Flow Harness
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Cryo Flow Harness',
    'Circulates coolant through high-stress zones.',
    (SELECT id FROM item_types WHERE type_code = 'type1'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Cryo-Thermal Loop
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Cryo-Thermal Loop',
    'Full-loop cooling for long cycle operations.',
    (SELECT id FROM item_types WHERE type_code = 'type1'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Entropy Dissipator
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Entropy Dissipator',
    'Converts instability into usable power.',
    (SELECT id FROM item_types WHERE type_code = 'type1'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- Phase Cooling Grid
INSERT INTO item_list (item_name, item_description, item_type_id, item_rarity_id)
VALUES (
    'Phase Cooling Grid',
    'Advanced nano coolant for high-tier cores.',
    (SELECT id FROM item_types WHERE type_code = 'type1'),
    (SELECT id FROM item_rarity WHERE rarity_code = 'rarity1')
);

-- ####################
-- # ITEM ATTRIBUTE VALUES
-- ####################

-- Rusted Control Node attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Rusted Control Node' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    25.0
);

-- Overclock Interface Chip attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Overclock Interface Chip' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    5.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Overclock Interface Chip' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    1.0
);

-- Guardian Relay Hub attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Guardian Relay Hub' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    20.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Guardian Relay Hub' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    3.0
);

-- Neural Sync Array attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Neural Sync Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    10.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Neural Sync Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    2.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Neural Sync Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    2.0
);

-- Helios Processor attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Helios Processor' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    6.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Helios Processor' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    3.0
);

-- Phase-Link Uplink attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase-Link Uplink' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    15.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase-Link Uplink' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    4.0
);

-- Titan Command Node attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Titan Command Node' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    30.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Titan Command Node' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    1.0
);

-- Hollow Signal Core attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Hollow Signal Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    5.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Hollow Signal Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    4.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Hollow Signal Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    4.0
);

-- Arc Induction Coil attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Arc Induction Coil' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    12.0
);

-- Thermal Bore Unit attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Thermal Bore Unit' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    10.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Thermal Bore Unit' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.05
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Thermal Bore Unit' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    2.0
);

-- Plasma Drill Head attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Plasma Drill Head' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    16.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Plasma Drill Head' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.03
);

-- Ignition Extractor Arm attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ignition Extractor Arm' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    8.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ignition Extractor Arm' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.1
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ignition Extractor Arm' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    5.0
);

-- Flux Grinder attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Flux Grinder' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    11.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Flux Grinder' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.07
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Flux Grinder' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    1.0
);

-- Spectral Conduit attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Spectral Conduit' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    13.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Spectral Conduit' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.06
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Spectral Conduit' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    4.0
);

-- Entropy Lance Array attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Entropy Lance Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    14.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Entropy Lance Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    6.0
);

-- Copper Sync Relay attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Copper Sync Relay' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    5.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Copper Sync Relay' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.05
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Copper Sync Relay' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    2.0
);

-- Dual Coil Amplifier attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Dual Coil Amplifier' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    7.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Dual Coil Amplifier' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.07
);

-- Toxic Surge Module attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Toxic Surge Module' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    8.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Toxic Surge Module' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    5.0
);

-- Noctis Regulator attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Noctis Regulator' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    10.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Noctis Regulator' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.06
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Noctis Regulator' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    3.0
);

-- Specter Node Array attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Specter Node Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    12.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Specter Node Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    6.0
);

-- Subroutine Injector attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Subroutine Injector' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    6.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Subroutine Injector' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.08
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Subroutine Injector' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    1.0
);

-- Quantum Feedback Core attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Quantum Feedback Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    9.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Quantum Feedback Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.04
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Quantum Feedback Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    4.0
);

-- Ground Stabilizer Pads attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ground Stabilizer Pads' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    5.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ground Stabilizer Pads' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    3.0
);

-- Kinetic Lift Platform attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Kinetic Lift Platform' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.09
);

-- Treadline Mount attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Treadline Mount' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.04
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Treadline Mount' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    2.0
);

-- Phantom Pedestal attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phantom Pedestal' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.06
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phantom Pedestal' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    5.0
);

-- Ignis Anchor Base attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ignis Anchor Base' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    5.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ignis Anchor Base' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.08
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ignis Anchor Base' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    4.0
);

-- Titan Ground Frame attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Titan Ground Frame' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    15.0
);

-- Phase-Lock Base attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase-Lock Base' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.03
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase-Lock Base' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    8.0
);

-- Cracked Capacitor attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Cracked Capacitor' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    4.0
);

-- Ember Core Cell attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ember Core Cell' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    5.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Ember Core Cell' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    2.0
);

-- Hemoflux Regulator attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Hemoflux Regulator' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    8.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Hemoflux Regulator' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    2.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Hemoflux Regulator' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    1.0
);

-- Phase Prism Core attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase Prism Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    6.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase Prism Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.03
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase Prism Core' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    5.0
);

-- Chrono Sync Relay attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Chrono Sync Relay' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    10.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Chrono Sync Relay' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.05
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Chrono Sync Relay' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    2.0
);

-- Overdrive Beacon attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Overdrive Beacon' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    3.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Overdrive Beacon' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute3'),
    0.1
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Overdrive Beacon' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    1.0
);

-- Entropy Token attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Entropy Token' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute1'),
    2.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Entropy Token' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    3.0
);

-- Basic Fan Array attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Basic Fan Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    20.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Basic Fan Array' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    2.0
);

-- Alloy Coolant Pipes attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Alloy Coolant Pipes' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    45.0
);

-- Carbon Fiber Shell attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Carbon Fiber Shell' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    30.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Carbon Fiber Shell' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    3.0
);

-- Cryo Flow Harness attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Cryo Flow Harness' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    50.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Cryo Flow Harness' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute4'),
    1.0
);

-- Cryo-Thermal Loop attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Cryo-Thermal Loop' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    60.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Cryo-Thermal Loop' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    2.0
);

-- Entropy Dissipator attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Entropy Dissipator' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    40.0
);

-- Phase Cooling Grid attributes
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase Cooling Grid' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute2'),
    25.0
);
INSERT INTO item_attribute_values (item_id, attribute_id, attribute_value)
VALUES (
    (SELECT id FROM item_list WHERE item_name = 'Phase Cooling Grid' LIMIT 1),
    (SELECT id FROM item_attributes WHERE attribute_code = 'attribute6'),
    5.0
);

