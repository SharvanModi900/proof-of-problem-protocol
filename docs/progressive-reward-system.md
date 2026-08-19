# PoPP Progressive Reward System

## **Problem with Original System**

**Old Flow:**
```
L1: Submit → Wait (0 rewards)
L2: AI Analysis → Wait (0 rewards)
L3: Consensus → Wait (0 rewards)
L4: Proof → Wait (0 rewards)
L5: Escalation → Wait (0 rewards)
L6: Resolution (days/weeks later) → FINALLY get rewards!
```

**Issue:** Users won't wait! They need **instant gratification** at each step.

---

## **Solution: Layer-by-Layer Rewards**

**New Flow:**
```
L1: Submit → Get 10 POPPT immediately! ✅
L2: AI Analysis → Validators get 5 POPPT each ✅
L3: Consensus → Validators get 5 POPPT more ✅
L4: Proof → Proofer gets 15 POPPT ✅
L5: Escalation → Escalator gets 10 POPPT ✅
L6: Resolution → Final 5 POPPT + bonus ✅
```

**Total: 50 POPPT (same amount, but distributed progressively!)**

---

## **Reward Breakdown by Layer**

### **L1: Submission (Immediate)**
- **Who:** Submitter
- **Reward:** 10 POPPT
- **R-Score:** +2
- **When:** Immediately upon submission
- **Status:** ✅ **IMPLEMENTED**

**Example:**
```
User submits pothole → Gets 10 POPPT instantly!
Message: "You earned 10 POPPT for submitting this problem!"
```

---

### **L2: AI Analysis (Background)**
- **Who:** Submitter (bonus for valid AI analysis)
- **Reward:** 5 POPPT
- **R-Score:** +1
- **When:** After AI confirms problem is valid (not spam)
- **Status:** ⏳ **TO IMPLEMENT**

**Example:**
```
AI analyzes submission → Confirms valid → Submitter gets 5 more POPPT!
Total so far: 15 POPPT
```

---

### **L3: Validator Consensus**
- **Who:** Validators who vote correctly
- **Reward:** 5 POPPT per validator
- **R-Score:** +2 per validator
- **When:** After consensus is reached (3+ validators agree)
- **Status:** ⏳ **TO IMPLEMENT**

**Example:**
```
5 validators vote "valid" → Each gets 5 POPPT!
Submitter gets notification: "Your problem was validated by 5 experts!"
```

---

### **L4: Proof Generation**
- **Who:** Proofer (person who generates cryptographic proof)
- **Reward:** 15 POPPT
- **R-Score:** +3
- **When:** After proof is generated and anchored to chain
- **Status:** ⏳ **TO IMPLEMENT**

**Example:**
```
Proof generated → Anchored to blockchain → Proofer gets 15 POPPT!
Submitter gets notification: "Your problem now has blockchain proof!"
```

---

### **L5: Escalation**
- **Who:** Escalator (person who escalates to authorities)
- **Reward:** 10 POPPT
- **R-Score:** +2
- **When:** After escalation is triggered
- **Status:** ⏳ **TO IMPLEMENT**

**Example:**
```
Problem escalated to municipal authority → Escalator gets 10 POPPT!
Submitter gets notification: "Your problem has been escalated!"
```

---

### **L6: Resolution (Final)**
- **Who:** Submitter + Validators + Resolver
- **Reward:** 5 POPPT (final bonus)
- **R-Score:** +5 (submitter), +3 (validators), +4 (resolver)
- **When:** After physical resolution is confirmed
- **Status:** ✅ **ALREADY IMPLEMENTED**

**Example:**
```
Problem fixed by authorities → Everyone gets final rewards!
Submitter: 5 more POPPT (total: 20 POPPT)
Validators: 3 more POPPT each
Resolver: 15 POPPT + R-Score bonus
```

---

## **User Journey Example**

### **Scenario: Alice Reports a Pothole**

**Step 1: Submission (L1)**
```
Alice submits pothole photo
→ Gets 10 POPPT immediately!
→ R-Score: +2
→ Notification: "You earned 10 POPPT!"
```

**Step 2: AI Analysis (L2)**
```
AI confirms it's a valid pothole (not spam)
→ Alice gets 5 more POPPT!
→ R-Score: +1
→ Notification: "Your problem was verified by AI! +5 POPPT"
```

**Step 3: Validator Consensus (L3)**
```
5 validators confirm it's a real pothole
→ Each validator gets 5 POPPT
→ Alice gets notification: "5 experts validated your problem!"
```

**Step 4: Proof Generation (L4)**
```
Cryptographic proof generated + anchored to blockchain
→ Proofer gets 15 POPPT
→ Alice gets notification: "Your problem now has blockchain proof!"
```

**Step 5: Escalation (L5)**
```
Problem escalated to municipal authority
→ Escalator gets 10 POPPT
→ Alice gets notification: "Problem escalated to authorities!"
```

**Step 6: Resolution (L6)**
```
Municipal crew fixes the pothole
→ Alice gets 5 final POPPT (total: 20 POPPT)
→ Validators get 3 more POPPT each
→ Resolver gets 15 POPPT
→ Alice gets notification: "Problem resolved! You earned 20 POPPT total!"
```

**Alice's Total Journey:**
- **Time:** 1 week (from submission to resolution)
- **Rewards:** 20 POPPT (10 + 5 + 5 final)
- **R-Score:** +8 (2 + 1 + 5)
- **Experience:** Instant gratification at each step!

---

## **Implementation Status**

| Layer | Reward | Status | File |
|-------|--------|--------|------|
| **L1: Submission** | 10 POPPT | ✅ **DONE** | `submission.rs` |
| **L2: AI Analysis** | 5 POPPT | ⏳ TODO | `submission.rs` (background) |
| **L3: Consensus** | 5 POPPT/validator | ⏳ TODO | `validator.rs` |
| **L4: Proof** | 15 POPPT | ⏳ TODO | `proofer.rs` |
| **L5: Escalation** | 10 POPPT | ⏳ TODO | `escalation.rs` |
| **L6: Resolution** | 5 POPPT + bonus | ✅ **DONE** | `resolution.rs` |

---

## **Benefits of Progressive Rewards**

### **1. Instant Gratification**
- Users get rewards **immediately** for each action
- No waiting days/weeks for rewards
- Keeps users engaged and motivated

### **2. Better UX**
- Clear progression: "I earned 10 → 15 → 20 POPPT!"
- Notifications at each step
- Transparent reward system

### **3. Higher Retention**
- Users come back to check rewards
- Each layer gives a reason to open the app
- Gamification through progressive rewards

### **4. Fair Distribution**
- Rewards match effort at each stage
- Early contributors get rewards faster
- No single point of failure (all layers rewarded)

### **5. Economic Sustainability**
- Same total rewards (50 POPPT per problem)
- Distributed over time (not all at once)
- Easier on treasury cash flow

---

## **Database Schema**

The `reward_ledger` table already supports this:

```sql
CREATE TABLE reward_ledger (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    submission_id UUID,
    reward_type TEXT,  -- 'submission_reward', 'validator_reward', etc.
    amount DOUBLE PRECISION,
    r_score_delta DOUBLE PRECISION,
    popp_credits_delta DOUBLE PRECISION,
    description TEXT,
    created_at TIMESTAMPTZ
);
```

**Example entries for one submission:**
```
L1: submission_reward, 10 POPPT, R-Score +2
L2: ai_verification_reward, 5 POPPT, R-Score +1
L3: validator_reward, 5 POPPT, R-Score +2 (per validator)
L4: proof_generation_reward, 15 POPPT, R-Score +3
L5: escalation_reward, 10 POPPT, R-Score +2
L6: resolution_reward, 5 POPPT, R-Score +5
```

---

## **Next Steps**

1. ✅ **L1 Implemented** - Test submission rewards
2. ⏳ **Implement L2** - AI analysis rewards (in background processing)
3. ⏳ **Implement L3** - Validator consensus rewards
4. ⏳ **Implement L4** - Proof generation rewards
5. ⏳ **Implement L5** - Escalation rewards
6. ✅ **L6 Already Done** - Resolution rewards

**Estimated Time:** 2-3 hours to implement all remaining layers

---

## **Testing Plan**

After implementation, test the full flow:

```bash
# 1. Submit a problem (L1)
POST /api/submissions
→ Check: popp_credits += 10

# 2. Wait for AI analysis (L2)
→ Check: popp_credits += 5

# 3. Validators vote (L3)
POST /api/submissions/{id}/validate
→ Check: validator popp_credits += 5 each

# 4. Proof generated (L4)
→ Check: proofer popp_credits += 15

# 5. Escalation (L5)
POST /api/submissions/{id}/escalate
→ Check: escalator popp_credits += 10

# 6. Resolution (L6)
POST /api/resolutions/{id}/resolve
→ Check: final rewards distributed
```

---

## **Summary**

**Progressive rewards transform PoPP from:**
- ❌ "Submit and wait weeks for rewards"
- ✅ "Submit and get rewards instantly at each step!"

**This is the key to user engagement and retention!**
