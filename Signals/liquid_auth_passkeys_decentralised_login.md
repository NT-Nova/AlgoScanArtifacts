---
title: "Liquid Auth and passkeys: decentralised passwordless login via Pera"
date: "2025-11-12"
thumbnail: /images/algorand.png
tags: ["algorand", "wallet", "authentication", "passkeys", "webauthn", "fido2"]
source_links:
  - "https://liquidauth.com/"
  - "https://support.perawallet.app/en/article/how-to-manage-your-passkeys-in-pera-r3nnma/"
  - "https://github.com/algorandfoundation/liquid-auth"
---

## Executive summary

In November 2025, the Algorand Foundation and the Pera Wallet team publicly launched the Liquid Auth passkey integration in Pera. Liquid Auth itself was originally introduced in 2024 as an open, decentralised authentication protocol; the November release brought its passwordless sign-in capabilities to Pera's user base. The announcement positions Liquid Auth as a response to password failure modes (weak passwords, reuse, breaches) while rejecting the standard Web2 architecture where authentication secrets typically live on central servers.

The key architectural claim is that Liquid Auth creates an encrypted peer-to-peer channel between a browser session and the wallet, enabling genuine FIDO2/WebAuthn passkey experiences with decentralised properties.

In practice, this is significant for developers because it creates a new class of integration pattern: applications can offer a familiar "passkey login" UX while tying identity and authorisation to a user-controlled wallet rather than centralised credential stores. For teams building consumer-facing applications — especially those that want onboarding without "seed phrase first" friction — Liquid Auth represents a concrete toolkit to test.

## Background and context

Wallet-mediated authentication is not new (SIWE-style patterns exist elsewhere), but the emphasis here is on passkeys and WebAuthn-era usability. The messaging explicitly targets an audience that expects biometric/device-backed authentication rather than memorised secrets.

This aligns with broader ecosystem goals around user experience improvements and mainstream onboarding, reflected in the Foundation's roadmap updates.

## Technical details

Liquid Auth is described as:

- Passwordless sign-in mediated via Pera.
- Using an **encrypted peer-to-peer channel** between browser and wallet.
- Keeping private keys stored in the wallet, not exposed to applications.

**High-level authentication flow:**

```bash
User opens login page on website
        ↓
Browser session requests Liquid Auth pairing
        ↓
Pera wallet on mobile establishes encrypted P2P channel
        ↓
Pera prompts biometric / device auth
        ↓
Wallet proves control (auth assertion / signature)
        ↓
Session established on website
```

### Constraints and edge cases

The Pera post calls out device and wallet constraints — e.g., passkeys may remain device-local rather than automatically syncing across devices, and platform requirements can exist (modern iOS/Android). The how-to guide similarly frames Liquid Auth as an experience to sign in to sites, implying that relying parties must integrate it explicitly.

## Significance for developers and the ecosystem

**For developers:**

- **New onboarding pattern**: "sign in with wallet" without requiring users to reason about transactions on day one.
- **Security posture**: reduces reliance on passwords and centralised credential stores, at least for the auth step.

**For the ecosystem:**

- If broadly adopted, wallet-mediated passkeys could reduce churn and support more consumer applications where account takeover risk is otherwise high.

## Adoption and current status

Liquid Auth is presented as an available feature in Pera, with both an announcement and a practical "how to use" guide from the Foundation and additional technical framing from Pera's own publication.

## Risks and limitations

- **Integration complexity**: websites must implement Liquid Auth explicitly; without ecosystem-wide tooling, adoption may be limited to early builders.
- **Device-bound identity**: passkey paradigms often imply device-bound keys; recovery and multi-device strategies require careful design to avoid user lockout.
- **Phishing and session risk remains**: passwordless auth reduces some classes of attacks but does not automatically solve malicious sites or compromised endpoints.

## Primary sources

- Introducing Liquid Auth.
- How-to guide for Liquid Auth sign-in.
- Pera's implementation-focused write-up.

## Suggested next steps

**For app developers:**

Prototype Liquid Auth as an alternative login method for:

- Account recovery flows
- High-value actions requiring re-auth
- Cross-device session issuance with explicit user confirmation

**For maintainers:**

Publish a reference implementation (front-end + backend verifier) and security guidance (anti-replay, session lifetime, user consent prompts).
