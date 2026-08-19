# Truth Hunt: Token Economy Design

## Overview

The token economy is the financial backbone of Truth Hunt. It must balance **incentivizing participation** with **preventing inflation**, while ensuring new users perceive immediate value. This document defines the complete economic model.

---

## Core Token: CivicToken (CT)

**CivicToken** is the utility token of the Truth Hunt ecosystem. It serves as:
- **Reward** for accurate validation
- **Stake** for disputes and leadership roles
- **Currency** for unlocking tools, gear, and ranks
- **Governance weight** in DAO proposals

---

## Token Inflow (Revenue Sources)

### 1. NGO & Government Missions
- External organizations fund mission reward pools
- Fixed CT allocation per mission based on urgency and scope
- **Example**: Disaster agency funds flood verification mission → 10,000 CT pool

### 2. Validation Fees (Web Validators)
- High-stakes missions require web validators to stake small CT fees
- Fees go into the mission reward pool
- Refunded if validator's verdict aligns with consensus
- **Purpose**: Ensures web validators are committed, not casual

### 3. District Sponsorships (Phase 4)
- Real-world districts/organizations sponsor recurring missions
- Monthly sponsorship contracts (e.g., "Jaipur Truth Hunt Series")
- Sponsor branding on mission UI + leaderboard
- **Revenue model**: Subscription-based for sponsors

### 4. Marketplace Transactions
- NFT gear, avatar skins, validator badges
- Peer-to-peer trading of rare validation artifacts
- Platform takes 5% transaction fee (burned, not collected)
- **Note**: Keep cosmetics minimal; civic impact is the real reward

### 5. Dispute Staking
- Validators stake CT to challenge consensus
- Lost disputes → stake forfeited to winner pool
- Won disputes → stake returned + bonus from loser's stake
- **Deflationary mechanism**: 50% of forfeited stakes are burned

---

## Token Outflow (Rewards & Sinks)

### 1. Validation Rewards
- CT distributed to validators in winning consensus
- **Distribution formula**:
  ```
  validator_reward = (mission_pool × validator_trust_weight) / 
                     total_trust_weight_of_winners
  ```
- Early consensus bonus: +20% for first 30% of validators to submit
- Leadership bonus: +15% for squad lead whose verdict wins

### 2. Rank Unlocks
| Rank | Unlock Cost (CT) | Benefits |
|------|------------------|----------|
| Civic Trainee | 0 (free) | Basic tools, low-stakes missions |
| District Sentinel | 500 CT | Geo-Radar access, medium-stakes missions |
| Truth Strategist | 2,000 CT | AI Insight Lens+, leadership roles |
| Dharma Warrior | 10,000 CT | Satya Shield, DAO proposal creation |

**Note**: Rank costs are **burned** (not transferred), creating deflationary pressure.

### 3. Tool Unlocks
| Tool | Cost (CT) | Type |
|------|-----------|------|
| AI Insight Lens | Free (basic) / 100 CT (advanced) | Consumable per mission |
| Geo-Radar | 50 CT per mission | Consumable |
| Memory Pulse | 75 CT per mission | Consumable |
| Satya Shield | 200 CT | One-time use, penalty immunity |

### 4. Reputation Recovery
- After reputation decay, validators can purchase "Redemption Quests"
- Cost: 150 CT per quest
- Quest completion restores reputation + grants XP
- **Purpose**: Prevents permanent loss of engaged validators

### 5. Dispute Staking (Sink)
- Minimum stake: 100 CT
- Stake locked until dispute resolved (72h window)
- Lost dispute → 100% stake forfeited (50% burned, 50% to winner)
- Won dispute → stake returned + 25% bonus from loser's stake

---

## Inflation Control Mechanisms

### Problem
If every validation mints new tokens, supply grows faster than value. The economy collapses.

### Solutions

#### 1. Fixed Reward Pools (Not Per-Validator)
- Each mission has a **fixed CT pool** (e.g., 5,000 CT)
- Pool is split among winning validators, not minted per person
- **Effect**: More validators = smaller individual rewards, but no inflation

#### 2. Token Burning
- Rank unlock costs → burned
- Marketplace transaction fees → burned
- Dispute forfeit (50%) → burned
- **Target burn rate**: 15-20% of total token supply per year

#### 3. Vesting Schedules
- Tokens earned today → claimable after N validations
- **Schedule**:
  ```
  Validation 1-10:  50% immediate, 50% vested (7 days)
  Validation 11-50: 70% immediate, 30% vested (14 days)
  Validation 51+:   90% immediate, 10% vested (30 days)
  ```
- **Effect**: Prevents immediate sell-off, encourages retention

#### 4. Accuracy-Gated Minting
- Only validators in the **winning consensus** receive minted tokens
- Validators in losing consensus get partial XP but **no CT**
- **Effect**: Rewards accuracy, penalizes spam

#### 5. Dynamic Pool Sizing
- Mission reward pools adjust based on:
  - Mission urgency (higher urgency = larger pool)
  - Validator participation rate (low participation = pool grows to attract more)
  - Historical accuracy rate (low accuracy = pool shrinks to maintain quality)
- **Formula**:
  ```
  pool_size = base_pool × urgency_multiplier × 
              participation_adjustment × accuracy_adjustment
  ```

---

## Early-Adopter Incentives

### Problem
New users may discard joining if perceived rewards are too low, creating a critical growth-risk tension.

### Solutions

#### 1. Founder Validator NFT
- First 10,000 validators receive "Founder Validator" SBT
- **Benefits**:
  - Permanent 1.5x reward multiplier on all missions
  - Exclusive "Founder" badge on profile
  - Early access to new features (beta testing)
  - Voting weight bonus in DAO (1.2x multiplier)
- **Scarcity**: Limited to 10,000, becomes a status symbol

#### 2. Referral Squads
- Invite friends → form permanent squad
- **Benefits**:
  - Shared bonus pool: +10% CT on all squad missions
  - Referrer gets 5% of referee's earnings for first 30 days
  - Squad leaderboard with exclusive rewards
- **Viral loop**: Incentivizes organic growth

#### 3. Tutorial Bounties
- Complete Truth Academy → guaranteed 200 CT grant
- Complete first 3 missions → additional 300 CT
- **Total onboarding reward**: 500 CT (enough to unlock District Sentinel rank)
- **Effect**: Immediate perceived value, reduces onboarding friction

#### 4. Early Bird Missions
- First 1,000 validators to complete a mission type get 2x rewards
- **Example**: First 1,000 flood validations → 2x CT
- **Effect**: Creates urgency, rewards early participation

#### 5. Progressive Reward Scaling
- Rewards are higher in the early stages to bootstrap the network
- **Scale**:
  ```
  Month 1-3:   2.0x reward multiplier
  Month 4-6:   1.5x reward multiplier
  Month 7-12:  1.2x reward multiplier
  Month 13+:   1.0x (baseline)
  ```
- **Effect**: Incentivizes early adoption, stabilizes as network matures

---

## Token Velocity & Circulation

### Target Metrics
- **Circulating supply**: 60-70% of total supply by Year 2
- **Token velocity**: Average 12 transactions per token per year
- **Holder distribution**: Top 10% hold <30% of supply (decentralized)

### Monitoring
- Dashboard tracking:
  - Daily active validators
  - Average CT earned per validator per month
  - Burn rate vs. mint rate
  - Marketplace transaction volume
  - Dispute frequency and outcomes

### Adjustment Levers
- If inflation > target → increase burn mechanisms (raise rank costs, increase marketplace fees)
- If deflation > target → increase reward pools, reduce vesting periods
- If velocity too low → introduce time-limited events with high rewards
- If velocity too high → increase vesting periods, introduce lock-up incentives

---

## Economic Scenarios

### Scenario 1: High Participation, Low Accuracy
- **Symptom**: Many validators, but consensus is fragmented
- **Response**: 
  - Increase accuracy-gated minting (fewer tokens minted)
  - Introduce "quality bonus" for validators with >80% accuracy
  - Reduce mission pool sizes to maintain token value

### Scenario 2: Low Participation, High Accuracy
- **Symptom**: Few validators, but high consensus alignment
- **Response**:
  - Increase mission pool sizes to attract more validators
  - Introduce "participation bonus" for first 100 validators per mission
  - Reduce rank unlock costs to lower barrier

### Scenario 3: High Participation, High Accuracy
- **Symptom**: Healthy ecosystem, but token supply growing fast
- **Response**:
  - Increase burn mechanisms (raise rank costs, introduce new sinks)
  - Introduce "staking rewards" for long-term holders
  - Expand marketplace with more cosmetic options

### Scenario 4: Low Participation, Low Accuracy
- **Symptom**: Failing ecosystem, token value declining
- **Response**:
  - Emergency reward multiplier (2x for 30 days)
  - Introduce "rescue missions" with guaranteed high rewards
  - Revisit game mechanics (may be too complex or not fun enough)

---

## Governance & Economic Adjustments

The DAO has the power to adjust economic parameters:
- Mission pool sizes
- Rank unlock costs
- Burn rates
- Vesting schedules
- Reward multipliers

**Proposal process**:
1. Any Dharma Warrior can submit an economic adjustment proposal
2. 7-day discussion period
3. 3-day voting period (weighted by rank × reputation)
4. If passed, changes take effect in next mission cycle

**Emergency adjustments**:
- Core team can make temporary adjustments (max 7 days) without DAO vote
- Requires 2/3 team approval
- Must be ratified by DAO within 7 days or reverted

---

## Summary

The CivicToken economy is designed to:
1. **Reward accuracy** over participation volume
2. **Burn tokens** to counteract inflation
3. **Incentivize early adoption** without creating long-term dependency
4. **Empower DAO governance** for sustainable adjustments
5. **Maintain perceived value** for new users through progressive rewards

The balance between fun and financial incentive is delicate. The economy should **enhance** the civic mission, not overshadow it. Validators should be motivated by **impact first, tokens second**.
