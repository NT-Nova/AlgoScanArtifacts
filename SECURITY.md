# Security Policy — AlgoScanArtifacts

## Scope

This document covers two distinct concerns for this repository:

1. **Catalog integrity** — malicious, spammy, deceptive, or otherwise harmful repositories listed in `tracked_repos.json`.
2. **Automation security** — vulnerabilities in the GitHub Actions workflows or validation scripts in this repository.

---

## Supported versions

This repository does not ship versioned software. The default branch (`main`) is the only supported/maintained version. All security concerns should be reported against its current state.

---

## Reporting a catalog integrity concern

If you believe a repository in `tracked_repos.json` is:

- **Malicious** — contains malware, phishing, credential-stealing code, or social-engineering content
- **Deceptive** — impersonates a legitimate Algorand project (typosquatting, brand abuse)
- **Spam / low-quality** — mass-generated, bot-created, or clearly off-topic content
- **No longer valid** — project transferred to a new canonical location, archived with no active successor

**Action:** Open a GitHub issue using the [Report Invalid Repo](.github/ISSUE_TEMPLATE/report_invalid_repo.yml) template. Provide:

- The exact `owner/name` of the affected repository.
- A brief, factual description of the concern.
- Supporting evidence (links, screenshots, CVE references, etc.).

Maintainers will review and respond within **7 business days**. Confirmed malicious entries will be removed in the next available merge window.

> **Do not** open public issues to report repositories that contain actively exploitable vulnerabilities or credentials — use the private channel below.

---

## Reporting an automation / workflow vulnerability

If you discover a security vulnerability in the GitHub Actions workflows or scripts in this repository (e.g., script injection, secret leakage, workflow privilege escalation, dependency confusion), please **do not open a public issue**.

### Private disclosure

Use GitHub's built-in private vulnerability reporting:

1. Go to the repository's **Security** tab → **Advisories** → **New draft security advisory**
2. Fill in the advisory form with:
   - A clear description of the vulnerability
   - Steps to reproduce
   - Potential impact assessment
   - Any suggested mitigation

If you cannot use the advisory form, contact the maintainers using the contact methods listed on the NT-Nova GitHub organization page. Do not open a public issue for active exploits or credentials.

**Response SLA:**

| Stage                          | Target                                       |
| ------------------------------ | -------------------------------------------- |
| Initial acknowledgement        | 3 business days                              |
| Triage and severity assessment | 7 business days                              |
| Patch or mitigation            | 14 business days (critical issues expedited) |

---

## Out of scope

The following are considered **out of scope** for this security policy:

- Repositories in `tracked_repos.json` that have security issues within their own codebases — report those directly to the respective project maintainers.
- Feature requests or general quality improvements — open a regular GitHub issue or PR.
- False positives from automated scanners with no demonstrated impact.

---

## Disclosure policy

AlgoScanArtifacts follows **coordinated disclosure**:

- We ask reporters to allow up to 90 days for triage and remediation before public disclosure; critical issues will follow the 14-business-day patch SLA above and may be disclosed sooner if a patch is released.
- We will credit reporters in the GitHub Security Advisory unless anonymity is requested.
- We will not take legal action against good-faith security researchers.

---

## Acknowledgements

We thank all security researchers and contributors who help keep the Algorand ecosystem catalog trustworthy and safe.
