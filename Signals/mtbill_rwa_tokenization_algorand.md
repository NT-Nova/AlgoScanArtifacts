---
title: "mTBILL on Algorand: tokenised Treasury exposure with measurable latency and cost"
date: "2025-05-29"
thumbnail: /images/algorand.png
tags: ["algorand", "tokenization", "rwa", "defi", "asa"]
source_links:
  - "Algorand Foundation blog: Midas launches mTBILL on Algorand"
---

## Executive summary

In May 2025, the Foundation reported that Midas launched mTBILL on Algorand, describing it as the first non-EVM launch of the product. The post presents mTBILL as a tokenised certificate referencing short-term U.S. Treasury ETFs, intended to broaden access for European retail investors without the high minimums associated with some institutional products.

The developer-relevant aspect is the unusually concrete evidence included: the post states that an atomic swap was executed on May 27, 2025, exchanging **$2m USDC for mTBILL** with a network fee of **0.002 ALGO** (~$0.0004) and **2-second completion**. This is precisely the kind of benchmark engineers need when evaluating whether an L1 can support production-grade financial UX.

The post also claims that mTBILL is permissionless and designed for DeFi composability, explicitly pointing toward integration into the broader DeFi ecosystem. For builders, this sets up potential primitives: collateral protocols, yield aggregation, and treasury management can incorporate RWA-backed instruments when the on-chain representation is sufficiently liquid and standards-aligned.

## Background and context

Tokenisation discussions often collapse into marketing unless they include:

- What asset is represented
- Who can access it
- How redemption/value is derived
- Whether on-chain rails can meet user expectations

This announcement is notable because it addresses those points and includes a large, timestamped on-chain transaction reference.

## Technical details

mTBILL is described as:

- A tokenised certificate referencing a basket of short-term Treasury ETFs, with redemption value based on liquidation proceeds of the reference basket.
- Permissionless and intended for DeFi composability.

**Atomic swap flow on Algorand** — group transactions that succeed or fail together:

```bash
Seller                     Algorand L1                  Buyer
  │                            │                          │
  │ ←─── Tx1 + Tx2 grouped  ──→│                          │
  │        (atomic)            │                          │
  │  Tx1: USDC  ─────────────────────────────────────────→│
  │  Tx2: mTBILL   ←──────────────────────────────────────│
  │                            │                          │
  │ ←──── Confirm group (final) ──────────────────────────│
```

The post explicitly claims the executed swap cost and latency, which indicates this was a group transaction on mainnet rather than an off-chain settled exchange.

**Key on-chain metrics from the launch swap:**

| Metric          | Value                    |
| --------------- | ------------------------ |
| Swap size       | $2,000,000 USDC → mTBILL |
| Network fee     | 0.002 ALGO (~$0.0004)    |
| Completion time | ~2 seconds               |
| Settlement date | 2025-05-27               |

## Significance for developers and the ecosystem

**For developers:**

A workable RWA instrument provides a new building block for:

- Collateralised lending
- Structured products
- Treasury optimisation for DAOs and businesses

**For the ecosystem:**

A credible RWA example helps attract institutions and regulated entities by showing a path from TradFi asset exposure to on-chain composability, with tangible performance metrics.

## Adoption and current status

- Launch date and product framing are provided by the Foundation.
- The post highlights a specific $2m swap as a milestone and indicates that DeFi integration is expected to follow.

## Risks and limitations

- **Market and redemption risk**: the token's value depends on mechanisms outside the chain (ETF basket liquidation and legal structure).
- **Composability vs. compliance tension**: "permissionless" composability may conflict with regulatory constraints depending on jurisdiction and product structure.
- **Liquidity and integration risk**: DeFi composability requires real liquidity, robust oracles, and careful risk parameters.

## Primary sources

- Foundation announcement for mTBILL.

## Suggested next steps

**For DeFi teams:**

Treat mTBILL-like assets as new collateral classes that require:

- Oracle design (price + yield)
- Liquidity checks
- Stress testing

**For maintainers:**

Publish reference integrations (indexer queries, asset metadata handling, and sample group transaction builders) to accelerate safe composability.

**Example (Python SDK)** — building an atomic swap group transaction:

```python
from algosdk.v2client import algod
from algosdk import account, transaction

client = algod.AlgodClient(token, address)
params = client.suggested_params()

# Tx1: Buyer sends USDC to seller
tx1 = transaction.AssetTransferTxn(
    sender=buyer,
    sp=params,
    receiver=seller,
    amt=2_000_000_000_000,  # $2m in USDC base units
    index=usdc_asset_id,
)
# Tx2: Seller sends mTBILL to buyer
tx2 = transaction.AssetTransferTxn(
    sender=seller,
    sp=params,
    receiver=buyer,
    amt=mtbill_amount,
    index=mtbill_asset_id,
)

# Group them atomically
transaction.assign_group_id([tx1, tx2])
```
