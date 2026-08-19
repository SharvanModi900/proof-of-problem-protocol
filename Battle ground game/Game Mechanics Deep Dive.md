# Truth Hunt: Game Mechanics Deep Dive

## Overview

This document provides a detailed breakdown of the core game mechanics in Truth Hunt. Each mechanic is designed to balance **fun** (engagement, competition) with **civic purpose** (accurate validation, truth-seeking).

---

## 1. Mission Drop System

### What is a Mission?
A **mission** is a real-world civic problem packaged for game validation. Examples:
- "Flood damage in Assam — verify 5 social media reports"
- "Fake news about riot in Delhi — confirm or debunk"
- "Infrastructure failure in Mumbai — validate citizen reports"

### Mission Anatomy
```
Mission {
  mission_id: UUID
  title: String
  type: flood | riot | fake_news | infrastructure | health
  region: String (zone code, e.g., "Zone 7 = Rajasthan")
  urgency_score: Int (0-100)
  crate_count: Int (number of evidence crates)
  time_limit: Duration (2-5 minutes per crate)
  reward_pool: Int (CivicTokens)
  status: active | completed | expired
  created_at: DateTime
  expires_at: DateTime
}
```

### Mission Types
| Type | Evidence Focus | Validation Challenge |
|------|---------------|---------------------|
| Flood | Photos/videos of damage, official reports | Cross-referencing location, assessing severity |
| Riot | Social media posts, news articles | Detecting manipulation, verifying timeline |
| Fake News | Text claims, source links | Fact-checking, source credibility |
| Infrastructure | Citizen reports, geo-tagged photos | Verifying location, assessing impact |
| Health | Medical reports, outbreak data | Scientific accuracy, source verification |

### Urgency Scoring
```
urgency_score = (location_density × 0.3) + 
                (recency_factor × 0.4) + 
                (media_match_score × 0.3)

Where:
- location_density: Population affected (0-100)
- recency_factor: Time since event (0-100, newer = higher)
- media_match_score: Corroboration across sources (0-100)
```

**Hot Zone Missions**: Urgency > 80 triggers "Hot Zone" status:
- 2x reward pool
- Tighter timer (2 min instead of 5)
- Enhanced loot (better AI clues)
- Live leaderboard for responders

---

## 2. Evidence Crate System

### What is a Crate?
A **crate** is the atomic unit of validation — a bundle of evidence that validators loot, analyze, and verdict on.

### Crate Types
| Type | Contents | Validation Focus |
|------|----------|-----------------|
| Media Crate | 3-5 photos/videos | Authenticity, manipulation detection |
| Document Crate | 1-2 reports/records | Cross-referencing, factual accuracy |
| Witness Crate | 2-3 validator notes | Credibility assessment |
| AI-Powered Crate | Pre-analyzed data + raw evidence | Confirm/refute AI findings |

### Crate Anatomy
```
EvidenceCrate {
  crate_id: UUID
  mission_id: UUID
  type: media | document | witness | ai_powered
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
  loot_status: unlooted | contested | looted
}
```

### Loot Mechanics
- **Drop Phase**: Crates spawn in arena at random locations
- **Contest Phase**: Squads compete to reach crate first (PvP movement)
- **Loot Phase**: Winning squad gains exclusive access (2-5 min timer starts)
- **Validation Phase**: Squad analyzes evidence, submits verdict

**Key Design Decision**: Only the **winning squad** gets crate access. This creates competition (PvP) but also ensures focused validation (no crowd noise).

---

## 3. PvP Crate Control

### How PvP Works
Truth Hunt replaces "kill" with "validate" — but the competitive structure mirrors battle royale.

### Squad Formation
- **Auto-matchmaking**: ELO-based pairing (similar skill levels)
- **Manual squads**: Invite friends (permanent squad, Phase 1)
- **Squad size**: 3-5 validators per squad

### Arena Layout
```
Arena (1000x1000 virtual grid)
┌─────────────────────────────────────┐
│  [Crate A]                          │
│         [Squad 1] → moving →        │
│                                     │
│        [Squad 2] ← moving ←         │
│                  [Crate B]          │
│                                     │
│  [Crate C]           [Crate D]      │
└─────────────────────────────────────┘
```

### Contest Mechanics
- **Movement**: Squad moves toward crate (tap-to-move or joystick)
- **Proximity**: First squad within 50m radius gains "contest lock"
- **Lock duration**: 10 seconds (other squads can challenge)
- **Challenge**: Tap "Challenge" → mini-game (quick validation quiz)
- **Winner**: Squad with fastest accurate answer wins crate

**Alternative (Simpler)**: First to arrive wins (no mini-game). Use mini-game only for high-stakes crates.

### Squad Chat
- **Enabled**: During loot + validation phase
- **Disabled**: During contest phase (prevents coordination with enemies)
- **Features**: Text chat, ping system (mark crate on map), emoji reactions

---

## 4. Validation Interface

### Verdict Submission
After looting a crate, squad submits a verdict:

```
ValidatorVerdict {
  crate_id: UUID
  verdict: genuine | fake | incomplete
  confidence: Float (0.0 - 1.0, slider)
  reason_note: String (optional, max 500 chars)
  submitted_by: UUID (validator who submitted)
  squad_id: UUID
  timestamp: DateTime
}
```

### Confidence Slider
- **Range**: 0% (unsure) to 100% (certain)
- **Impact**: Higher confidence = higher reward if correct, higher penalty if wrong
- **Strategy**: Conservative (low confidence, safe reward) vs. Aggressive (high confidence, high risk/reward)

### Reason Note
- Optional but encouraged (provides context for consensus)
- AI summarizes notes for other validators (anonymized)
- Best notes featured on leaderboard

### Timer Mechanics
- **Loot timer**: 2-5 minutes (based on mission urgency)
- **Warning**: 30-second countdown audio cue
- **Auto-submit**: If timer expires, verdict = "incomplete" (partial XP)

---

## 5. Consensus & Verdict Engine

### How Consensus Works
After all squads submit verdicts for a crate:

1. **Aggregate verdicts** (genuine/fake/incomplete)
2. **Apply trust weights** (based on validator rank, accuracy, confidence)
3. **Determine winning verdict** (majority by trust weight)
4. **Distribute rewards** (to validators in winning consensus)

### Trust-Weighted Voting
```
final_verdict = argmax(verdict_type, sum(trust_weight for validators who voted verdict_type))

Where:
trust_weight = rank_multiplier × historical_accuracy × confidence_weight
```

(See dedicated **Trust-Weighted Consensus Formula** document for full specification)

### Web Validator Fusion
- Web validators (PoPP L4) also validate the same evidence
- Their verdicts are merged with game validator verdicts
- **Weight cap**: Web validators max 2x game validator weight (prevents domination)
- **Final consensus**: Combined game + web verdict anchored on-chain

### Dispute Window
- After consensus, 72-hour dispute window opens
- Any validator can challenge consensus (stake CT)
- Dispute resolved by expert DAO or Validator Court (Phase 3)

---

## 6. XP, Rank & Reputation

### XP System
```
XP Events:
- Aligned validation: +50 XP
- Early consensus bonus: +25 XP (first 30% to submit)
- Squad leadership win: +100 XP
- Misaligned validation: +10 XP (participation)
- Dispute won: +150 XP
- Redemption quest complete: +75 XP
```

### Rank Progression
| Rank | XP Required | Benefits |
|------|-------------|----------|
| Civic Trainee | 0 | Basic tools, low-stakes missions |
| District Sentinel | 1,000 XP | Geo-Radar access, medium-stakes missions |
| Truth Strategist | 5,000 XP | AI Insight Lens+, leadership roles |
| Dharma Warrior | 20,000 XP | Satya Shield, DAO proposal creation |

### Reputation Engine
```
Reputation score: 0.0 - 100.0

Boosts:
- Aligned validation: +0.5
- Early consensus: +0.3
- Leadership win: +1.0
- Dispute won: +2.0
- Redemption quest: +1.5

Decay:
- Misaligned validation: -1.0
- Dispute lost: -3.0
- Inactive (per week): -0.5
```

**Reputation Thresholds**:
- 80-100: "Trusted Validator" badge, DAO voting weight 1.5x
- 50-79: Normal status
- 20-49: "Probation" status, reduced rewards
- 0-19: "Restricted" status, can only access Redemption Quests

---

## 7. Tool System (Lootables)

### AI Insight Lens
- **Function**: Highlights suspicious data in evidence
- **Basic (Free)**: EXIF analysis, reverse image hash check
- **Advanced (100 CT)**: Deep manipulation detection, cross-source verification
- **Cooldown**: 1 use per mission (basic), 2 uses (advanced)

### Geo-Radar
- **Function**: Historical overlays, prior case comparison
- **Cost**: 50 CT per mission
- **Shows**: Map of similar past events in region
- **Cooldown**: 1 use per mission

### Memory Pulse
- **Function**: Past validators' consensus notes
- **Cost**: 75 CT per mission
- **Shows**: Anonymized notes from previous validations of similar cases
- **Cooldown**: 1 use per mission

### Satya Shield
- **Function**: Penalty immunity if justified
- **Cost**: 200 CT
- **Use case**: High-confidence verdict on ambiguous evidence
- **Cooldown**: 1 use per 5 missions

---

## 8. Offline Mode

### Design Principles
- **Offline is default**, not exception (India tier-2/3 cities)
- **Prefetch**: Evidence crates downloaded when mission drops
- **Local AI**: TensorFlow Lite runs on-device
- **Queue**: Verdicts stored locally, sync when online

### Offline Flow
```
1. Mission drop notification (includes crate metadata)
2. Client downloads crate evidence (media + AI clues)
3. AI inference runs locally (manipulation detection, etc.)
4. Validator analyzes evidence offline
5. Verdict stored in local queue
6. On reconnect: queue synced to server
7. If mission still active → verdict included in consensus
8. If mission expired → partial XP granted, archived
```

### Sync Conflicts
- **Server truth wins** for timer state (mission expiration)
- **Client truth wins** for verdict content (what validator submitted)
- **Conflict resolution**: Timestamp-based (earlier submission wins if duplicate)

---

## 9. Narrative & Emotional Layer

### NPC Characters
- **Witness**: Provides context for evidence (e.g., "I was there when this happened")
- **Whistleblower**: Leaks hidden data (e.g., "Here's the official report they don't want you to see")
- **Data Monk**: AI guide (e.g., "Look closely at the EXIF data — something's off")

### Story Campaigns
- **Example**: "The Water War of 2027"
- **Structure**: 5 missions, progressive difficulty, narrative arc
- **Outcome**: Real-world impact (e.g., "This stopped a riot")

### Emotional Design
- **Tone**: Serious but hopeful (civic impact, not violence)
- **Visuals**: Muted colors, focus on evidence (not gore)
- **Sound**: Tense but not aggressive (investigation, not combat)

---

## 10. Anti-Cheat & Fair Play

### Device Fingerprint
- Unique device ID (hardware + OS signature)
- Prevents multi-accounting on same device
- **Limitation**: Can be spoofed (combine with behavioral analysis)

### Behavioral Biometrics
- Typing patterns, touch gestures, navigation speed
- Detects bot-like behavior (too fast, too consistent)
- Flags suspicious accounts for manual review

### Rate Limiting
- Max 10 missions per day per validator
- Max 1 dispute per week per validator
- Cooldown between missions (5 minutes)

### CAPTCHA (Optional)
- Triggered if behavioral analysis flags suspicious activity
- Simple puzzle (not intrusive)
- Failed CAPTCHA → account locked for 24h

---

## Summary

Truth Hunt's game mechanics are designed to:
1. **Engage** through competition (PvP crate control)
2. **Educate** through tools (AI Insight Lens, Geo-Radar)
3. **Reward** accuracy over volume (trust-weighted consensus)
4. **Retain** through progression (XP, rank, reputation)
5. **Protect** through anti-cheat (device fingerprint, behavioral analysis)

The balance between fun and civic purpose is delicate. Every mechanic should be tested against the **core metric**: **Validation Accuracy Rate**. If a mechanic improves fun but reduces accuracy, iterate. If it improves accuracy but reduces fun, simplify.
