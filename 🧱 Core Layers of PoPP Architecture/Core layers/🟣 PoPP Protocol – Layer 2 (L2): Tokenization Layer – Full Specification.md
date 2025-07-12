# 🟣 PoPP Protocol – Layer 2 (L2): Tokenization Layer – Full Specification

## 📘 Overview

**Layer 2 (L2)** of the Proof of Problem Protocol (PoPP) is responsible for transforming **validated problems** into **immutable digital assets**. These can be minted as **NFTs (Non-Fungible Tokens)** or **SBTs (Soulbound Tokens)** to signify their authenticity, traceability, and potential for collaboration.

This layer provides the **on-chain proof of validation**, enabling downstream engagement from investors, developers, NGOs, and solvers.

---

## 🎯 Objectives

* Create **tamper-proof representations** of validated problems.
* Enable **ownership, auditability, and traceability** of submitted problems.
* Power **reputation, collaboration, and funding systems** based on verified issues.

---

## 🧩 Feature Specification Table

| Feature                   | Description                                                              | Type        | Notes                                             |
| ------------------------- | ------------------------------------------------------------------------ | ----------- | ------------------------------------------------- |
| 🧾 NFT/SBT Minting        | Tokenizes validated problems as unique digital assets.                   | Mandatory   | Use ERC-721 for NFTs or ERC-5114 for SBTs.        |
| 🔗 Metadata Binding       | Links token to validation data and media IPFS hash.                      | Mandatory   | Includes validator ID, score, timestamp, etc.     |
| 🧠 Token Type Logic       | Choose between transferable (NFT) or bound (SBT) based on identity mode. | Conditional | Public = NFT, Anonymous = SBT, Wallet = Optional. |
| 🧬 Verifiable Credential  | Embed W3C-compliant credential schema (e.g., JSON-LD).                   | Optional    | Enhances cross-platform verifiability.            |
| 🖼️ Visual Representation | Auto-generate problem card image using AI or template.                   | Optional    | Makes tokens readable/viewable on explorers.      |
| 📡 Token Registry         | Register token on public chain + PoPP explorer.                          | Mandatory   | Enables indexing and discovery.                   |
| 🏷️ On-chain Tag Indexing | Map problems by domain/tag (e.g. Health, Education, Civic).              | Optional    | Useful for DAO curation and funding dApps.        |
| 👥 Submitter Attachment   | Link token to submitter’s wallet or pseudonymous ID.                     | Optional    | Supports reward/reputation systems.               |

---

## 🧾 Token Metadata (Standard JSON)

```json
{
  "name": "Problem #123 – No Drainage in Ward 18",
  "description": "Our locality floods every monsoon due to blocked drains. Multiple complaints have gone unanswered.",
  "tags": ["urban", "infrastructure", "flood"],
  "location": "Ward 18, Mumbai",
  "media": "ipfs://Qmflooded-street",
  "validator": "0xValidatorABC",
  "score": 82,
  "timestamp": "2025-07-12T08:00:00Z",
  "type": "SBT",
  "submitter": "anon1234"
}
```

---

## ⚙️ Technical Components

### 🛠️ Smart Contract Layer

* Language: Solidity (EVM) or CosmWasm (Cosmos)
* Standards:

  * **NFT**: ERC-721 / CW721
  * **SBT**: ERC-5114 / Non-transferable metadata-bound tokens
* IPFS/Arweave: For immutable media + metadata
* Chainlink oracles: For timestamp verification (optional)

### 🖥️ Minting Engine

* Triggered by L1 validation status = "validated"
* Auto-generates token metadata
* Stores metadata on IPFS/Filecoin
* Sends transaction to mint token

### 🌐 Frontend (Explorer/Viewer)

* Show all tokenized problems
* Filters by domain, region, score
* Connects to wallet or user profile

---

## 🧠 Token Type Decision Logic

| Identity Mode         | Token Type | Reason                                         |
| --------------------- | ---------- | ---------------------------------------------- |
| Anonymous             | SBT        | Prevents transfer, maintains privacy integrity |
| Pseudonymous (wallet) | NFT or SBT | User chooses (reward vs. soulbinding)          |
| Public                | NFT        | Public ownership + reward eligibility          |

---

## 🔄 Flow Summary

1. Problem validated in L1 → marked as `status: validated`
2. Tokenization logic triggers:

   * Generates metadata
   * Stores on IPFS
   * Chooses NFT or SBT based on identity mode
   * Calls smart contract to mint
3. Token stored on-chain + listed in PoPP registry
4. Token becomes eligible for viewing, funding, DAO inclusion

---

## 🔐 Security Considerations

* Prevent duplicate minting via token hash registry
* Include validator signature hash in metadata
* Token can be flagged for freezing if fraud is detected later

---

## 🔗 Output to L3 (Collaboration & Funding Layer)

* Token ID + metadata are used to:

  * Match solvers/developers/funders
  * Display problem in PoPP Explorer
  * Build community or DAO attention around real issues

---

## 🧠 Final Note

Tokenization is where **validated truth becomes immutable proof**.
It gives power, visibility, and permanence to a problem — and opens doors to future actions.

This layer ensures:

* Every real issue has a **traceable digital footprint**
* Impact tracking and solution funding are **data-driven**
* Trust is **anchored on-chain**, transparently

---

## 🔜 Next: Layer 3 – Collaboration & Escalation Layer

Where validated + tokenized problems meet ethical solvers, investors, and governance systems.
