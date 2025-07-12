# 🔧 PoPP Developer SDK & API Blueprint

## 📦 Overview

This document outlines the SDK and API architecture to power integrations, frontend dApps, validator tools, DAO dashboards, and third-party apps on top of the **Proof of Problem Protocol (PoPP)**.

It includes REST + Web3 + AI integration layers across all five core protocol layers.

---

## 🧱 SDK Structure

```bash
popp-sdk/
├── core/              # Core logic and types
├── api/               # REST and GraphQL wrappers
├── web3/              # Web3 providers and contracts
├── ai/                # AI validators and NLP models
├── dao/               # Governance wrappers
├── utils/             # Formatters, tag generators, etc
└── ui/                # React components (optional)
```

---

## 🔑 Auth Modes

* Anonymous ID (UUID)
* Wallet Connect (EVM)
* SBT-Linked Identity

---

## 🧠 Core API Endpoints

### 🔹 L0 – Submission

| Method | Endpoint          | Description              |
| ------ | ----------------- | ------------------------ |
| POST   | /problems         | Submit new problem       |
| GET    | /problems/\:id    | Get problem by ID        |
| GET    | /problems?tag=xyz | Query problems by filter |

### 🔹 L1 – Validation

\| POST   | /validate/\:id              | Submit AI/human validation feedback  |
\| GET    | /validation/\:id            | Get validation report                |

### 🔹 L2 – Tokenization

\| POST   | /tokenize/\:id              | Mint validated problem to NFT/SBT    |
\| GET    | /tokens/\:user              | Fetch user tokenized problems        |

### 🔹 L3 – Collaboration

\| POST   | /proposals                 | Submit solution proposal             |
\| GET    | /proposals/\:id             | Get proposal + lifecycle status      |

### 🔹 L4 – Rewards & Governance

\| GET    | /rewards/\:user             | Reward history + reputation ledger   |
\| POST   | /rewards/distribute        | DAO-triggered reward logic           |
\| POST   | /governance/vote           | Submit vote on DAO action            |

### 🔹 L5 – Local & Offline

\| POST   | /sync/offline              | Submit synced batch from offline hub |
\| POST   | /validators/local          | Local validator registration         |

---

## ⚙️ Web3 Contract Interfaces (Solidity / EVM)

### 🔸 ProblemToken.sol

* `mint(address user, metadata)`
* `getMetadata(tokenId)`

### 🔸 RewardTreasury.sol

* `distributeReward(address to, uint256 amount)`
* `recordReputation(address contributor, uint256 score)`

### 🔸 PoPPDAO.sol

* `submitProposal(string json)`
* `vote(uint256 proposalId, bool choice)`

---

## 🧠 AI/NLP Toolkit

### 🧩 Submission Formatter

* Cleans input text, applies tags, extracts location/entity
* Language models: DistilBERT, Whisper (audio), NER

### 🧩 Spam/Fake Detector

* Classifies and flags suspicious problems
* Model: fine-tuned transformer

---

## 🧪 SDK Usage Example (JS)

```ts
import { submitProblem, validateProblem, tokenizeProblem } from 'popp-sdk';

await submitProblem({
  title: "No clean water in village",
  description: "Water tank is broken since June",
  geotag: [25.9, 78.2],
  files: ["photo1.png"],
});

await validateProblem(problemId, { score: 9.2, tags: ["water", "infrastructure"] });

await tokenizeProblem(problemId);
```

---

## 🔗 External Integrations

* IPFS/Filecoin for media
* ENS/SBT/Polygon ID for identity
* Gitcoin for retroactive funding
* Ceramic or Lit Protocol for encrypted metadata

---

## 📤 Deployment Targets

* Node.js, Browser, React Native
* CLI (Node-based)
* Dockerized API gateway

---

## 📘 Final Notes

The PoPP SDK + API stack allows developers to:

* Build apps that surface real-world problems
* Empower validators and DAO members
* Automate reward flows
* Interact with PoPP as a programmable social layer

Next steps:

* Open-source SDK on GitHub
* Swagger/OpenAPI doc for REST layer
* Deploy to testnet
* Create PoPP dApp starter templates (React/Next.js)
