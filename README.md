# AlgoScan Artifacts

[![Validate tracked_repos.json](https://github.com/NT-Nova/AlgoScanArtifacts/actions/workflows/validate-tracked-repos.yml/badge.svg)](https://github.com/NT-Nova/AlgoScanArtifacts/actions/workflows/validate-tracked-repos.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A maintainer-curated catalog of **Algorand ecosystem** open-source repositories tracked by AlgoScan.

This repository is the **single, reviewable source of truth** for which GitHub repos AlgoScan indexes. Every change to `tracked_repos.json` is validated by automated CI before it can be merged. Contributions are scoped to **signal**, **verifiability**, and **low review overhead**.

---

## Table of contents

- [Repository layout](#repository-layout)
- [How to add a repository](#how-to-add-an-algorand-open-source-repo-to-algoscan)
- [Pull Request template](#pull-request-template)
- [Maintainer-friendly PR checklist](#maintainer-friendly-pr-checklist)
- [CI and automation](#ci-and-automation)
- [What not to submit](#what-not-to-submit)
- [Security](#security--reporting)
- [License](#license)

---

## Repository layout

```bash
AlgoScanArtifacts/
├── tracked_repos.json               # Canonical list — [[owner, name], ...]
├── .github/
│   ├── PULL_REQUEST_TEMPLATE.md     # Ready-to-copy PR template
│   ├── CODEOWNERS                   # Auto-assignment of PR reviewers
│   ├── scripts/
│   │   └── validate-tracked-repos.js  # Validation script (CI + local use)
│   ├── workflows/
│   │   └── validate-tracked-repos.yml # CI: JSON validity + duplicate check
│   └── ISSUE_TEMPLATE/
│       ├── report_invalid_repo.yml
│       └── request_removal.yml
├── SECURITY.md                      # Vulnerability & abuse disclosure policy
└── LICENSE                          # MIT
```

> **Policy:** PRs should touch only `tracked_repos.json` unless a maintainer explicitly requests otherwise. CI rejects invalid JSON, malformed entries, and duplicates automatically — a PR cannot be merged if CI fails.

---

## How to add an Algorand open-source repo to AlgoScan

### 1 — Evaluate your candidates

Before opening a PR, verify each repository against every row in this table:

| Check                   | Requirement                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------- |
| **Ecosystem relevance** | Directly related to Algorand: SDKs, protocol tooling, wallets, indexers, infra, governance, analytics, education |
| **Canonical source**    | Official org repo, not a personal fork; project website/docs point to this repo                                  |
| **Activity**            | Not archived, not abandoned                                                                                      |
| **Non-duplicate**       | Not already present in `tracked_repos.json` — CI enforces this automatically                                     |
| **Quality signal**      | Adds measurable coverage to AlgoScan; not noise or tangential content                                            |

**The maintainer test:** _"If we add this repo today, will it measurably improve AlgoScan's coverage of real Algorand engineering work?"_

---

### 2 — Fork and branch

```bash
# Fork NT-Nova/AlgoScanArtifacts via the GitHub UI, then:
git clone https://github.com/<your-username>/AlgoScanArtifacts.git
cd AlgoScanArtifacts
git checkout -b add-tracked-repos-<category>
# Good branch names:
#   add-tracked-repos-algorand-wallets
#   add-tracked-repos-indexers-and-data
#   add-tracked-repos-defi-protocols
```

**Rule of thumb:** one PR = one coherent category of additions. Split large batches by topic.

---

### 3 — Edit `tracked_repos.json`

The file is a JSON array of `[owner, name]` pairs:

```json
[
  ["AlgoNode", "algostreamer"],
  ["algorand", "go-algorand"],
  ...
]
```

- Use the **exact** `owner` and `name` values from the GitHub URL — case-sensitive.
- Each entry is a **two-element array** — do **not** use the `owner/name` slash notation as a single string.
- Preserve existing structure. Do not reformat or reorder entries you did not add.

**Validate locally before committing:**

```bash
# Full validation (same checks as CI):
node .github/scripts/validate-tracked-repos.js

# Quick parse-only check (Node, no deps):
node -e "JSON.parse(require('fs').readFileSync('tracked_repos.json','utf8')); console.log('OK')"

# jq (if installed):
jq 'length' tracked_repos.json && echo "OK"
```

---

### 4 — Open a Pull Request

The [PR template](.github/PULL_REQUEST_TEMPLATE.md) loads automatically when you open a PR on GitHub. Fill in **every section** — incomplete templates delay review.

**Title format:**

```bash
Add tracked repos: <category> — <N> repos
```

Examples:

- `Add tracked repos: Algorand wallet tooling — 8 repos`
- `Add tracked repos: indexers and data pipelines — 14 repos`
- `Add tracked repos: DeFi protocols (Folks Finance, Pact) — 6 repos`

Maintainers reject titles like "Update tracked_repos.json" — be specific.

---

### 5 — Respond to review

- Address feedback via **follow-up commits** — do not force-push during active review unless explicitly asked.
- Keep all discussion in the PR thread.
- If scope grows during review, split into multiple PRs by category.
- After approval, let maintainers merge.

---

## Pull Request template

The full template lives at [`.github/PULL_REQUEST_TEMPLATE.md`](.github/PULL_REQUEST_TEMPLATE.md) and is pre-loaded automatically on every new PR. Reference copy:

---

```markdown
## Summary

<!-- One sentence: what category of repos are you adding, and why now? -->

## Category

<!-- Tick the single best-fit category for this batch -->

- [ ] Protocol / core
- [ ] SDK / developer tooling
- [ ] Wallet / frontend
- [ ] Indexer / data pipeline
- [ ] DeFi / smart contracts
- [ ] Governance / community
- [ ] Education / documentation
- [ ] Infrastructure / node operations
- [ ] Analytics / monitoring
- [ ] Other — describe:

## Per-repo justification

<!--
One row per added repository.
Goal: a maintainer can verify each entry in under 60 seconds without leaving GitHub.
-->

| Repository (`owner/name`) | Category | Canonical? | Active? | Evidence / source links                              | Edge cases                      |
| ------------------------- | -------- | ---------- | ------- | ---------------------------------------------------- | ------------------------------- |
| `owner/repo-name`         | SDK      | Y          | Y       | [project site](https://...), [releases](https://...) | None                            |
| `owner/repo-name`         | DeFi     | Y          | Y       | [docs](https://...)                                  | Renamed from `old-name` in 2024 |

## Validation

- [ ] `node .github/scripts/validate-tracked-repos.js` passes locally
- [ ] No unrelated formatting or entry reordering
- [ ] Each entry uses exact `["owner", "name"]` two-element array format
- [ ] No archives, forks-of-upstream-canonical, or duplicates included

## Maintainer review notes

<!-- Ambiguous cases: fork lineage, org migrations, archived predecessors, unusual naming.
     Leave blank if none. -->

## References

<!--
At least one authoritative source per repo.
Acceptable: official project site, ecosystem page, release page, ARC reference, org README.
Not acceptable: personal blogs, unverified third-party lists, Twitter/X posts.
-->

- `owner/repo-name` — [source](https://...)
```

---

## Maintainer-friendly PR checklist

Maintainers use this checklist during review. Contributors should self-verify before marking a PR ready for review.

### Scope & relevance

- [ ] Only Algorand-relevant open-source repositories are added.
- [ ] No duplicates (CI enforces this; verify visually too).
- [ ] No mirrors, archived repos, spam, or low-signal entries.
- [ ] All additions clearly belong in one coherent category.

### Correctness

- [ ] All entries use exact two-element `["owner", "name"]` format.
- [ ] CI passes (JSON validity + schema + duplicate checks).
- [ ] File structure and ordering conventions are preserved.
- [ ] No unrelated reformat or reorder changes.

### Reviewability

- [ ] PR title follows the defined format (`Add tracked repos: <category> — <N> repos`).
- [ ] Per-repo justification table is fully filled in.
- [ ] At least one authoritative source link per repo.
- [ ] Edge cases (renames, migrations, predecessors) are documented.

### Process

- [ ] Review feedback addressed via follow-up commits (not force-push).
- [ ] Discussion stays in the PR thread.
- [ ] PR scope matches a single category; large batches are split.

---

## CI and automation

Every PR that modifies `tracked_repos.json` triggers **`.github/workflows/validate-tracked-repos.yml`**, which runs **`.github/scripts/validate-tracked-repos.js`**.

| Check                    | What is validated                                             |
| ------------------------ | ------------------------------------------------------------- |
| **JSON parse**           | File is syntactically valid JSON                              |
| **Top-level type**       | Root value is an array                                        |
| **Entry schema**         | Every element is a two-element array of non-empty strings     |
| **No slashes in fields** | `owner` and `name` each contain no `/` (catches paste errors) |
| **No duplicates**        | Case-insensitive `owner/name` uniqueness across all entries   |

A PR **cannot be merged** if any check fails. The workflow annotates the diff with the exact error so contributors can self-fix without maintainer intervention.

---

## What not to submit

| Submission                                | Why it is rejected                                         |
| ----------------------------------------- | ---------------------------------------------------------- |
| Bulk additions with no rationale          | Cannot be verified in reasonable review time               |
| Forks when upstream canonical repo exists | Duplicate signal; degrades index quality                   |
| General "awesome lists"                   | Almost always includes non-Algorand or off-topic content   |
| PRs that only reformat or reorder JSON    | No new signal; causes unnecessary merge conflicts          |
| Archived or clearly abandoned repos       | Dead signal degrades index quality                         |
| Wrong owner or typo in repo name          | CI catches schema issues; maintainers reject by convention |

---

## Security / reporting

See [SECURITY.md](SECURITY.md) for the full disclosure policy.

**Quick reference:**

| Concern                                          | Action                                                                                                 |
| ------------------------------------------------ | ------------------------------------------------------------------------------------------------------ |
| Malicious, spammy, or deceptive repo in the list | Open an issue using the [Report Invalid Repo](.github/ISSUE_TEMPLATE/report_invalid_repo.yml) template |
| Repo that should be removed                      | Open an issue using the [Request Removal](.github/ISSUE_TEMPLATE/request_removal.yml) template         |
| Security vulnerability in this repo's automation | Follow the private disclosure path in [SECURITY.md](SECURITY.md)                                       |

---

## License

MIT. See [LICENSE](LICENSE).
