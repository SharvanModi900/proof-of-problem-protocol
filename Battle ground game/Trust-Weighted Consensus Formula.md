# Truth Hunt: Trust-Weighted Consensus Formula

## Overview

The consensus formula is the **mathematical heart** of Truth Hunt. It determines how validator verdicts are aggregated into a final truth anchor. The formula must balance:
- **Validator expertise** (rank, historical accuracy)
- **Confidence calibration** (self-assessed certainty)
- **Temporal dynamics** (early consensus = stronger signal)
- **Source diversity** (game vs. web validators)

A naive formula like `weight = rank × accuracy` will get gamed. The formula must be **robust, fair, and DAO-governable**.

---

## Core Formula

```
final_verdict = argmax(verdict_type, Σ trust_weight_i for all validators who voted verdict_type)

Where:
trust_weight_i = base_weight × confidence_weight × recency_bonus × squad_consensus_bonus

And:
base_weight = rank_multiplier × historical_accuracy × reputation_factor
confidence_weight = confidence_level ^ 1.5 (amplifies high confidence, dampens low)
recency_bonus = 1.0 + (0.2 × (1 - submission_order / total_validators))
squad_consensus_bonus = 1.0 + (0.1 × squad_alignment_ratio)
```

---

## Component Breakdown

### 1. Base Weight

```
base_weight = rank_multiplier × historical_accuracy × reputation_factor
```

#### Rank Multiplier
| Rank | Multiplier | Rationale |
|------|-----------|-----------|
| Civic Trainee | 1.0 | Baseline, no bonus |
| District Sentinel | 1.5 | Proven accuracy |
| Truth Strategist | 2.5 | High accuracy + leadership |
| Dharma Warrior | 4.0 | Elite accuracy + DAO trust |

#### Historical Accuracy
```
historical_accuracy = (aligned_validations / total_validations) × accuracy_confidence_factor

Where:
accuracy_confidence_factor = 1.0 - (0.2 × (1 - min(total_validations, 50) / 50))
```

**Effect**: New validators (<50 validations) have a confidence dampener to prevent lucky streaks from dominating.

#### Reputation Factor
```
reputation_factor = 0.5 + (reputation_score / 200)

Where:
reputation_score: 0.0 - 100.0
```

**Effect**: Reputation ranges from 0.5 (score 0) to 1.0 (score 100), creating a ±50% adjustment.

**Example**:
- Civic Trainee, 80% accuracy, 60 reputation:
  ```
  base_weight = 1.0 × 0.8 × (0.5 + 60/200) = 1.0 × 0.8 × 0.8 = 0.64
  ```
- Dharma Warrior, 95% accuracy, 90 reputation:
  ```
  base_weight = 4.0 × 0.95 × (0.5 + 90/200) = 4.0 × 0.95 × 0.95 = 3.61
  ```

---

### 2. Confidence Weight

```
confidence_weight = confidence_level ^ 1.5

Where:
confidence_level: 0.0 - 1.0 (validator's self-assessed certainty)
```

**Effect**: Amplifies high confidence, dampens low confidence.

**Examples**:
- 100% confidence → 1.0^1.5 = 1.0 (full weight)
- 80% confidence → 0.8^1.5 = 0.72 (72% weight)
- 50% confidence → 0.5^1.5 = 0.35 (35% weight)
- 20% confidence → 0.2^1.5 = 0.09 (9% weight)

**Rationale**: Validators who are uncertain should have less influence. The exponent (1.5) can be tuned by DAO.

---

### 3. Recency Bonus

```
recency_bonus = 1.0 + (0.2 × (1 - submission_order / total_validators))

Where:
submission_order: 1-based index (1 = first to submit)
total_validators: Total number of validators who submitted
```

**Effect**: Early validators get up to 20% bonus.

**Examples** (10 validators):
- 1st to submit → 1.0 + (0.2 × (1 - 1/10)) = 1.18 (18% bonus)
- 5th to submit → 1.0 + (0.2 × (1 - 5/10)) = 1.10 (10% bonus)
- 10th to submit → 1.0 + (0.2 × (1 - 10/10)) = 1.00 (no bonus)

**Rationale**: Early consensus is a stronger signal. Validators who commit quickly (with accuracy) deserve extra weight.

---

### 4. Squad Consensus Bonus

```
squad_consensus_bonus = 1.0 + (0.1 × squad_alignment_ratio)

Where:
squad_alignment_ratio = (squad_members_voted_same / total_squad_members)
```

**Effect**: Squads that agree internally get up to 10% bonus.

**Examples** (4-person squad):
- All 4 agree → 1.0 + (0.1 × 4/4) = 1.10 (10% bonus)
- 3 of 4 agree → 1.0 + (0.1 × 3/4) = 1.075 (7.5% bonus)
- 2 of 4 agree → 1.0 + (0.1 × 2/4) = 1.05 (5% bonus)

**Rationale**: Internal squad consensus suggests strong evidence. This encourages discussion before submission.

---

## Web Validator Fusion

Game validators are not the only source of truth. Web validators (PoPP L4) also validate the same evidence. The final consensus merges both.

### Fusion Formula

```
final_verdict = argmax(verdict_type, 
  Σ game_trust_weight_i + Σ web_trust_weight_j)

Where:
web_trust_weight_j = web_base_weight × confidence_weight × reputation_factor

And:
web_base_weight = 2.0 × historical_accuracy (capped at 2x game validator weight)
```

**Weight Cap**: Web validators max 2x game validator weight to prevent domination.

**Rationale**: Web validators have more context (access to databases, research tools) but are fewer in number. The 2x cap ensures game validators (youth swarm) still have meaningful influence.

---

## Edge Cases & Handling

### Edge Case 1: Tie Verdict
**Scenario**: Genuine and Fake have equal trust-weighted votes.

**Resolution**:
1. Check confidence levels → higher average confidence wins
2. If still tied → check historical accuracy → higher average accuracy wins
3. If still tied → escalate to expert DAO (Phase 3)
4. If no DAO available → mark as "incomplete" (no consensus)

### Edge Case 2: Low Participation
**Scenario**: Only 2 validators submit verdicts.

**Resolution**:
- If both agree → consensus reached (but flagged as "low confidence")
- If they disagree → mark as "incomplete" (insufficient data)
- **Minimum threshold**: 3 validators required for binding consensus

### Edge Case 3: Outlier Verdict
**Scenario**: 1 validator votes "fake" while 9 vote "genuine".

**Resolution**:
- Outlier's verdict is still counted (democratic principle)
- But outlier's trust weight is dampened by 50% (prevents trolling)
- Outlier receives reduced XP (participation only, no alignment bonus)

### Edge Case 4: Squad Coordination Failure
**Scenario**: Squad members submit different verdicts.

**Resolution**:
- Each validator's verdict counted individually
- Squad consensus bonus = 0 (no alignment)
- Squad chat logs reviewed for potential collusion (anti-cheat)

---

## DAO Governance of Formula

The consensus formula is **not hardcoded** — it's governed by the DAO.

### Tunable Parameters
| Parameter | Default | Range | DAO Control |
|-----------|---------|-------|-------------|
| Rank multiplier | 1.0/1.5/2.5/4.0 | 1.0-5.0 | Yes |
| Confidence exponent | 1.5 | 1.0-2.0 | Yes |
| Recency bonus cap | 20% | 0-30% | Yes |
| Squad consensus bonus cap | 10% | 0-20% | Yes |
| Web validator weight cap | 2.0x | 1.0-3.0x | Yes |
| Minimum validators for consensus | 3 | 1-10 | Yes |

### Proposal Process
1. Any Dharma Warrior submits parameter adjustment proposal
2. 7-day discussion period (community debate)
3. 3-day voting period (weighted by rank × reputation)
4. If passed → changes take effect in next mission cycle
5. Emergency adjustments: Core team can make temporary changes (max 7 days) without DAO vote

---

## Example Scenarios

### Scenario 1: High-Rank Validator vs. Swarm
**Setup**:
- 1 Dharma Warrior (95% accuracy, 90 rep) votes "genuine" with 90% confidence
- 10 Civic Trainees (70% accuracy, 50 rep) vote "fake" with 80% confidence

**Calculation**:
```
Dharma Warrior weight:
  base = 4.0 × 0.95 × (0.5 + 90/200) = 3.61
  confidence = 0.9^1.5 = 0.85
  recency = 1.18 (first to submit)
  squad = 1.0 (solo)
  total = 3.61 × 0.85 × 1.18 × 1.0 = 3.62

Trainee weight (each):
  base = 1.0 × 0.7 × (0.5 + 50/200) = 0.525
  confidence = 0.8^1.5 = 0.72
  recency = 1.05 (average)
  squad = 1.10 (all agree)
  total = 0.525 × 0.72 × 1.05 × 1.10 = 0.44

Total "genuine" = 3.62
Total "fake" = 10 × 0.44 = 4.40

Winner: "fake" (swarm wins)
```

**Lesson**: Even a high-rank validator can be outvoted by a coordinated swarm. This is by design — truth is democratic, not authoritarian.

### Scenario 2: Early Consensus Wins
**Setup**:
- 5 Truth Strategists (85% accuracy, 75 rep) vote "genuine" early (first 5)
- 10 District Sentinels (75% accuracy, 60 rep) vote "fake" late (last 10)

**Calculation**:
```
Strategist weight (each):
  base = 2.5 × 0.85 × (0.5 + 75/200) = 1.84
  confidence = 0.85^1.5 = 0.78
  recency = 1.15 (early)
  squad = 1.10 (all agree)
  total = 1.84 × 0.78 × 1.15 × 1.10 = 1.82

Sentinel weight (each):
  base = 1.5 × 0.75 × (0.5 + 60/200) = 0.94
  confidence = 0.8^1.5 = 0.72
  recency = 1.00 (late)
  squad = 1.05 (mostly agree)
  total = 0.94 × 0.72 × 1.00 × 1.05 = 0.71

Total "genuine" = 5 × 1.82 = 9.10
Total "fake" = 10 × 0.71 = 7.10

Winner: "genuine" (early consensus wins)
```

**Lesson**: Early, high-quality consensus beats late, low-quality swarm. This rewards speed + accuracy.

---

## Anti-Gaming Mechanisms

### Attack 1: Rank Farming
**Strategy**: Validator artificially inflates rank through low-stakes missions.

**Defense**:
- Historical accuracy dampener for new validators (<50 validations)
- Rank unlock costs (burn CT) prevent rapid progression
- Reputation decay for inactivity prevents dormant high-rank accounts

### Attack 2: Confidence Manipulation
**Strategy**: Validator always sets 100% confidence to maximize weight.

**Defense**:
- Confidence calibration check: If validator's accuracy < confidence level, confidence weight is dampened by 50%
- Example: 100% confidence but 60% accuracy → confidence weight = 0.5 × 1.0^1.5 = 0.5

### Attack 3: Squad Collusion
**Strategy**: Squad coordinates to vote same verdict without analyzing evidence.

**Defense**:
- Squad consensus bonus capped at 10% (prevents massive advantage)
- Behavioral analysis detects suspicious coordination (same submission time, identical notes)
- Whistleblower NPC can leak collusion evidence (narrative layer)

### Attack 4: Web Validator Domination
**Strategy**: Web validators outvote game validators.

**Defense**:
- Web validator weight capped at 2x game validator weight
- Game validators outnumber web validators 10:1 (swarm vs. expert)
- DAO can adjust cap if imbalance detected

---

## Monitoring & Adjustment

### Key Metrics
- **Consensus accuracy rate**: % of game verdicts matching final consensus
- **Outlier rate**: % of validators consistently voting against consensus
- **Squad alignment rate**: % of squads with internal agreement
- **Web vs. game agreement**: % of missions where web and game verdicts match

### Adjustment Triggers
- If consensus accuracy < 65% → review formula parameters
- If outlier rate > 10% → investigate anti-cheat
- If squad alignment > 95% → investigate collusion
- If web vs. game agreement < 70% → adjust web weight cap

---

## Summary

The trust-weighted consensus formula is designed to:
1. **Reward accuracy** over volume (base weight = rank × accuracy × reputation)
2. **Amplify confidence** (but penalize overconfidence)
3. **Incentivize speed** (early consensus = recency bonus)
4. **Encourage squad cohesion** (internal agreement = bonus)
5. **Balance expert and swarm** (web validators capped at 2x)
6. **Resist gaming** (calibration checks, behavioral analysis, DAO governance)

The formula is **not static** — it evolves through DAO governance based on real-world performance. The goal is to make truth **democratic, accurate, and fun**.
