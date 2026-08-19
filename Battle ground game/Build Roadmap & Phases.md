# Truth Hunt: Build Roadmap & Phases

## Overview

This document defines the phased build plan for Truth Hunt, from MVP to full ecosystem. The roadmap prioritizes **core gameplay loop first**, then layers on trust mechanisms, ecosystem integration, and scale features.

**Total estimated timeline**: 12-18 months to full ecosystem
**MVP timeline**: 3 months
**Key principle**: Ship early, iterate based on validator behavior and accuracy metrics.

---

## Phase 1: Core Loop MVP (Months 1-3)

### Goal
Validate the core gameplay loop: **Drop → Loot → Validate → Win**

### Scope

| Chapter | Status | Implementation Notes |
|---------|--------|---------------------|
| Ch. 1-2: Concept | ✅ Keep | Core narrative, minimal UI |
| Ch. 3: Arena | 🔧 Simplified | Single mission type (fake news), no region matching |
| Ch. 4: Toolkit | 🔧 Simplified | 2 tools only: AI Insight Lens (basic) + manual review |
| Ch. 5: Truth Battle | ✅ Keep | PvP crate control is the core mechanic |
| Ch. 6: Verdict | 🔧 Simplified | Verdict only, no on-chain write (mock consensus) |
| Ch. 7: XP & Rank | 🔧 Simplified | XP tracking + 2 ranks only (Trainee, Sentinel) |
| Ch. 8: Offline Mode | ✅ Keep | Offline queue from day 1 (critical for India) |
| Ch. 14: Anti-Cheat | 🔧 Simplified | Device fingerprint only, no zkID |
| Ch. 17: Onboarding | 🔧 Simplified | 3 tutorial missions, no SBT certificate |

### Deliverables

**Backend**:
- [ ] Truth Mission API (basic mission creation)
- [ ] Crate Distribution Engine (static crate generation)
- [ ] AI Insight Layer (server-side only, basic fake detection)
- [ ] WebSocket server (Socket.io) for real-time multiplayer
- [ ] Matchmaking (random pairing, no ELO yet)
- [ ] Consensus Engine (mock, game-only verdicts)
- [ ] Validator XP System (basic tracking)
- [ ] SQLite local storage for offline queue

**Mobile Client**:
- [ ] Lobby screen (mission list)
- [ ] Arena UI (crate loot, validation interface)
- [ ] Verdict submission (confidence slider + reason note)
- [ ] Profile screen (XP, rank, accuracy rate)
- [ ] Offline indicator + sync status
- [ ] Basic tutorial (3 guided missions)

**Infrastructure**:
- [ ] Single Socket.io server
- [ ] PostgreSQL for game state
- [ ] Redis for pub/sub
- [ ] Basic monitoring (uptime, active users)

### Success Metrics
- 500+ validators complete onboarding
- 70%+ complete first 3 missions
- Average mission completion time < 8 minutes
- Validation accuracy rate > 65%

### Risk Mitigation
- **Risk**: Multiplayer latency issues
  - **Mitigation**: Start with async "missions" (not real-time PvP) if WebSocket unstable
- **Risk**: Low accuracy rate
  - **Mitigation**: Simplify evidence crates (fewer items, clearer AI clues)
- **Risk**: Offline sync conflicts
  - **Mitigation**: Server truth wins for timer state, partial XP for expired missions

---

## Phase 2: Trust Layer (Months 4-5)

### Goal
Build the trust and consensus mechanisms that make Truth Hunt a **civic tool**, not just a game.

### Scope

| Chapter | Status | Implementation Notes |
|---------|--------|---------------------|
| Ch. 6: Verdict | ✅ Full | On-chain anchoring, trust-weighted consensus |
| Ch. 7: XP & Rank | ✅ Full | All 4 ranks, DAO voting weight |
| Ch. 10: PoPP Fusion | ✅ Full | Web + game validator fusion |
| Ch. 14: Anti-Cheat | ✅ Full | Device fingerprint + behavioral analysis |
| Ch. 15: Reputation | ✅ Full | Decay, recovery, redemption quests |

### Deliverables

**Backend**:
- [ ] Consensus Engine: trust-weighted formula (see dedicated document)
- [ ] On-chain integration: PoPP chain writes, SBT minting
- [ ] Web validator API: bridge between PoPP web and game validators
- [ ] Reputation Engine: decay logic, redemption quest system
- [ ] Enhanced anti-cheat: behavioral biometrics, rate limiting
- [ ] ELO-based matchmaking

**Mobile Client**:
- [ ] Rank progression UI (Trainee → Sentinel → Strategist → Warrior)
- [ ] Reputation score display + decay warning
- [ ] Redemption quest interface
- [ ] Web validator fusion dashboard (show both game + web verdicts)

**Infrastructure**:
- [ ] Socket.io cluster with Redis adapter
- [ ] Separate matchmaking service
- [ ] Enhanced monitoring (accuracy rate, reputation distribution)

### Success Metrics
- Validation accuracy rate > 75%
- 30%+ of validators reach District Sentinel rank
- Reputation decay affects <10% of active validators
- On-chain consensus matches game consensus >90% of the time

### Risk Mitigation
- **Risk**: On-chain write latency slows consensus
  - **Mitigation**: Batch writes (aggregate multiple verdicts per transaction)
- **Risk**: Web validators dominate game validators
  - **Mitigation**: Cap web validator weight at 2x game validator weight
- **Risk**: Reputation decay frustrates returning users
  - **Mitigation**: Grace period (7 days inactive before decay starts)

---

## Phase 3: Ecosystem Expansion (Months 6-8)

### Goal
Layer on advanced features that deepen engagement and expand the ecosystem.

### Scope

| Chapter | Status | Implementation Notes |
|---------|--------|---------------------|
| Ch. 9: Crisis Response | ✅ Full | Hot Zone missions, urgency scoring |
| Ch. 16: Dispute Resolution | ✅ Full | Staked disputes, Arbiter roles |
| Ch. 18: Narrative Layer | ✅ Full | NPC characters, story campaigns |
| Ch. 19: DAO Governance | ✅ Full | Validator proposals, voting |
| Ch. 20: Privacy Engine | ✅ Full | Face blurring, geo-fuzzing, trauma filters |

### Deliverables

**Backend**:
- [ ] Hot Zone mission system (urgency-based reward scaling)
- [ ] Dispute resolution protocol (staking, arbitration, NFT roles)
- [ ] Narrative engine (NPC dialogues, campaign progression)
- [ ] DAO governance module (proposal creation, voting, execution)
- [ ] Privacy engine (AI face blurring, geo-fuzzing, content warnings)

**Mobile Client**:
- [ ] Hot Zone mission UI (urgency indicator, enhanced rewards display)
- [ ] Dispute interface (challenge consensus, stake CT, track outcome)
- [ ] NPC dialogue system (story-driven campaigns)
- [ ] DAO governance screen (proposals, voting, results)
- [ ] Privacy settings (blur preferences, content filters)

**Infrastructure**:
- [ ] Sharded arena servers (by region)
- [ ] Dedicated consensus computation cluster
- [ ] CDN for media distribution (AWS CloudFront)
- [ ] AI inference optimization (TensorFlow Lite on-device)

### Success Metrics
- 5,000+ active validators
- 20%+ participation in DAO governance
- Dispute rate <5% of missions
- Privacy engine processes 100% of sensitive media

### Risk Mitigation
- **Risk**: DAO governance too complex for casual users
  - **Mitigation**: Pre-built proposal templates, guided voting UI
- **Risk**: Disputes create toxicity
  - **Mitigation**: Cap disputes at 1 per validator per week
- **Risk**: Privacy engine slows down mission flow
  - **Mitigation**: Async processing (mission starts immediately, privacy applied in background)

---

## Phase 4: Scale & Esports (Months 9-12+)

### Goal
Scale to mass adoption and explore esports/entertainment layer.

### Scope

| Chapter | Status | Implementation Notes |
|---------|--------|---------------------|
| Ch. 12: Truth Esports | ✅ Full | Streaming, sponsorships, tournaments |
| Ch. 21: NGO/Gov Bridge | ✅ Full | External API, real-world impact |
| Ch. 3: Arena (Full) | ✅ Full | All mission types, region matching |
| Ch. 4: Toolkit (Full) | ✅ Full | All tools unlocked, advanced AI |

### Deliverables

**Backend**:
- [ ] Streaming infrastructure (broadcast live arenas)
- [ ] Sponsorship management system (district contracts, branding)
- [ ] Tournament engine (brackets, prizes, leaderboards)
- [ ] NGO/Gov API (validated problem push, mission funding)
- [ ] All mission types (flood, riot, fake news, infrastructure, health)
- [ ] Region-based matchmaking (zone-aware pairing)

**Mobile Client**:
- [ ] Spectator mode (watch live arenas)
- [ ] Tournament bracket UI
- [ ] Sponsor-branded mission UI
- [ ] NGO impact dashboard (see real-world outcomes)

**Infrastructure**:
- [ ] Edge computing for AI inference (reduce latency)
- [ ] Blockchain sidechain for game-specific transactions
- [ ] NFT marketplace infrastructure
- [ ] Horizontal auto-scaling on mission drops

### Success Metrics
- 50,000+ active validators
- 10+ district sponsorships
- 5+ NGO partnerships
- 1,000+ concurrent spectators during tournaments

### Risk Mitigation
- **Risk**: Esports overshadows civic mission
  - **Mitigation**: Keep civic impact front-and-center in streaming UI
- **Risk**: Sponsorship influence corrupts mission integrity
  - **Mitigation**: Sponsor can fund but cannot influence mission content
- **Risk**: Infrastructure costs explode at scale
  - **Mitigation**: Introduce premium features (cosmetics, spectator perks) to offset costs

---

## Milestone Summary

| Milestone | Timeline | Key Deliverable | Success Metric |
|-----------|----------|-----------------|----------------|
| **MVP** | Month 3 | Core gameplay loop | 500+ validators, 65%+ accuracy |
| **Trust Layer** | Month 5 | On-chain consensus | 75%+ accuracy, 30%+ rank progression |
| **Ecosystem** | Month 8 | DAO + disputes + narrative | 5,000+ validators, 20%+ DAO participation |
| **Scale** | Month 12 | Esports + NGO bridge | 50,000+ validators, 10+ sponsorships |

---

## Resource Requirements

### Phase 1 (MVP)
- **Backend**: 2 Rust developers (Actix Web), 1 Python developer (AI)
- **Mobile**: 2 React Native developers
- **Design**: 1 UI/UX designer
- **Infrastructure**: 1 DevOps (part-time)
- **Total**: 6-7 people

### Phase 2 (Trust Layer)
- **Backend**: +1 blockchain developer (Cosmos SDK)
- **Mobile**: Same as Phase 1
- **Design**: Same as Phase 1
- **Infrastructure**: 1 DevOps (full-time)
- **Total**: 7-8 people

### Phase 3 (Ecosystem)
- **Backend**: +1 full-stack developer (DAO, narrative)
- **Mobile**: +1 developer (privacy engine, dispute UI)
- **Design**: +1 designer (narrative, NPC art)
- **Infrastructure**: Same as Phase 2
- **Total**: 9-10 people

### Phase 4 (Scale)
- **Backend**: +2 developers (streaming, marketplace)
- **Mobile**: Same as Phase 3
- **Design**: Same as Phase 3
- **Infrastructure**: +1 DevOps (edge computing, scaling)
- **Business**: 1 partnership manager (NGO/sponsors)
- **Total**: 12-14 people

---

## Critical Path

The **critical path** (longest sequence of dependent tasks):

```
Month 1-3: Core gameplay loop (MVP)
    ↓
Month 4-5: On-chain consensus + web validator fusion
    ↓
Month 6-8: DAO governance + dispute resolution
    ↓
Month 9-12: Esports + NGO bridge
```

**Parallel workstreams**:
- AI Insight Layer (can be developed independently)
- Privacy engine (can be developed independently)
- Narrative layer (can be developed independently)

---

## Decision Points

### After Phase 1 (MVP)
- **Go/No-Go**: Is validation accuracy >65%?
  - If **Yes**: Proceed to Phase 2
  - If **No**: Iterate on game mechanics (simplify crates, improve AI clues)

### After Phase 2 (Trust Layer)
- **Go/No-Go**: Is on-chain consensus matching game consensus >90%?
  - If **Yes**: Proceed to Phase 3
  - If **No**: Adjust trust-weighted formula, cap web validator influence

### After Phase 3 (Ecosystem)
- **Go/No-Go**: Are 5,000+ validators active?
  - If **Yes**: Proceed to Phase 4
  - If **No**: Focus on retention (improve rewards, reduce friction)

---

## Post-Launch Iteration

After Phase 4, shift from **phased builds** to **continuous iteration**:
- 2-week sprint cycles
- Feature prioritization based on validator feedback
- A/B testing for game mechanics (reward structures, timer lengths)
- Community proposals via DAO drive feature roadmap

**Key principle**: The roadmap is a **living document**. Adjust based on data, not assumptions.
