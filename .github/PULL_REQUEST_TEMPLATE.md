<!--
  Thank you for contributing to AlgoScanArtifacts!

  TITLE FORMAT (required, edit before submitting):
    Add tracked repos: <category> — <N> repos
  Examples:
    Add tracked repos: Algorand wallet tooling — 8 repos
    Add tracked repos: indexers and data pipelines — 14 repos
    Add tracked repos: DeFi protocols (Folks Finance, Pact) — 6 repos
  Vague titles like "Update tracked_repos.json" will be rejected.

  Fill in every section below before marking this PR ready for review.
  Incomplete templates slow down or block approval.
-->

# Summary

<!-- One sentence: what category of repos are you adding, and why now? -->

---

## Category

<!-- Tick the **single** best-fit category for this batch.
     If your batch spans multiple categories, split it into separate PRs. -->

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

---

## Per-repo justification

<!--
  One row per repository you are adding.
  Goal: a maintainer should be able to verify each entry in under 60 seconds
  without leaving GitHub.

  Columns:
  - Repository     exact owner/name (e.g. algorand/go-algorand)
  - Category       from the list above
  - Canonical?     Y = official org repo, not a personal fork
  - Active?        Y = not archived, has a commit, release, or issue activity within the last 12 months
  - Evidence       at least one authoritative link per repo
  - Edge cases     renames, org migrations, archived predecessors — or "None"
-->

| Repository (`owner/name`) | Category | Canonical? | Active? | Evidence / source links | Edge cases |
| ------------------------- | -------- | ---------- | ------- | ----------------------- | ---------- |

<!-- Replace example rows `owner/repo-name` with your repository info before submitting -->

| `owner/repo-name` | SDK | Y | Y | [project site](https://...), [releases](https://...) | None |
| `owner/repo-name` | DeFi | Y | Y | [docs](https://...) | Renamed from `old-name` in Jan 2024 |

---

## Validation checklist

- [ ] `node .github/scripts/validate-tracked-repos.js` passes locally (same checks as CI)
- [ ] Each entry uses **exact** `["owner", "name"]` two-element array format
- [ ] No unrelated formatting changes or entry reordering
- [ ] No archives, personal forks of upstream canonical repos, or duplicates included

---

## Maintainer review notes

<!--
  Call out anything that may be ambiguous for reviewers:
    - fork lineage (why this fork instead of upstream?)
    - org ownership changes
    - archived predecessors and their active replacements
    - repos with non-obvious naming
  Leave this section blank if nothing unusual applies.
-->

Post-merge lifecycle: If a tracked repository is archived, renamed, or
transferred after merge, open an issue using the `Request removal` template, notify
@NT-Nova (or the designated CODEOWNERS) and either update `tracked_repos.json` via a
focused PR or record the change in the issue tracker for auditability.

---

## References

<!--
  At least one authoritative source per repo.

  Acceptable sources:
    - Official project website
    - Ecosystem/grants page
    - GitHub release page
    - ARC (Algorand Request for Comments) document
    - Official org README

  Not acceptable:
    - Personal blogs
    - Unverified third-party lists
    - Twitter/X posts
    - Discord messages

  Format: `owner/repo-name` — [description](https://...)
-->

- `owner/repo-name` — [source](https://...)
