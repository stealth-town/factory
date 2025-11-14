# Reactor Tick Service Design

## Overview
Service manages reactor production cycles for 100k+ users. Reactors generate flux over time through tick-based production with critical strikes, heat damage, and potential overheating.

## Core Mechanics

### Reactor Base Stats
- **100 HP** (health)
- **0% heat shield** - reduces heat damage
- **1 attack speed** - affects production interval (higher = faster ticks)
- **1 flux output** - base production amount
- **20% crit chance** - probability of critical strike
- **20% crit damage** - multiplier bonus on critical strikes

Items equipped to reactors boost these stats.

### Production Rules
- Reactors must have ≥1 item equipped to join cycles
- Each production tick:
  - Roll for critical strike (based on crit chance)
  - Generate flux: `baseFlux × (1 + critDamage/100)` if crit, else `baseFlux`
  - Take heat damage: `BASE_HEAT × 2` if crit, else `BASE_HEAT`
  - Heat damage reduced by heat shield: `damage × (1 - heatShield/100)`
- When HP reaches 0, reactor stops producing for remainder of cycle
- Production interval determined by attack speed (base: 30 seconds)

### Cycle Behavior
- Cycles run for X hours (24/7 operation)
- At cycle start, reactor stats are snapshot and locked for duration
- Reactor state tracked with accumulated time between ticks

## Architecture

### Tick-Based Processing
```
Main Coordinator (ticks every 30 seconds)
  ↓
Fetch all active reactors from DB
  ↓
Spawn 4-6 parallel workers
  ↓
Each worker processes subset of reactors
  ↓
Wait for all workers to complete
  ↓
Repeat next tick
```

### Worker Processing Logic
```javascript
for each reactor in chunk:
  reactor.accumulatedTime += TICK_INTERVAL
  
  while accumulatedTime >= productionInterval AND health > 0:
    isCrit = random() < critChance
    flux = baseFlux × (isCrit ? (1 + critDamage/100) : 1)
    heatDamage = BASE_HEAT × (isCrit ? 2 : 1) × (1 - heatShield/100)
    
    reactor.health -= heatDamage
    reactor.totalFlux += flux
    reactor.accumulatedTime -= productionInterval
    
    store event for streaming
```

### Key Design Decisions
- **30 second global tick** - reduces processing overhead vs 1s ticks
- **Individual production simulation** - each tick rolled separately for accurate crit/heat calculations
- **Accumulated time tracking** - handles reactors with different production intervals
- **Parallel worker processing** - horizontal scaling by partitioning reactor sets

### Cycle Phases
1. **Pre-cycle**: Snapshot reactor stats, mark cycle active
2. **Active cycle**: Main tick loop processes all productions
3. **Post-cycle**: Finalize flux totals, distribute rewards, reset states

## Scaling
- Horizontal: Add more worker instances, partition reactors by user ID
- Each instance handles 20-25k reactors
- Workers are stateless, only coordinator needs to be singleton
- Event streaming via Redis pub/sub to WebSocket servers

## Storage Requirements (per reactor)
- Cycle ID and start timestamp
- Snapshot stats (HP, heat shield, attack speed, flux output, crit chance, crit damage)
- Current state (health, accumulated time, total flux)
- Last 15 minutes of events (for streaming to connected users)

## Technology Considerations
- **Language**: Node.js/TypeScript or Go
- **Database**: PostgreSQL for reactor state
- **Cache/Events**: Redis for pub/sub and active cycle caching
- **Workers**: In-process parallel execution or separate worker processes
