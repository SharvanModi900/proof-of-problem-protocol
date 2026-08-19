# Truth Hunt: System Architecture & Technical Design

## Overview

Truth Hunt is a gamified civic verification layer built on top of the PoPP (Proof of Problem Protocol) ecosystem. This document defines the complete system architecture, service interactions, data flows, and technical stack.

---

## Core Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                      TRUTH MISSION API                        │
│   Ingests real-world problems from PoPP web chain             │
│   Filters → Prioritizes → Packages as "Mission Drops"         │
│   Region-based routing (Zone 7 = Rajasthan, etc.)             │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│              CRATE DISTRIBUTION ENGINE                        │
│   Breaks a mission into lootable evidence crates              │
│   Each crate = atomic validation unit                         │
│   Spawns crates in arena based on mission type & severity     │
│   Dynamic crate count based on mission urgency score          │
└──────────────────────────┬───────────────────────────────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
┌──────────────────────┐    ┌────────────────────────┐
│   AI INSIGHT LAYER   │    │  MULTIPLAYER INFRA     │
│                      │    │                        │
│ • Pre-analyzes media │    │ • Matchmaking (ELO)    │
│ • Client-side clues  │    │ • Squad formation      │
│ • TF Lite on-device  │    │ • Real-time state sync │
│ • Document verify    │    │ • Timer synchronization│
│ • Fake detection     │    │ • Crate control logic  │
└──────────┬───────────┘    └───────────┬────────────┘
           │                            │
           └────────────┬───────────────┘
                        ▼
┌──────────────────────────────────────────────────────────────┐
│                    CONSENSUS ENGINE                           │
│   Aggregates: Game verdicts + Web validator verdicts          │
│   Applies trust-weighted consensus formula                    │
│   Handles offline queue reconciliation                        │
│   Writes to PoPP chain → SBT mint                             │
└──────────────────────────┬───────────────────────────────────┘
                           │
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                 VALIDATOR XP SYSTEM                           │
│   Cross-interface score tracking (game + web)                 │
│   Rank progression, decay, recovery                           │
│   Feeds into DAO voting weight                                │
│   Reputation engine with redemption quests                    │
└──────────────────────────────────────────────────────────────┘
```

---

## Service Definitions

### 1. Truth Mission API

**Responsibility**: Bridge between PoPP's web validator ecosystem and the game arena.

**Inputs**:
- Verified problem tickets from PoPP chain (L4 validated)
- AI-detected emerging crises (urgency scoring)
- NGO/Government submitted missions (Phase 4)

**Outputs**:
- Mission drop packages with metadata:
  - `mission_id`: Unique identifier
  - `region`: Geographic zone code
  - `type`: flood | riot | fake_news | infrastructure | health
  - `urgency_score`: 0-100 (computed from location density + recency + media match)
  - `crate_count`: Number of evidence crates to spawn
  - `time_limit`: Validation window (2-5 minutes)
  - `reward_pool`: CivicTokens available for winning validators

**Key Logic**:
```
urgency_score = (location_density × 0.3) + 
                (recency_factor × 0.4) + 
                (media_match_score × 0.3)
```

### 2. Crate Distribution Engine

**Responsibility**: Transform a mission into granular, lootable validation units.

**Crate Anatomy**:
```
Evidence Crate {
  crate_id: UUID
  mission_id: UUID
  contents: {
    media_items: [Photo/Video] (1-5 items)
    documents: [PDF/Report] (0-2 items)
    ai_clues: [InsightHint] (1-3 hints)
    context_metadata: {
      location: GeoPoint (fuzzed for sensitivity)
      timestamp: DateTime
      source_type: social_media | news | citizen_report
      prior_cases: [UUID] (historical similar events)
    }
  }
  spawn_location: Arena coordinates
  contest_timer: Duration (seconds)
  max_validators: Int (squad size limit per crate)
}
```

**Crate Types**:
| Type | Contents | Validation Focus |
|------|----------|-----------------|
| Media Crate | Photos/Videos | Authenticity, manipulation detection |
| Document Crate | Reports, records | Cross-referencing, factual accuracy |
| Witness Crate | Validator notes, testimonies | Credibility assessment |
| AI-Powered Crate | Pre-analyzed data + raw evidence | Confirm/refute AI findings |

### 3. AI Insight Layer

**Responsibility**: Pre-analyze evidence and provide actionable clues to validators.

**Client-Side (On-Device)**:
- TensorFlow Lite models for:
  - Image manipulation detection (EXIF analysis, noise patterns)
  - Reverse image search (hash matching against known fakes)
  - Document OCR + keyword extraction
  - Audio deepfake detection (Phase 2)

**Server-Side**:
- Heavy analysis pipeline:
  - Cross-referencing with verified databases
  - Historical pattern matching
  - Multi-source corroboration
  - Confidence scoring

**Output Format**:
```
AIInsightHint {
  hint_id: UUID
  type: manipulation_risk | source_credibility | historical_match | cross_reference
  confidence: Float (0.0 - 1.0)
  description: String (human-readable)
  evidence_refs: [UUID] (linked evidence items)
  actionability: high | medium | low
}
```

### 4. Multiplayer Infrastructure

**Responsibility**: Real-time game state management, matchmaking, and squad coordination.

**Components**:

**Matchmaking Engine**:
- ELO-like rating based on:
  - Historical validation accuracy
  - Squad leadership performance
  - Response time efficiency
  - Consensus alignment rate
- Region-aware matching (prefer same-zone validators)
- Rank-band matching (Trainees don't face Dharma Warriors)

**State Management**:
```
ArenaState {
  mission_id: UUID
  phase: dropping | looting | validating | consensus | complete
  squads: [SquadState]
  crates: [CrateState]
  global_timer: Duration
  consensus_status: ConsensusState
}

SquadState {
  squad_id: UUID
  members: [ValidatorProfile]
  controlled_crates: [UUID]
  chat_enabled: Boolean
  verdict_submitted: Boolean
  verdict: VerdictData | null
}
```

**Communication Protocol**:
- WebSocket for real-time state sync
- Redis pub/sub for cross-server broadcast
- Optimistic updates with server reconciliation
- Heartbeat every 5s, timeout at 15s

### 5. Consensus Engine

**Responsibility**: Merge game and web validator verdicts into a single truth anchor.

**Verdict Input**:
```
ValidatorVerdict {
  validator_id: UUID
  interface: game | web
  crate_id: UUID
  verdict: genuine | fake | incomplete
  confidence: Float (0.0 - 1.0)
  reason_note: String (optional, max 500 chars)
  timestamp: DateTime
  trust_weight: Float (computed)
}
```

**Consensus Formula** (see dedicated document for full specification):
```
final_verdict = weighted_aggregate(all_verdicts, trust_weights)
```

**On-Chain Write**:
- Consensus result → PoPP chain transaction
- SBT minted for each participating validator
- XP updated via Validator XP System
- Dispute window opened (72 hours)

### 6. Validator XP System

**Responsibility**: Unified reputation tracking across game and web interfaces.

**Score Components**:
```
ValidatorProfile {
  validator_id: UUID
  total_xp: Int
  civic_rank: Rank
  reputation_score: Float (0.0 - 100.0)
  accuracy_rate: Float
  missions_completed: Int
  leadership_count: Int
  disputes_won: Int
  disputes_lost: Int
  last_active: DateTime
  decay_factor: Float
}
```

**XP Events**:
| Event | XP | Reputation |
|-------|-----|-----------|
| Aligned validation | +50 | +0.5 |
| Early consensus bonus | +25 | +0.3 |
| Squad leadership win | +100 | +1.0 |
| Misaligned validation | +10 | -1.0 |
| Dispute won | +150 | +2.0 |
| Dispute lost (stake forfeited) | 0 | -3.0 |
| Redemption quest complete | +75 | +1.5 |
| Inactive decay (per week) | 0 | -0.5 |

---

## Data Flow: End-to-End

```
1. Problem detected (web validator / AI / NGO)
         │
         ▼
2. Truth Mission API creates mission package
         │
         ▼
3. Crate Distribution Engine spawns evidence crates
         │
         ├── AI Insight Layer pre-analyzes each crate
         │
         ▼
4. Matchmaking pairs validators into squads
         │
         ▼
5. Arena opens: Drop → Loot → Validate
         │
         ├── PvP for crate control
         ├── Timer countdown (2-5 min)
         ├── Squad chat enabled
         │
         ▼
6. Verdict submission (per crate)
         │
         ├── Live submission (connected)
         ├── Queued submission (offline)
         │
         ▼
7. Consensus Engine aggregates verdicts
         │
         ├── Game verdicts (trust-weighted)
         ├── Web verdicts (trust-weighted)
         │
         ▼
8. Final verdict anchored on PoPP chain
         │
         ├── SBT minted for participants
         ├── XP/reputation updated
         ├── Tokens distributed
         │
         ▼
9. Dispute window opens (72h)
         │
         ▼
10. Mission complete → data archived
```

---

## Offline-First Architecture

India's tier-2/3 cities — where civic misinformation hits hardest — have spotty connectivity. Offline is the **default**, not the exception.

### Local Storage (SQLite)
```
LocalDB {
  missions: [MissionPackage]       // Downloaded mission data
  crates: [CrateData]              // Pre-fetched evidence
  ai_results: [AIInsightResult]    // Cached AI analysis
  verdicts: [VerdictDraft]         // Pending submission
  sync_queue: [SyncItem]           // Queue for when online
  last_sync: DateTime              // Last successful sync
}
```

### Sync Protocol
```
On reconnect:
1. Check server mission state
2. If mission still active → submit queued verdicts
3. If mission expired → archive locally, grant partial XP
4. Resolve conflicts (server truth wins for timer state)
5. Update local validator profile
```

### Prefetching Strategy
- When a mission drops, push notification includes crate metadata
- Client downloads crate evidence proactively (media + AI clues)
- AI inference runs locally during download
- Validator can begin analysis before entering arena

---

## Technical Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Mobile Client | React Native / Expo | Existing popp-mobile stack |
| Real-time Multiplayer | Socket.io + Redis pub/sub | Proven, scales to ~100K concurrent |
| AI Inference (Client) | TensorFlow Lite | On-device, works offline |
| AI Inference (Server) | Python FastAPI + model server | Heavy analysis, document verification |
| Blockchain | PoPP Chain (Cosmos SDK) | Existing popp-chain infrastructure |
| Off-Chain API | Rust (Actix Web) | Existing layer-3-core-rust-api |
| Matchmaking | Custom ELO rating system | Fair skill-based matching |
| Local Storage | SQLite (via react-native-quick-sqlite) | Offline-first data persistence |
| Push Notifications | Firebase Cloud Messaging | India Android-dominant market |
| CDN (Media) | AWS CloudFront + S3 | Fast media delivery for evidence |

---

## Scalability Considerations

### Phase 1 (0-10K users)
- Single Socket.io server
- Redis for pub/sub
- PostgreSQL for game state
- Manual mission creation

### Phase 2 (10K-100K users)
- Socket.io cluster with Redis adapter
- Separate matchmaking service
- Automated mission generation from PoPP chain events
- CDN for media distribution

### Phase 3 (100K-1M users)
- Sharded arena servers (by region)
- Dedicated consensus computation cluster
- Event sourcing for audit trail
- Horizontal auto-scaling on mission drops

### Phase 4 (1M+ users)
- Edge computing for AI inference (reduce latency)
- Blockchain sidechain for game-specific transactions
- NFT marketplace infrastructure
- Streaming/broadcast infrastructure for esports

---

## Security Considerations

1. **Evidence Integrity**: All evidence hashed before arena spawn; tampering detectable
2. **Verdict Authentication**: Signed by validator's wallet key; non-repudiable
3. **Rate Limiting**: Per-validator submission caps prevent spam
4. **Anti-Sybil**: Device fingerprint + wallet SBT + behavioral analysis
5. **Content Safety**: AI pre-filters illegal/harmful content before crate spawn
6. **Audit Trail**: Every action logged with timestamp + validator signature
