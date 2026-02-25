---
title: "Introducing Algoscan.dev: a real-time developer activity dashboard for the Algorand ecosystem"
date: "2026-03-01"
thumbnail: /images/algoscan.svg
tags: ["algoscan", "algorand", "open-source", "devtools", "dashboard"]
source_links:
  - "algoscan.dev: live site"
  - "algoscan.dev community socials"
---

We are thrilled to introduce **Algoscan.dev**, a live, open-access dashboard that tracks development activity across the Algorand GitHub ecosystem in real time. If you have ever wanted a single place to see what is being built, merged, and released across Algorand's repositories right now, this is it.

## What is Algoscan.dev?

Algoscan.dev is a real-time monitoring tool that continuously watches GitHub repositories belonging to Algorand Foundation projects, core protocol teams, and community ecosystem contributors. It aggregates commits, tracks releases, and surfaces developer activity through a fast, interactive interface. No account required, fully public, and updated live.

Think of it as a pulse monitor for Algorand's open-source ecosystem: you can see at a glance which repositories are active today, which teams are shipping, and what the broader development cadence of the ecosystem looks like.

## Why we built it

The Algorand ecosystem is large and distributed. Dozens of repositories, from the go-algorand node to AlgoKit, SDKs, indexers, wallets, and DeFi protocols, are updated concurrently by different teams. Staying informed across all of that activity using GitHub natively is genuinely difficult: you would need to follow tens of organisations, wade through notifications, and mentally assemble a picture of overall momentum.

Algoscan.dev solves that problem. It brings everything into one view, structures the signal, and keeps it live. For developers evaluating the ecosystem, for contributors tracking upstream changes, and for anyone making bets on which tools to build with, having a reliable activity pulse matters.

## How it works

### The data collection pipeline

Algoscan.dev runs a pipeline of background workers that:

1. **Clone repository mirrors:** repositories are cloned with `git --mirror`, ensuring full commit history is locally available without relying entirely on GitHub's API rate limits during burst activity.
2. **Track commits continuously:** workers fetch and store the latest commits at configurable intervals, associating them with authors, timestamps, branches, and repositories.
3. **Pull release metadata:** releases are fetched via the GitHub API and stored alongside commit data. Nightly builds and pre-releases are filtered to keep the signal clean.
4. **Detect and broadcast releases in real time:** as soon as a new tagged release appears, it is processed, stored, and broadcast live to all connected users.

### Three layers of repository tracking

Algoscan.dev supports flexible coverage of the ecosystem:

| Tracking mode               | How it works                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| **Implicit (organisation)** | When a GitHub organisation is registered, all their recently-updated public repos are automatically discovered and tracked |
| **Explicit (repo)**         | Individual repositories can be explicitly pinned for tracking regardless of how frequently they update                     |
| **Release-only**            | Tags and releases are tracked independently, so major releases never slip through regardless of commit activity            |

This combination means the dashboard covers both the everyday cadence of active projects and the punctuated moments that matter to ecosystem decision-makers.

### Real-time updates

When new commits or releases arrive, the dashboard updates without a page reload. Connected users see changes pushed directly over WebSockets so the experience feels genuinely live, not polled. The interface loads instantly even on first visit, and updates are diff-patched rather than re-rendered wholesale.

## What you can do with it today

**Browse current ecosystem activity:** the main dashboard shows commits across tracked repositories, filterable by time window and sortable by recency. You can see which repos are hot this week, which authors are shipping, and how release cadence looks across different subsystems.

**Track releases:** the release view shows published tags across ecosystem repos, filtered for stable releases. If AlgoKit, the node, the Python SDK, or any other tracked project ships a new version, it appears here within minutes of publication.

**Use the public API:** Algoscan.dev exposes a clean public REST API for anyone who wants to consume the data programmatically:

| Endpoint           | Description                                        |
| ------------------ | -------------------------------------------------- |
| `GET /api/sync`    | Repository sync status across 1,000+ tracked repos |
| `GET /api/stats`   | Aggregated ecosystem statistics                    |
| `GET /api/authors` | Author activity breakdown                          |
| `GET /api/sidebar` | Sidebar commit feed                                |
| `GET /api/chart`   | Chart visualisation data                           |

All endpoints are rate-limited to 100 requests per minute per IP, with standard `x-ratelimit-*` response headers.

**Follow on Twitter / X:** at `@algoscan`, the bot posts a daily summary of the previous day's commit activity every day at midnight UTC, plus real-time release announcements as they happen. It is a lightweight way to stay in the loop without keeping a browser tab open.

## The technology behind it

We built Algoscan.dev with a stack that reflects the maturity and reliability requirements of a production monitoring tool, one that needs to be always-on, self-healing, and reasonably cost-efficient:

| Layer              | Technology                        |
| ------------------ | --------------------------------- |
| **Frontend**       | TypeScript 5, Redux Toolkit, SCSS |
| **Database**       | PostgreSQL 16                     |
| **Caching**        | Redux Persist (client-side)       |
| **Real-time**      | WebSockets                        |
| **Infrastructure** | Docker, GitHub Actions            |

A few design decisions worth highlighting:

**Cache-first rendering:** the cache layer means that even users landing on the app for the first time see a fully populated UI within milliseconds, with live data flowing in immediately after. There is no "loading..." state for primary content.

**Security-first defaults:** rate limiting on API endpoints, OAuth CSRF state validation, secure and HttpOnly cookies, request body size limits, and structured logging with request IDs ship as standard, not as afterthoughts.

## What is coming next

Algoscan.dev is a v1, and we have a clear roadmap of improvements we are excited to ship:

- **Expanded repository coverage:** we are continuously growing the list of tracked repos and improving the automatic discovery of new ecosystem projects.
- **Contributor profiles:** individual author pages showing contribution history, activity patterns, and cross-repository impact.
- **Richer release intelligence:** changelog parsing, semantic version trend views, and upgrade path visualisation across SDK/toolchain releases.
- **Configurable notifications:** webhook or email alerts when specific repositories or authors ship, without relying on any single social platform.
- **Ecosystem health metrics:** longer-horizon trend views showing which subsystems are accelerating, which are in maintenance mode, and how dependency graphs evolve.
- **Mobile-first experience:** full responsiveness and native-quality mobile UX, so you can check ecosystem pulse from anywhere.

## A note on the curation philosophy

We track repositories that represent active, meaningful development work in the Algorand ecosystem: protocol infrastructure, SDKs, tooling, wallets, DeFi protocols, and surrounding open-source work. We intentionally filter noise. Repositories that are inactive, purely archival, or contain no meaningful commits are excluded. Nightly builds and pre-release tags are similarly filtered from the release feed.

The goal is signal, not volume. We want every item in the dashboard to be worth your attention.

## Try it now

**[algoscan.dev](https://algoscan.dev)** is live today. No account, no sign-up, no install. Open the URL and start exploring.

If you find it useful, come join the community. Feedback, suggestions, and repository inclusion requests are always welcome. We are building this for the Algorand developer community, and developer input directly shapes what comes next.

We hope Algoscan.dev becomes a useful daily resource for everyone building in and around Algorand. There has never been more happening in this ecosystem, and now there is a good place to watch it all unfold.
