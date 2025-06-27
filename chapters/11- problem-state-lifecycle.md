# 📘 Chapter 11: Problem State Lifecycle

---

## 🔄 Why States Matter

A problem isn’t static. It evolves.  
In traditional systems, complaints are often marked “closed” without proof, or “resolved” without validation.  

**PoPP introduces a transparent state machine**, so every problem has a **provable journey**.

---

## 🧬 The 7 Problem States in PoPP

Each state is **cryptographically tracked** and **publicly visible**.

---

### 1. 📝 Submitted

- A user raises a ticket describing the issue.  
- Metadata (location, time, category) is attached.  
- A unique **PoPP Ticket ID** is generated.

---

### 2. 🧪 Pending Validation

- Validators are assigned (algorithmic or DAO-based).  
- Ticket is reviewed for:
  - Relevance
  - Duplicates
  - Fraud detection

---

### 3. ✅ Validated

- Validators reach **minimum consensus threshold**  
- Ticket becomes officially **recognized as “real”**
- Eligible for:
  - On-chain proof
  - Escalation
  - Reputation impact
- Cryptographically sealed into ledger

---

### 4. 🔄 Under Resolution

- Assigned to responsible authority (DAO, organization, dept)  
- Timeline and fix efforts are monitored by proofers  
- Resolution metadata is continuously updated  
- Escalation trigger is ready if ignored too long

---

### 5. ⚠️ Disputed

- Triggered if:
  - Fake resolution is reported  
  - No response is observed  
- Validators can **dispute** the status  
- Enters a **challenge period**:
  - Re-validation  
  - Public visibility  
  - Watchdog alert

---

### 6. 🧾 Resolved

- Problem is confirmed as **resolved** by:
  - Validator re-check
  - End-user verification
  - Sensor/IoT signal (if applicable)  
- Includes metadata:
  - Time taken
  - Resolution method
  - Resource usage

---

### 7. 🗃️ Archived (Immutable Ledger)

- Ticket becomes part of the **permanent problem archive**
- Available for:
  - Public dashboards
  - Open data APIs
  - Annual audits and governance reports
- Can be:
  - Analyzed
  - Referenced
  - Used as truth anchors

---

## 🧱 State Machine Example

```text
[Submitted]
     ↓
[Pending Validation]
     ↓
[Validated]
     ↓
[Under Resolution]
     ↘︎           ↖︎
 [Disputed] ← [Resolved]
     ↓
 [Archived]

---

## 🧠 Why This Model Matters

With PoPP, **no problem can**:

- ❌ Disappear without trace  
- ❌ Be marked “solved” without agreement  
- ❌ Loop forever without warning  

The **Problem State Lifecycle** creates:

- ✅ Truthful progress  
- ✅ Provable accountability  
- ✅ Alerts for broken systems

---

## 📊 Analytics Built on State Histories

- 🕒 **Average resolution time** per department  
- 🌐 **Validator reliability scores**  
- 📍 **Dispute frequency** by region  
- 🚩 **% of tickets stuck** = systemic bottleneck alert

---

## 💬 Quote Block (Illustration)

> _“A civilization that tracks its problems  
> grows wiser with every state.”_

---
