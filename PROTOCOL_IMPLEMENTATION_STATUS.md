# PoPP Protocol — 7-Layer Implementation Documentation

## What is PoPP?

**Proof of Problem Protocol (PoPP)** is a decentralized truth protocol — a civic infrastructure layer that transforms real-world problems into verifiable, immutable, actionable truths. It operates via a 7-layer architecture spanning mobile apps, Rust backend, Python AI service, Cosmos SDK blockchain, and React Native frontend.

**Repositories:**
| Repo | Role | Tech Stack |
|------|------|------------|
| `layer-3-core-rust-api` | Central backend API | Rust + Actix Web + PostgreSQL |
| `popp-mobile` | Mobile app (Android/iOS) | Expo React Native (TypeScript) |
| `offchain-intelligence` | AI analysis microservice | Python + FastAPI + OpenAI |
| `popp-chain` | Blockchain (Cosmos SDK) | Go + Tendermint |
| `popp` | Protocol specification | Markdown (whitepaper chapters) |
| `landing-page` | Public website | Next.js (static export) |

---

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PoPP Mobile App (Expo RN)                    │
│  Submit │ Validate │ Prove │ Escalate │ Resolve │ Govern │ Wallet│
└──────────────────────────────┬──────────────────────────────────┘
                               │ HTTPS
┌──────────────────────────────▼──────────────────────────────────┐
│                  Rust Backend (Actix Web)                        │
│                                                                  │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌───────────┐            │
│  │ Layer 1 │→│ Layer 2 │→│ Layer 3  │→│ Layer 4   │            │
│  │Submit   │ │AI Analyze│ │Consensus │ │Escalation │            │
│  └─────────┘ └─────────┘ └──────────┘ └───────────┘            │
│       │                                        │                 │
│  ┌─────────┐ ┌─────────┐ ┌──────────┐ ┌───────▼───┐            │
│  │ Layer 5 │ │ Layer 6 │ │ Layer 7  │ │ Scheduler │            │
│  │Proof    │ │Rewards  │ │Governance│ │ (Cron)    │            │
│  └─────────┘ └─────────┘ └──────────┘ └───────────┘            │
└──────────┬───────────────────────┬──────────────────────────────┘
           │                       │
    ┌──────▼──────┐        ┌──────▼──────┐
    │ PostgreSQL  │        │ PoPP Chain  │
    │ (State DB)  │        │ (Cosmos SDK)│
    └─────────────┘        └─────────────┘
           │
    ┌──────▼──────────┐
    │ Offchain Intel  │
    │ (Python/AI)     │
    └─────────────────┘
```

---

## Layer-by-Layer Implementation Status

---

### Layer 1: Problem Submission

**Status: ✅ COMPLETE**

**Purpose:** Citizens submit real-world problems with geolocation, photos, and descriptions. Submissions are the atomic unit of the entire protocol.

**What's Implemented:**
- Mobile submission form with GPS, camera, category selection, anonymous option
- Reverse geocoding (landmark names from coordinates)
- EXIF metadata extraction and GPS verification from photos
- Media upload to S3-compatible storage
- Chain anchoring: submissions broadcast to PoPP chain as `MsgSubmitTicket`
- Geospatial queries: nearby submissions, radius search
- Community support/flag system
- Submission updates (reporter can add evidence/updates over time)
- Comment/discussion system per submission
- Activity timeline tracking all events

**Backend Routes:**
```
POST   /api/submissions                    — Create submission
GET    /api/submissions                    — List all
GET    /api/submissions/{id}               — Get by ID
GET    /api/submissions/nearby             — Geospatial query
PUT    /api/submissions/{id}/status        — Update status
POST   /api/submissions/{id}/support       — Community support
POST   /api/submissions/{id}/flag          — Community flag
POST   /api/submissions/{id}/update        — Add update
GET    /api/submissions/{id}/updates       — Get updates
GET    /api/submissions/{id}/comments      — Get comments
POST   /api/submissions/{id}/comments      — Add comment
GET    /api/submissions/{id}/activity      — Activity timeline
GET    /api/submissions/{id}/proof-chain   — Full event chain
```

**Database Tables:** `submissions`, `evidence`, `comments`, `activity_log`, `community_votes`

**Mobile Screens:** `submit.tsx`, `ticket/[id].tsx`, `ticket/list.tsx`

**Pending:**
- Multi-media gallery (multiple photos/videos per submission)
- Voice note submissions
- IoT/sensor data ingestion
- Batch submission import

---

### Layer 2: AI Intelligence & Classification

**Status: ✅ COMPLETE**

**Purpose:** Every submission is automatically analyzed by AI for category, severity, urgency, spam detection, and evidence verification. This provides objective signal before validators vote.

**What's Implemented:**
- **ChatGPT API integration** for problem analysis (category, severity, urgency, keywords, summary)
- **Image-text mismatch detection** (AI verifies photo matches description)
- **EXIF verification** (GPS coordinates from photo metadata vs submission GPS)
- **Confidence scoring** (AI reports confidence % for each classification)
- **Spam/duplicate detection** (AI flags likely spam or duplicates)
- Python offchain-intelligence service (KeyBERT keyword extraction)
- AI analysis triggered automatically on submission creation
- AI results stored in submission record and displayed in mobile UI

**Backend Routes:**
```
POST   /api/submissions/{id}/ai-analyze    — Trigger AI analysis
GET    /api/submissions/{id}/ai-result      — Get AI analysis result
```

**Offchain Service:**
```
POST   /extract_keywords/                   — KeyBERT keyword extraction
POST   /analyze                             — ChatGPT full analysis (OpenAI API)
```

**Database Fields:** `ai_summary`, `ai_category`, `ai_severity`, `ai_urgency`, `ai_keywords`, `ai_spam`, `ai_duplicate`, `ai_confidence` (JSONB), `ai_analyzed_at`

**Mobile UI:** AI Analysis card on ticket detail showing severity badge, urgency indicator, keywords, confidence bars, and evidence verification status

**Pending:**
- Real-time streaming analysis (WebSocket)
- Multi-language AI analysis
- IoT sensor data correlation
- Historical pattern matching (same location, recurring problems)

---

### Layer 3: Validator Consensus

**Status: ✅ COMPLETE**

**Purpose:** Validators (staked, reputation-weighted) vote on submissions to reach consensus. When consensus reaches 75%, the system auto-generates a cryptographic proof.

**What's Implemented:**
- **Validator registration** with staking requirement and domain specialization
- **Reputation-weighted voting** (higher R-Score = more voting power)
- **Consensus algorithm**: tracks valid/invalid/flag votes per submission
- **Auto-proof trigger**: at 75% consensus, `tokio::spawn` calls proof generation
- **Validator dashboard** showing assigned submissions, vote history, accuracy
- **Exclusive assignment**: validators can self-assign or be auto-assigned
- **Validator levels** (1-5) with increasing stake requirements and voting power
- **Accuracy tracking**: tracks correct vs incorrect votes for reputation

**Backend Routes:**
```
POST   /api/validators/apply               — Apply as validator
GET    /api/validators/me                   — My validator profile
GET    /api/validators/dashboard            — Assigned submissions
POST   /api/validators/validate             — Submit validation vote
POST   /api/validators/vote                 — Cast vote (approve/reject/flag)
GET    /api/validators/status               — Check validator status
POST   /api/validators/assign/{id}          — Auto-assign validators
POST   /api/validators/self-assign/{id}     — Self-assign submission
GET    /api/validators/level-info           — Level requirements
GET    /api/submissions/{id}/votes          — Get all votes
```

**Database Tables:** `validators`, `votes`, `validator_assignments`

**Mobile Screens:** `validator/apply.tsx`, `validator/dashboard.tsx`

**Pending:**
- Validator rotation (re-assign after timeout)
- Multi-round consensus (deliberation rounds)
- Validator collusion detection
- Sybil resistance enforcement

---

### Layer 4: Proof Generation (Cryptographic)

**Status: ✅ COMPLETE**

**Purpose:** When validator consensus reaches 75%, a cryptographic proof is generated containing a PoP-ID (Proof of Problem Identifier), SHA-256 hash, and chain anchor. This makes the problem immutable and verifiable.

**What's Implemented:**
- **PoP-ID format**: `pop://{timestamp}/{region}/{category}/{hash_prefix}`
- **Auto-proof generation**: triggered from validator.rs when consensus hits 75%
- **SHA-256 content hashing**: deterministic hash of submission data
- **Proof verification**: recompute hash and compare with stored `proof_hash`
- **Proof challenge mechanism**: validators can challenge proofs (moves to "disputed")
- **Similar proof linking**: finds proofs with same category within ~1km radius
- **Chain anchoring**: proof broadcast to PoPP chain via `MsgSubmitTicket`
- **Proof levels**: L1 (<80%), L2 (80-89%), L3 (90-94%), L4 (95%+ consensus)
- **Manual proof generation** endpoint for proofer role

**Backend Routes:**
```
POST   /api/proofers/apply                  — Apply as proofer
GET    /api/proofers/me                     — My proofer profile
POST   /api/proofers/generate/{id}          — Manual proof generation
GET    /api/submissions/{id}/proof          — Get proof for submission
GET    /api/submissions/{id}/proof/verify   — Verify proof integrity
POST   /api/submissions/{id}/proof/challenge — Challenge a proof
GET    /api/submissions/{id}/proof/related  — Find similar proofs
GET    /api/proofs/verify/{pop_id}          — Verify by PoP-ID
GET    /api/proofers/stats                  — Proofer statistics
```

**Database Tables:** `proofs`, `proofers`
**Database Fields on submissions:** `pop_id`, `proof_id`, `proof_generated_at`, `similar_proof_ids`

**Mobile UI:** Cryptographic Proof card showing PoP-ID, hash, consensus %, proof level badge, verify/challenge buttons

**Pending:**
- ZK-proof generation for privacy-preserving verification
- IPFS/Filecoin evidence storage
- Cross-chain proof verification
- Proof NFT minting (Soulbound tokens)

---

### Layer 5: Escalation

**Status: ✅ COMPLETE**

**Purpose:** Problems that aren't resolved within time limits are automatically escalated through tiers: Local → Regional → National → Global/Emergency. Each tier has stricter deadlines.

**What's Implemented:**
- **4 escalation tiers**: Local (72h), Regional (48h), National (24h), Global (1h)
- **6 auto-escalation rules** running every 6 hours:
  1. Critical severity + Immediate urgency → Tier 4
  2. High severity + low consensus → Tier 3
  3. Multiple spam/duplicate flags → Tier 2
  4. No resolution after 48h → Tier 3
  5. Medium severity + no votes after 24h → Tier 2
  6. Response deadline exceeded → next tier
- **Response timer enforcement**: hourly check for expired deadlines
- **State history tracking**: JSONB array records every state transition
- **Chain anchoring**: escalations broadcast to PoPP chain
- **Emergency activation**: manual Tier 4 escalation with accelerated timeline
- **Scheduler**: 6 background jobs (proposals, auto-escalation, deadline enforcement, R-Score decay, session cleanup, archive)

**Backend Routes:**
```
POST   /api/escalations/check               — Manual escalation check
GET    /api/escalations/pending              — List pending escalations
GET    /api/escalations/{id}                 — Get escalation details
POST   /api/escalations/{id}/resolve         — Resolve escalation
POST   /api/emergency/activate               — Activate emergency protocol
GET    /api/submissions/{id}/escalation-info — Current escalation state
GET    /api/submissions/{id}/state-history   — Full state transition history
```

**Database Tables:** `escalations`
**Database Fields on submissions:** `response_deadline`, `escalated_to_tier`, `state_history` (JSONB)

**Mobile UI:** Escalation card showing tier badge, response timer countdown, escalation history timeline. Debug "Test Escalation" button for manual triggering.

**Pending:**
- Escalation notifications to tier-specific validator pools
- Cross-jurisdictional escalation routing
- Emergency broadcast to all validators simultaneously
- Escalation SLA tracking and reporting

---

### Layer 6: Resolution & Rewards

**Status: ✅ COMPLETE**

**Purpose:** When a problem is resolved (fixed, rejected, duplicate), rewards are distributed to all participants: submitter gets PoPP Credits, validators earn credits + R-Score for correct votes, resolver earns credits, and incorrect validators get slashed.

**What's Implemented:**
- **Resolution workflow**: fixed, rejected, spam, duplicate types
- **Reward calculation**: base 50 PoPP × severity multiplier × consensus multiplier
- **R-Score updates on resolution**:
  - Submitter: +5 to +10 R-Score (based on severity)
  - Validators (correct vote): +3 R-Score + 10 PoPP Credits each
  - Resolver: +4 R-Score + 15 PoPP Credits
  - Validators (incorrect vote on spam): -3 R-Score, -5 stake slashed
- **Reward ledger**: `reward_ledger` table tracks every reward event with type, amount, R-Score delta
- **Slashing events**: `slashing_events` table tracks validator penalties
- **On-chain rewards**: token transfers broadcast to PoPP chain via `MsgSend`
- **Double-resolution prevention**: rejects resolution on already-resolved submissions
- **State history update**: resolution event appended to `state_history` JSONB

**Backend Routes:**
```
POST   /api/resolutions/{id}/resolve          — Resolve submission
GET    /api/resolutions/{id}                   — Get resolution details
GET    /api/resolutions/stats                  — Global resolution statistics
GET    /api/submissions/{id}/reward-breakdown  — All rewards for a submission
GET    /api/rewards/history                    — User's reward history
GET    /api/rewards/my-slashing                — User's slashing events
```

**Database Tables:** `resolutions`, `reward_ledger`, `slashing_events`
**Database Fields on users:** `total_rewards_earned`, `total_slashed`, `resolver_count`

**Mobile UI:** Reward Distribution card showing each participant's reward type, amount, R-Score delta, and any slashing penalties

**Pending:**
- Staking yield distribution (periodic rewards for staked validators)
- Bounty system (community-funded rewards for high-impact problems)
- Reward vesting schedules
- Token burn mechanism on spam/rejection
- Soulbound reputation NFTs

---

### Layer 7: Governance DAO

**Status: ✅ COMPLETE**

**Purpose:** Token holders govern the protocol through proposals, voting, and treasury management. Rules can be changed through democratic process.

**What's Implemented:**
- **Proposal lifecycle**: draft → voting → passed/failed → executed
- **Token-weighted voting**: governance votes weighted by user's popp_credits
- **Quorum enforcement**: minimum voter participation required
- **Treasury management**: track balance, reserved, available funds
- **Auto-execution**: scheduler executes passed proposals automatically
- **Proposal types**: parameter changes, rule amendments, fund allocation
- **Mobile governance screens**: browse proposals, create, vote, view results

**Backend Routes:**
```
GET    /api/governance/proposals              — List proposals
POST   /api/governance/proposals              — Create proposal
GET    /api/governance/proposals/{id}         — Get proposal details
POST   /api/governance/proposals/{id}/vote    — Cast governance vote
POST   /api/governance/proposals/{id}/execute — Execute passed proposal
GET    /api/governance/treasury               — Treasury status
```

**Database Tables:** `proposals`, `governance_votes`, `treasury`

**Mobile Screens:** `governance/proposals.tsx`, `governance/proposal-detail.tsx`, `governance/create-proposal.tsx`

**Pending:**
- Delegated voting (liquid democracy)
- Timelock execution (delay before enactment)
- Constitutional amendments (supermajority required)
- Cross-chain governance (Cosmos IBC)
- Jurisdictionless justice system

---

## Supporting Infrastructure

### Blockchain Layer (PoPP Chain — Cosmos SDK)

**Status: ✅ Core modules deployed**

Three custom Cosmos SDK modules:
- **`x/ticket`**: Submit tickets on-chain, track ticket lifecycle
- **`x/validation`**: On-chain validation records, validator registration
- **`x/proof`**: Cryptographic proof anchoring, PoP-ID verification

**Rust backend integration** via `chain.rs`:
- `broadcast_ticket()` — Anchor submission to chain
- `broadcast_validation()` — Anchor validator vote
- `broadcast_proof()` — Anchor cryptographic proof
- `broadcast_escalation()` — Anchor escalation event
- `broadcast_reward()` — Send on-chain token rewards (MsgSend)
- `emergency_broadcast()` — Emergency protocol activation

### Scheduler (Background Jobs)

6 recurring tasks:
| Job | Frequency | Purpose |
|-----|-----------|---------|
| Proposal execution | Hourly | Auto-execute passed governance proposals |
| Auto-escalation | Every 6h | Check and escalate active submissions |
| Deadline enforcement | Hourly | Escalate when response timers expire |
| R-Score decay | Weekly | Decay R-Score for inactive users |
| Session cleanup | Daily | Remove expired auth sessions |
| Archive resolved | Daily | Archive resolved submissions >30 days old |

### Wallet & Reputation

- **PoPP Credits**: earned through validation, submission, resolution
- **Staked Amount**: locked tokens for validator participation
- **R-Score**: non-transferable reputation (0-100+), earned through accurate behavior
- **Badges**: soulbound achievement tokens
- **Leaderboard**: global ranking by R-Score

### Infrastructure Health Map

- Road segment health scoring with GPS-tracked segments
- Infrastructure zone monitoring (bridges, water, electricity)
- Route health summaries with color-coded severity
- Nearest problem zone detection
- Problem-to-infrastructure matching (AI-powered)

---

## Data Flow: Complete Ticket Lifecycle

```
1. SUBMIT
   User creates ticket → GPS + photo + description
   → Backend stores in PostgreSQL
   → Chain: MsgSubmitTicket broadcast
   → State: "submitted"

2. AI ANALYSIS
   → Offchain-intelligence service analyzes text + image
   → Severity, urgency, category, spam detection assigned
   → Confidence scores stored
   → State: "submitted" (with AI metadata)

3. VALIDATION
   → Validators assigned (auto or self-assign)
   → Each validator votes: valid / invalid / flag
   → Consensus score calculated (weighted by R-Score)
   → State: "pending_validation"

4. PROOF GENERATION (at 75% consensus)
   → SHA-256 hash computed from submission data
   → PoP-ID generated: pop://{timestamp}/{region}/{category}/{hash}
   → Proof record created
   → Chain: proof anchored
   → State: "validated"

5. ESCALATION (if not resolved within deadline)
   → Scheduler checks every 6h
   → Auto-escalates based on rules (severity, time, consensus)
   → Tier transitions: Local → Regional → National → Global
   → Response deadline set per tier
   → State history appended

6. RESOLUTION
   → Resolver marks as fixed/rejected/duplicate/spam
   → Rewards distributed:
     • Submitter: +PoPP Credits, +R-Score
     • Validators (correct): +Credits, +R-Score
     • Validators (incorrect): -stake, -R-Score (slashed)
     • Resolver: +Credits, +R-Score
   → All events recorded in reward_ledger
   → On-chain rewards broadcast
   → State: "resolved"

7. ARCHIVAL
   → After 30 days, scheduler archives resolved tickets
   → State: "archived"
   → Data remains immutable on-chain
```

---

## The 5 Roles in PoPP

| Role | Who | What they do |
|------|-----|-------------|
| **Reporter** | Any citizen with the app | Submits a problem with photo + GPS |
| **Validator** | Staked, reputation-weighted | Votes valid/invalid/flag on submissions |
| **Proofer** | Certified validators | Generates cryptographic proof at consensus |
| **Resolver** | Anyone (institution, volunteer, citizen) | Marks problem as fixed/rejected |
| **Governor** | Token holders | Proposes and votes on protocol rule changes |

One person can hold multiple roles. A Reporter can also become a Validator by staking tokens.

### Reward Structure

| Action | PoPP Credits | R-Score | On-Chain |
|--------|-------------|---------|----------|
| Submit problem (resolved) | +50 | +5 | Yes |
| Validate correctly | +10 | +3 | Yes |
| Validate incorrectly | 0 | -3 | No |
| Resolve a ticket | +15 | +4 | No |
| Generate proof | +20 | +5 | Yes |
| Support community voting | 0 | +1 | No |
| Get slashed (bad vote) | -5 stake | -3 | No |

---

## Community Screen — Protocol Layer Mapping

The Community screen (`(tabs)/community.tsx`) is a **social dashboard** that visualizes the output of all 7 layers through aggregated statistics.

| Section | Protocol Layer | How |
|---------|---------------|-----|
| Community Pulse (Active / Resolved / Consensus / Disputed) | L1 + L3 + L5 + L6 | Computed from submissions: status counts (L1/L6), avg consensus_score (L3), dispute rate (L5) |
| Problems by Category | L1 + L2 | Submissions carry AI-assigned categories (L2) on top of user-selected category (L1) |
| Ticket Status Grid | L1→L6 | Status reflects current layer in lifecycle: submitted→pending_validation→validated→under_resolution→resolved→archived |
| Escalation Alerts | L5 | Filters submissions where status=disputed OR escalation_level=regional/global |
| Trending Problems | L3 + L4 | Sorted by consensus_score — highest validator agreement = most validated problems |
| Active Governance | L7 | Shows active DAO proposals with yes/no vote bars |
| Top Validators | L3 + L6 | Leaderboard ranked by R-Score earned through correct votes and reward distribution |

**Data flow:**
```
api.getSubmissions()  ──→  computeStats()  ──→  Community Pulse + Category + Status
api.getProposals()    ──→  filter active    ──→  Active Governance section
api.getLeaderboard()  ──→  top 5            ──→  Top Validators section
```

All 3 API calls fire in parallel via `Promise.all` with `.catch(() => [])` fallback.

---

## Map Screen — Protocol Layer Mapping

The Map screen (`(tabs)/map.tsx`) is a **geospatial dashboard** that overlays protocol data on a Leaflet/OpenStreetMap WebView.

### Submission Markers (color-coded pins)

| Marker Color | Status | Protocol Layer |
|-------------|--------|---------------|
| Blue (#3b82f6) | Submitted | L1 — Problem submitted, awaiting AI |
| Amber (#f59e0b) | Pending Validation | L2/L3 — AI analyzed, awaiting validators |
| Green (#22c55e) | Validated | L3 — Validator consensus reached |
| Purple (#8b5cf6) | Under Resolution | L6 — Being resolved |
| Red (#ef4444) | Disputed | L5 — Escalated or challenged |
| Cyan (#06b6d4) | Resolved | L6 — Problem fixed, rewards distributed |
| Gray (#6b7280) | Archived | End of lifecycle — archived by scheduler |

Tap on marker → navigates to ticket detail screen (all layers visible).

### Road Segments (polylines + health dots)

| Feature | Protocol Layer | How |
|---------|---------------|-----|
| Road polylines (dashed lines) | L1 + L2 + L3 | Problems linked to segments (L1), AI severity affects health (L2), validator consensus affects health (L3) |
| Health dots (size = severity) | Infrastructure Health | health_score 0-10: green (8-10) → yellow (6-7) → orange (4-5) → red (2-3) → dark red (0-1) |
| Warning rings on bad segments | L5 | Segments with health < 5 get a visible warning ring |
| Tap → segment detail sheet | L1 + L2 | Shows score, name, status, severity, problem count, speed recommendation, linked problems list |

### Infrastructure Zones (circles)

| Feature | Protocol Layer | How |
|---------|---------------|-----|
| Zone circles (schools, hospitals, water, power) | L1 + L2 | Problems matched to zones (L1), AI severity → zone health score (L2) |
| Tap → zone detail sheet | L1 + L2 | Shows health score, type, radius, severity, problem count, linked problems |
| Filter chips (All/Roads/Schools/Hospitals/Water/Power) | UI filter | Client-side filter on zone_type |

### Other Map Features

| Feature | Protocol Layer | How |
|---------|---------------|-----|
| Route Health Card (avg score + Start Ride) | L1+L2+L3 | Aggregated segment scores along route → speed recommendation |
| Nearby Alerts (proximity warnings) | L1 + L5 | Critical problems within 1km of user = proximity warning, header updates with alert |
| Legend Popup | Reference | Shows road health colors + problem status colors |
| Center on User | Location | GPS → animateToRegion |
| Region Change → Reload | Performance | `onRegionChangeComplete` re-fetches segments for new bounding box |
| Stats Badge | L1 + Infra | Shows segment count + zone count in viewport |

### Map Data Flow

```
fetchMapData(bbox) ──→ Promise.all([
  getRoadSegments(bbox)     → polylines + circles (road dots)
  getInfrastructureZones()  → circles (zone overlays)
  getSubmissions()          → markers (submission pins)
  getRouteHealth(bbox)      → route health card
])

getCurrentLocation() ──→ getNearbyAlerts(lat, lng, 1000m) → proximity alert banner
```

---

## How Data Flows Through Layers to Mobile Screens

```
User submits problem (L1)
        │
        ▼
AI analyzes severity (L2) ──→ affects category breakdown in Community
        │                      affects road/zone health scores on Map
        ▼
Validators vote (L3) ──────→ consensus_score drives "Trending Problems"
        │                      in Community screen
        ▼
Proof generated at 75% (L4) → status changes to "validated" (green marker on Map)
        │
        ▼
Escalation if overdue (L5) ─→ "Escalation Alerts" section in Community
        │                       red markers on Map
        ▼
Resolution + rewards (L6) ──→ status "resolved" (cyan marker on Map)
        │                      R-Score updates in "Top Validators" in Community
        ▼
Governance proposals (L7) ──→ "Active Governance" section in Community
```

---

## Mobile App Screens

| Screen | Path | Protocol Layers |
|--------|------|----------------|
| Home Feed | `(tabs)/index.tsx` | L1 |
| Submit Problem | `(tabs)/submit.tsx` | L1 |
| Ticket Detail | `(tabs)/ticket/[id].tsx` | L1-L6 (full lifecycle: AI, votes, proof, escalation, rewards) |
| Ticket List | `(tabs)/ticket/list.tsx` | L1 |
| Proof Chain | `(tabs)/ticket/proof-chain.tsx` | L4 |
| Validator Apply | `(tabs)/validator/apply.tsx` | L3 |
| Validator Dashboard | `(tabs)/validator/dashboard.tsx` | L3 |
| Map View | `(tabs)/map.tsx` | L1+L2+L3+L5+L6 + Infrastructure Health |
| Explore (Infrastructure) | `(tabs)/explore.tsx` | L1+L2 + Infrastructure Health |
| Community | `(tabs)/community.tsx` | L1+L2+L3+L5+L6+L7 (all layers aggregated) |
| Memory Chain | `(tabs)/memory-chain.tsx` | L4 |
| Ride Mode | `ride-mode.tsx` | L1+L2+L3 + Infrastructure Health (real-time) |
| Notifications | `(tabs)/notifications.tsx` | All layers |
| Profile | `(tabs)/profile.tsx` | All layers |
| Wallet | `(tabs)/wallet/index.tsx` | L6 |
| Governance Proposals | `(tabs)/governance/proposals.tsx` | L7 |
| Proposal Detail | `(tabs)/governance/proposal-detail.tsx` | L7 |
| Create Proposal | `(tabs)/governance/create-proposal.tsx` | L7 |
| Badges | `(tabs)/reputation/badges.tsx` | L6 |
| Leaderboard | `(tabs)/reputation/leaderboard.tsx` | L3 + L6 |

---

## Database Schema Summary (38 Migrations)

**Core Tables:**
- `submissions` — problem tickets with AI metadata, state history, escalation
- `users` — wallet, R-Score, PoPP Credits, stake, stats
- `evidence` — media attachments per submission
- `votes` — validator votes (valid/invalid/flag)
- `validators` — validator registration, level, domain, accuracy
- `proofs` — cryptographic proofs with PoP-ID, hash, chain tx
- `proofers` — proofer registration
- `escalations` — escalation records with tier transitions
- `resolutions` — resolution records with reward distribution
- `reward_ledger` — every reward event tracked
- `slashing_events` — validator penalty records
- `proposals` — governance proposals
- `governance_votes` — governance vote records
- `treasury` — DAO treasury
- `comments` — discussion threads
- `activity_log` — event timeline
- `community_votes` — support/flag votes
- `badges` — achievement badges
- `notifications` — user notifications
- `transactions` — wallet transactions
- `validator_assignments` — validator-submission assignments
- `disputes` — dispute records
- `road_segments`, `infrastructure_zones` — infrastructure health
- `push_tokens` — FCM push notification tokens

---

## What's Pending (Future Work)

### Protocol Enhancements
1. **ZK-Proofs** — Privacy-preserving verification without revealing submission details
2. **IPFS Evidence Storage** — Decentralized file storage for photos/videos
3. **Cross-chain Interop** — IBC integration for multi-chain proof verification
4. **Soulbound NFTs** — Irrevocable reputation badges on-chain
5. **IoT Integration** — Sensor data as evidence (air quality, noise, vibration)
6. **Voice Submissions** — Record and submit problems via voice

### Economic Model
7. **Staking Yield** — Periodic rewards for staked validators
8. **Bounty System** — Community-funded rewards for high-impact problems
9. **Token Burn** — Deflationary mechanism on spam/rejection
10. **Reward Vesting** — Time-locked reward distribution

### Governance
11. **Liquid Democracy** — Delegated voting power
12. **Timelock Execution** — Delay before proposal enactment
13. **Constitutional Amendments** — Supermajority-required rule changes

### Infrastructure
14. **WebSocket Real-time** — Live updates for validation, escalation, resolution
15. **Multi-language Support** — Hindi, regional languages for Indian market
16. **Web App** — Browser-based dashboard alongside mobile
17. **API Rate Limiting** — DDoS protection and fair usage
18. **Monitoring & Alerting** — Prometheus + Grafana for production observability

---

## Deployment Architecture

```
Production Server (Ubuntu)
├── Rust Backend (PM2 managed)
│   └── Port 3000 → NGINX reverse proxy → api.popp.protocol
├── PostgreSQL 14
│   └── 38 migrations, state DB
├── PoPP Chain Node (popd)
│   └── Tendermint consensus, custom modules
├── NGINX
│   └── SSL termination, subdomain routing
└── Docker (optional)
    └── Containerized deployment via docker-compose

Mobile App
└── Expo EAS Build → Google Play Store

Offchain Intelligence
└── FastAPI service → Python 3.11 + OpenAI API
```

---

## Summary

All 7 layers of the PoPP protocol have been implemented with functional backend APIs, mobile UI, database schema, and blockchain integration. The system forms a complete lifecycle: **Submit → AI Analyze → Validate → Prove → Escalate → Resolve & Reward → Govern**.

The protocol is designed for incremental enhancement — each layer can be extended independently without breaking the others. The most impactful next steps are ZK-proofs, IPFS storage, and staking yield distribution.
