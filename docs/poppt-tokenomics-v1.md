# PoPP v1 Tokenomics Specification

**Version:** 1.0  
**Status:** Frozen  
**Date:** 2026-02-07  
**Max Supply:** 100,000,000 POPS (Immutable)

---

## Executive Summary

PoPP (Proof of Problem) v1 tokenomics implements a **utility-driven scarcity model** that combines:

- **Hard supply cap** (100M POPS, immutable at protocol level)
- **Quality-weighted rewards** (sqrt diminishing returns)
- **Three-currency separation** (XP, R-Score, POPS)
- **Real revenue loop** (organizational fees → contributor rewards)
- **Anti-gaming by design** (reputation-gated access)

This specification defines the complete economic model for PoPP protocol, including token allocation, reward algorithms, quality thresholds, and emission schedules.

---

## Core Philosophy

### Principle: Scarcity + Utility + Real Demand

**NOT:** "Make POPS scarce faster than Bitcoin"  
**BUT:** "Make POPS scarce while making PoPP increasingly useful"

### Three Separate Things

| Component | Can Design? | Notes |
|-----------|-------------|-------|
| **Token Emissions** | ✅ Yes | Protocol-controlled |
| **Demand** | ❌ No | Must be earned by protocol |
| **Price** | ❌ No | Market-determined |

**Critical:** Never promise price appreciation. Only design scarcity + utility.

---

## Token Allocation (100M Max Supply)

### Immutable Distribution

| Allocation | POPS | Percentage | Vesting | Purpose |
|------------|------|------------|---------|---------|
| **Contributor Rewards** | 30,000,000 | 30% | Dynamic | Scouts, validators, resolvers |
| **Community Ecosystem** | 20,000,000 | 20% | 2 years | Grants, bounties, partnerships |
| **Treasury** | 15,000,000 | 15% | Immediate | Protocol operations, fees |
| **Team** | 10,000,000 | 10% | 4 years | Founders, developers |
| **Investors** | 5,000,000 | 5% | 2 years | Early backers |
| **Liquidity** | 5,000,000 | 5% | Immediate | Market making, exchanges |
| **Foundation/Reserve** | 5,000,000 | 5% | 4 years | Emergency, future use |
| **Unallocated** | 10,000,000 | 10% | DAO-controlled | Future use |
| **TOTAL** | **100,000,000** | **100%** | | |

### Hard Constraints

```rust
MAX_SUPPLY = 100_000_000 POPS  // Immutable at protocol level
CONTRIBUTOR_CAP = 30_000_000 POPS  // Hard ceiling
```

**Protocol-level enforcement:** Reward engine cannot mint beyond remaining allocation.

---

## Three-Currency System

### Separation of Concerns

| System | Purpose | Transferable? | Supply | Farmable? |
|--------|---------|---------------|--------|-----------|
| **XP** | Gaming/progression | ❌ No | Unlimited | ❌ No |
| **R-Score** | Trust/validator reputation | ❌ No | Unlimited | ❌ No |
| **POPS** | Economic/protocol utility | ✅ Yes | 100M (hard cap) | ❌ No (quality-gated) |

### Player Flow (Anti-Gaming by Design)

```
Game/Missions
      ↓
     XP (unlimited, non-transferable)
      ↓
   R-Score (reputation, non-transferable)
      ↓
  Eligibility (access to valuable work)
      ↓
Verified Work (quality-gated)
      ↓
   POPS (scarce, transferable, valuable)
```

**Critical:** Can't buy reputation with POPS. Can't farm POPS without reputation.

---

## Reward Algorithm (Locked)

### Formula

```rust
Reward_Score = sqrt(Verified_Work) 
             × Quality_Score 
             × Need_Multiplier 
             × Reputation_Multiplier
```

### Diminishing Returns (sqrt)

**Problem:** High-volume, low-quality validators shouldn't dominate.

**Solution:** Square root diminishing returns on volume.

```rust
Effective_Work = sqrt(Verified_Work)

// Example: Validator A vs B

// Validator A: 10,000 validations, quality 0.30
sqrt(10,000) × 0.30 = 100 × 0.30 = 30 reward score

// Validator B: 500 validations, quality 0.95
sqrt(500) × 0.95 = 22.36 × 0.95 = 21.2 reward score

// Result: 20× more work → only 1.4× more rewards
```

### Quality Threshold (Anti-Gaming)

```rust
if Quality_Score < 0.60 {
    POPS_Reward = 0
    R_Score -= 20  // Penalty
} else {
    POPS_Reward = Reward_Score × allocation_factor
    R_Score += bonus  // Based on quality tier
}
```

**Incentive:** "Don't validate more. Validate correctly."

---

## Quality Engine

### Quality Score Components

```rust
Quality_Score = (
    Accuracy × 0.40 +           // Correct validations
    Evidence_Quality × 0.30 +   // Good evidence provided
    Consensus_Agreement × 0.20 + // Aligns with other validators
    Timeliness × 0.10            // Fast response
)
```

### Quality Tiers

| Quality Score | Tier | Reward Multiplier | R-Score Change |
|---------------|------|-------------------|----------------|
| 0.90 - 1.00 | Excellent | 1.5× | +10 |
| 0.75 - 0.89 | Good | 1.0× | +5 |
| 0.60 - 0.74 | Acceptable | 0.7× | +0 |
| < 0.60 | Poor | 0.0× | -20 |

### Minimum Threshold

**Quality < 0.60:**
- No POPS reward
- R-Score decreases
- Reduced eligibility for future work

**Rationale:** Creates strong incentive for accuracy over quantity.

---

## Emission Formula

### Dynamic Emissions with Hard Cap

```rust
Annual_Emission = MIN(
    Base_Emission × Activity_Factor × Quality_Factor,
    Remaining_Contributor_Allocation  // 30M hard cap
)
```

### Emission Schedule (Example)

| Year | Base Emission | Activity Factor | Quality Factor | Calculated | Actual (MIN) |
|------|---------------|-----------------|----------------|------------|--------------|
| Year 1 | 10,000,000 | 1.2 | 1.1 | 13,200,000 | 13,200,000 |
| Year 2 | 1,000,000 | 1.5 | 1.3 | 1,950,000 | 1,950,000 |
| Year 3 | 200,000 | 1.8 | 1.5 | 540,000 | 540,000 |
| Year 4 | 60,000 | 2.0 | 1.6 | 192,000 | 192,000 |
| Year 5 | 24,000 | 2.0 | 1.8 | 86,400 | 86,400 |
| **Total** | | | | | **15,968,400** |

**Note:** Actual emissions depend on network activity and quality. Hard cap ensures never exceeds 30M.

---

## Economic Loop

### Real Revenue Model

```
Contributors (Scouts/Validators/Resolvers)
      ↓
Verified Civic Data
      ↓
Organizations / API Users
      ↓
Fees (Real Revenue)
      ↓
Treasury
      ↓
Future Rewards
```

### Revenue Sources

1. **Protocol Fees:** Organizations pay for verified data access
2. **API Access:** Premium API endpoints for enterprises
3. **Transaction Fees:** 2% on all POPS transfers
4. **Premium Features:** Paid dashboard, analytics, reports

### Fee Recycling

```rust
// Example: Organization pays $10,000 for data access
Fee = $10,000
Treasury_Cut = 70%  // $7,000
Reward_Pool = 30%   // $3,000

// Reward pool distributed to contributors based on Reward_Score
```

**Critical:** No buybacks in v1. Focus on real revenue, not speculation.

---

## Anti-Gaming Measures

### 1. Quality Threshold

- Minimum 0.60 quality score required for rewards
- Poor quality → R-Score penalty → reduced eligibility
- Incentive: Accuracy over quantity

### 2. Reputation Gating

- R-Score controls access to valuable work
- Can't buy reputation with POPS
- Must earn through quality contributions

### 3. Diminishing Returns

- sqrt() function prevents volume domination
- 10× more work → only ~3× more rewards
- Incentive: Quality over quantity

### 4. Three-Currency Separation

- XP (unlimited, non-transferable) → Gaming
- R-Score (unlimited, non-transferable) → Reputation
- POPS (100M cap, transferable) → Economic value

**Can't game the system by converting between currencies.**

### 5. Protocol-Level Caps

- 100M max supply (immutable)
- 30M contributor cap (hard ceiling)
- Reward engine can't mint beyond allocation

---

## Implementation Architecture

### Smart Contract Layers

```
┌─────────────────────────────────────┐
│      Protocol Layer (Immutable)      │
│  - 100M max supply                  │
│  - 30M contributor cap              │
│  - Token allocation                 │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Reward Engine (Dynamic)         │
│  - sqrt() diminishing returns       │
│  - Quality scoring                  │
│  - Emission formula (MIN)           │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Quality Engine (Locked)         │
│  - Accuracy, evidence, consensus    │
│  - Quality tiers (0.60 threshold)   │
│  - R-Score adjustments              │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│      Three-Currency System           │
│  - XP (unlimited, non-transferable) │
│  - R-Score (unlimited, non-trans.)  │
│  - POPS (100M cap, transferable)    │
└─────────────────────────────────────┘
```

### Data Structures

```rust
struct Contributor {
    address: Address,
    xp: u64,                    // Unlimited, non-transferable
    r_score: i64,               // Can decrease, non-transferable
    pops_balance: u64,          // Transferable, capped
    verified_work: u64,         // Total validations
    quality_scores: Vec<f64>,   // History
    eligibility_tier: Tier,     // Based on R-Score
}

struct ValidationResult {
    contributor: Address,
    problem_id: UUID,
    quality_score: f64,         // 0.0 - 1.0
    accuracy: f64,
    evidence_quality: f64,
    consensus_agreement: f64,
    timeliness: f64,
    timestamp: u64,
}

struct RewardCalculation {
    verified_work: u64,
    effective_work: f64,        // sqrt(verified_work)
    quality_score: f64,
    need_multiplier: f64,
    reputation_multiplier: f64,
    reward_score: f64,
    pops_reward: u64,
    rscore_change: i64,
}
```

---

## Implementation Roadmap

### Phase 1: Lock Algorithm (Week 1-2)

**Before writing smart contract:**

- [ ] Finalize reward formula (sqrt diminishing returns)
- [ ] Define quality thresholds (0.60 minimum)
- [ ] Specify R-Score mechanics (bonus/penalty)
- [ ] Document emission formula (MIN() cap)
- [ ] Create test vectors (Validator A vs B examples)
- [ ] Economic simulation (5-year projection)

### Phase 2: Smart Contract Development (Week 3-6)

- [ ] Implement 100M hard cap (protocol-level, immutable)
- [ ] Deploy reward engine (with MIN() formula)
- [ ] Create quality engine (scoring system)
- [ ] Build XP/R-Score/POPS separation
- [ ] Add emission controls (30M contributor cap)
- [ ] Implement fee recycling mechanism

### Phase 3: Testing & Audit (Week 7-10)

- [ ] Unit tests (reward formula accuracy)
- [ ] Integration tests (quality engine)
- [ ] Economic simulations (5-year projection)
- [ ] Security audit (smart contract)
- [ ] Legal review (token classification, app store compliance)

### Phase 4: Deployment (Week 11-12)

- [ ] Deploy to testnet
- [ ] Beta testing (validators, scouts)
- [ ] Monitor emissions, quality, R-Score
- [ ] Mainnet launch
- [ ] Ongoing monitoring

---

## Legal Considerations

### Critical: Before Launch

**Must complete before mainnet:**

1. **Legal Review:** Is POPS a security?
   - Howey Test analysis
   - Utility vs. security classification
   - Jurisdiction-specific requirements

2. **Google Play Crypto Policy:** Compliant with app store rules?
   - Token issuance rules
   - Earning mechanisms
   - Transfer restrictions

3. **Marketing Review:** No price promises?
   - Remove all "price appreciation" claims
   - Focus on utility + scarcity
   - Disclaimers where required

4. **Transfer Restrictions:** KYC/AML requirements?
   - Identity verification
   - Sanctions screening
   - Transaction monitoring

### Disclaimer

**Tokenomics can be technically sound while still creating regulatory or app-store issues depending on how POPS is issued, marketed, transferred, and used.**

**Consult legal counsel before mainnet launch.**

---

## Economic Projections (5-Year)

### Conservative Scenario

| Year | Active Users | Emissions | Treasury Revenue | Treasury Balance | Token Price* |
|------|--------------|-----------|------------------|------------------|--------------|
| Year 1 | 10,000 | 13.2M | $500K | 15M + revenue | $0.01 - $0.05 |
| Year 2 | 50,000 | 1.95M | $2M | 15M + revenue | $0.05 - $0.20 |
| Year 3 | 150,000 | 0.54M | $5M | 15M + revenue | $0.20 - $1.00 |
| Year 4 | 300,000 | 0.19M | $10M | 15M + revenue | $1.00 - $5.00 |
| Year 5 | 500,000 | 0.09M | $20M | 15M + revenue | $5.00 - $20.00 |

*Price ranges are illustrative only, not promises. Actual price determined by market.

### Key Metrics

- **Total Emissions (5 years):** ~16M POPS (of 30M cap)
- **Treasury Growth:** Sustainable via real revenue
- **User Growth:** Exponential (network effects)
- **Token Scarcity:** Increases over time (99% reduction by Year 5)

---

## Governance & Upgrades

### Immutable Components (Cannot Change)

- 100M max supply
- 30M contributor cap
- Token allocation percentages
- Three-currency separation

### Adjustable Components (DAO-Controlled)

- Emission schedule (within 30M cap)
- Quality thresholds (minimum 0.60)
- Fee percentages
- Treasury allocation

### Upgrade Process

1. **Proposal:** DAO member submits proposal
2. **Discussion:** 7-day discussion period
3. **Vote:** Quadratic voting (R-Score weighted)
4. **Execution:** If passed, smart contract upgrade
5. **Deployment:** 48-hour timelock

---

## Success Metrics

### Year 1 Targets

- [ ] 10,000 active contributors
- [ ] 1,000,000 problems verified
- [ ] Average quality score: 0.75+
- [ ] Treasury revenue: $500K+
- [ ] Token liquidity: $1M+

### Year 3 Targets

- [ ] 150,000 active contributors
- [ ] 50,000,000 problems verified
- [ ] Average quality score: 0.80+
- [ ] Treasury revenue: $5M+
- [ ] Token liquidity: $10M+

---

## Conclusion

PoPP v1 tokenomics implements a **utility-driven scarcity model** that:

- ✅ Creates real value through verified civic data
- ✅ Rewards quality over quantity
- ✅ Prevents gaming through reputation-gating
- ✅ Ensures sustainability via real revenue
- ✅ Maintains scarcity through hard caps
- ✅ Provides equal opportunity (quality-based, not time-based)

**This is not a get-rich-quick scheme.** It's a sustainable economic model that rewards genuine contribution to civic infrastructure verification.

**The strongest idea isn't "make POPS scarce faster than Bitcoin."**  
**It's: "Make POPS scarce while simultaneously making PoPP increasingly useful."**

---

## Appendix A: Test Vectors

### Validator Comparison

```rust
// Validator A: High volume, low quality
let a = Contributor {
    verified_work: 10_000,
    quality_score: 0.30,
    r_score: 500,
};

let a_effective_work = (10_000_f64).sqrt(); // 100
let a_reward_score = 100 * 0.30; // 30
let a_pops_reward = 30 * ALLOCATION_FACTOR;

// Validator B: Low volume, high quality
let b = Contributor {
    verified_work: 500,
    quality_score: 0.95,
    r_score: 500,
};

let b_effective_work = (500_f64).sqrt(); // 22.36
let b_reward_score = 22.36 * 0.95; // 21.2
let b_pops_reward = 21.2 * ALLOCATION_FACTOR;

// Result: A earns 1.4× more than B (not 20× more!)
```

### Quality Threshold Test

```rust
// Poor quality validator
let c = Contributor {
    verified_work: 1000,
    quality_score: 0.50, // Below 0.60 threshold
    r_score: 500,
};

if c.quality_score < 0.60 {
    assert_eq!(c.pops_reward, 0);
    assert_eq!(c.r_score_change, -20); // Penalty
}

// Result: No rewards, R-Score decreases
```

---

## Appendix B: Glossary

| Term | Definition |
|------|------------|
| **POPS** | Protocol token, 100M max supply, transferable |
| **XP** | Experience points, unlimited, non-transferable, for gaming |
| **R-Score** | Reputation score, unlimited, non-transferable, for trust |
| **Quality Score** | 0.0 - 1.0, measures validation accuracy |
| **Reward Score** | sqrt(work) × quality × need × reputation |
| **Emission** | New POPS created according to schedule |
| **Treasury** | Protocol-owned POPS + fiat revenue |
| **Fee Recycling** | Organizational fees fund future rewards |

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2026-02-07 | Initial frozen specification | PoPP Team |

---

**END OF SPECIFICATION**
