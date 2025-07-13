# 🔴 PoPP Protocol – Layer 0 (L0): Problem Submission Layer – Full Specification

## 📘 Overview

**Layer 0 (L0)** of the Proof of Problem Protocol (PoPP) is the **entry point** for authentic problem reporting. It captures and structures real-world issues faced by individuals or communities, providing the raw data needed for later validation, tokenization, and action. This layer is critical to maintaining **trust, inclusion, and data integrity** across the protocol.

---

## 🎯 Objectives

* Enable **citizens, whistleblowers, or affected users** to submit problems easily.
* Support **anonymous, pseudonymous, or public** identities.
* Provide a **secure, structured, and verifiable** format for problems.
* Prevent **spam, fake, or bot-driven** submissions.

---

## 🧩 Feature Specification Table

| Feature                    | Description                                                          | Optionality | Notes                                      |
| -------------------------- | -------------------------------------------------------------------- | ----------- | ------------------------------------------ |
| 📝 Submission Form         | Web/mobile form to enter problem details (title, description, tags). | Mandatory   | Core UI component.                         |
| 📍 Geotagging              | Auto-capture or user-input location data.                            | Optional    | May be spoofed; useful for clustering.     |
| 📸 Multimedia Evidence     | Upload images, videos, documents as proof.                           | Optional    | Strengthens problem credibility.           |
| 🧠 Contextual AI Support   | AI assistance to rewrite, tag, and clarify submissions.              | Recommended | Optional UI enhancer.                      |
| 🔐 Identity Modes          | Select between Public, Anonymous, or Pseudonymous (wallet-linked).   | Mandatory   | Supports privacy, reputation layers later. |
| 🕓 Timestamping            | Anchors a timestamp on blockchain at submission.                     | Mandatory   | Used in L2 Proof layer.                    |
| 🧾 Signature               | Wallet/device sign for cryptographic origin.                         | Optional    | Enables provable submission identity.      |
| 🧠 AI/ML Spam Detection    | Detects low-effort, copy-paste, or duplicate content.                | Recommended | Layered protection with other systems.     |
| 🧬 Trust Scoring System    | Calculates trust level based on user history or behavior.            | Recommended | Can impact L1 routing/priority.            |
| 🧑‍💻 Device + IP Metadata | Capture device/browser/IP for validation and analytics.              | Optional    | Helps detect location spoofing.            |
| ✋ CAPTCHA/Proof of Human   | Ensures human origin, avoids bot flood.                              | Recommended | Required for anonymous entries.            |
| 🗳️ Community Flag Option  | Users/validators can flag fake/problematic entries.                  | Optional    | Crowd-driven quality check.                |
| 🔄 Draft Save & Resume     | Lets user save unfinished form and resume later.                     | Optional    | UX improvement.                            |
| 🌐 Multi-language Support  | Local language UI and/or automatic translation.                      | Optional    | Improves inclusivity.                      |
| 🎯 Problem Categorization  | Tag by user or AI: health, infrastructure, civic, gender, etc.       | Mandatory   | Helps with sorting and search.             |

---

## 🗂️ Data Schema Example (JSON)

```json
{
  "id": "popp-problem-00123",
  "title": "No drainage system in ward 18",
  "description": "Our locality floods every monsoon due to blocked drains. Multiple complaints have gone unanswered.",
  "tags": ["urban", "infrastructure", "flood"],
  "location": {
    "latitude": 19.2183,
    "longitude": 72.9781,
    "region": "Ward 18, Mumbai"
  },
  "media": [
    {
      "type": "image",
      "url": "https://popp.storage/ipfs/Qmflooded-street"
    }
  ],
  "submittedBy": {
    "mode": "anonymous",
    "wallet": null
  },
  "submittedAt": "2025-07-12T08:00:00Z",
  "signature": null
}
```

---

## ⚙️ Technical Components

### 🔧 Frontend

* Framework: React / Next.js
* Form Builder: Tailwind UI, shadcn/ui, or Formik
* Map: Mapbox or Leaflet for geolocation
* AI Support: OpenAI, Langchain for NLP tagging/summarizing

### 🖥️ Backend

* Server: Node.js (Fastify/NestJS) or Rust (Axum)
* Database: PostgreSQL / MongoDB
* Media Storage: IPFS, Filecoin, S3 fallback
* Anti-spam: OpenAI classifier, device fingerprinting, rate limiting
* CAPTCHA: hCaptcha or Proof-of-Humanity API

### ⛓️ Blockchain Integration

* Timestamp: Use any public chain (Polygon, Arbitrum, Cosmos SDK chain)
* Signature: EVM wallet signature or Ed25519 device cert
* Optional anchoring: CID hash from IPFS with timestamp

---

## 🔐 Security & Anti-Fraud Strategy

* Multi-layered spam detection (AI + CAPTCHA + rate limiting)
* Trust scoring and community moderation
* Optional wallet signing to improve submission trust
* Metadata logging for forensic auditing

---

## 🔄 Flow Summary

1. User opens submission form.
2. Fills title, description, tags, and optional media.
3. Selects identity mode (Public / Anonymous / Wallet).
4. Optional: AI suggests tags/improvements.
5. CAPTCHA and/or device validation.
6. Blockchain timestamp + optional signature.
7. Stored in database + IPFS hash anchored.
8. Passed to Layer 1 (Validation).

---

## 📌 Next Step: L1 – Validation Layer

Once submissions are stored and time-stamped, they are queued for validation via AI, peer review, DAO voting, or moderator escalation.

---

## 🧠 Final Note

L0 must be:

* **Lightweight** to encourage mass participation
* **Flexible** to handle different tech skill levels
* **Secure** to protect against abuse
* **Structured** for easy processing downstream

It is the **foundation of truth** for the entire PoPP system.
