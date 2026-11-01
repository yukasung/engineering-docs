# Engineering Hub — Team Knowledge Base Rules

## Purpose and Scope
- Engineering Hub is a shared team knowledge base for Developers, System Analysts, QA, DevOps, Architects, and new team members.
- Follow documentation-first engineering: clarify requirements, contracts, assumptions, and verification criteria before implementation; update docs when behavior changes.
- Current work concerns documentation architecture and foundational guidance. Backend applications, databases, Docker Compose, Kubernetes, CI/CD pipelines, authentication, and CMS require explicit separate requirements.

## Architecture and Compatibility
- Preserve Next.js App Router, the installed Nextra conventions, TypeScript strict mode, and the npm lockfile.
- Prefer built-in Nextra navigation, search, theme, code, and Mermaid features. Keep dependencies and abstractions minimal.
- Keep MDX in `content/`, presentation in `app/` or `mdx-components.tsx`, and navigation metadata in `_meta.js`.
- Avoid `any` unless justified. Use descriptive kebab-case names and do not modify unrelated files.

## Information Architecture
- Keep exactly six main navigation links, in order: Overview, Engineering Standards, Standards & Compliance, Development Workflow, Technology Guides, Projects. Overview is the root `content/index.mdx`.
- Keep the Overview focused on what Engineering Hub is, who it helps, what it contains, and how the team should use it.
- `development-workflow/`: shared Git/Pull Request, SDD, and environment-promotion guidance. Link Code Review to the canonical Engineering Standards section. Keep detailed delivery tooling under Technology Guides/DevOps.
- `technology-guides/`: reusable tool/framework guidance with explicit applicable versions.
- `engineering-standards/`: canonical cross-technology agreements for architecture, delivery, coding, testing, data, APIs, operations, and AI-assisted development. Reuse detailed workflows and Technology Guides through links; keep project-specific policies and tool configuration in Projects.
- `standards-compliance/`: canonical cross-technology guidance for ISO standards, Thai laws, governance, risk, data, audit, frameworks, and compliance checklists. Keep project implementations and evidence references in the relevant Project.
- Keep guidance in the relevant canonical workflow or technology guide, and project-specific decisions in Projects.
- `technology-guides/devops/`: shared CI/CD tooling, infrastructure, deployment, and operations guidance; link to project runbooks for actual configurations and keep detailed release/rollback guidance here.
- `projects/<slug>.mdx`: concise project overview pages. Use `projects/<slug>/` only when requirements, architecture, contracts, environments, operations, or known issues need separate maintained pages.
- Project registry pages must use available project facts and must not infer missing owners, scope, repositories, documentation URLs, versions, or review status.
- Keep troubleshooting guidance inside the relevant technology guide or project. Do not recreate a shared `/troubleshooting` landing page unless explicitly requested.
- Prefer one canonical source plus cross-links. Consolidate duplicates; do not create extensive empty placeholder pages.
- Use task/role-oriented language and Design Review questions in the main documentation.

## Content Rules
- Write primarily in Thai and retain standard English technical terminology.
- Use relevant sections for each document type, such as Overview, Purpose, Prerequisites, Guidelines, Steps, Examples, Common Issues, Checklist, and Related Documentation.
- Include an introduction (Overview or `เรื่องนี้คืออะไร?`) and related links (Related Documentation or `อ่านต่อ`). Other sections depend on purpose, not a universal five-heading template.
- Include practical examples when helpful, clearly labeled as examples. Distinguish concepts, recommendations, proposed designs, implementations, and executed verification.
- Never invent owners, approvals, review dates, results, experience, or Production/deployment claims. Never claim a lab or snippet was tested unless it was.
- Never hardcode secrets, credentials, real session/token values, or unnecessary personal data in source, docs, examples, or logs. Use environment variable names/secret references when documenting configuration.

## Documentation Writing Standards
All documentation must:
- Be written primarily in simple Thai.
- Be understandable by junior developers without assuming prior knowledge.
- Explain technical terms briefly when first introduced.
- Prefer practical examples over abstract theory.
- Use short paragraphs, short sentences, and clear headings.
- Avoid unnecessary complexity and duplicated explanations; link to the canonical guide.
- Include step-by-step instructions when appropriate, explaining necessary commands.
- Use diagrams only when they improve understanding. Keep workflow diagrams to 5–8 main steps at most and explain them below the diagram.
- Use vertical Mermaid flowcharts for linear workflows with five or more steps so labels remain readable in the content column. Keep horizontal layouts for short flows or relationship diagrams where direction materially improves understanding.
- All Mermaid diagrams must use the shared click/keyboard expansion behavior. Preserve the global zoom dialog, focus state, Escape/close behavior, and responsive overflow; do not add per-page expansion implementations.
- Center Mermaid diagrams, including flowcharts, horizontally within the main content using the shared styles in `app/globals.css`. Preserve responsive sizing, avoid per-page alignment overrides, and verify alignment on desktop and mobile when changing diagram presentation.
- Keep `1.5rem` of vertical space above and below Mermaid diagrams so flowcharts do not touch their headings or surrounding text. Apply this in the shared stylesheet; do not add blank paragraphs or per-page spacing fixes in MDX.
- Remain technically accurate and clearly label examples and unverified behavior.
- Clearly distinguish required team policies from recommendations and example conventions.
- For workflow guides, prefer `เรื่องนี้คืออะไร?`, `ใช้เมื่อไร?`, `ทำอย่างไร?`, `ตัวอย่างการใช้งานจริง`, `ข้อควรระวัง`, and `สรุป` (3–5 points maximum), omitting irrelevant sections.

## Document Metadata
- Every MDX page needs `title`, `description`, `documentType`, `owner`, `status`, `lastReviewed`, and `applicableVersions` in Nextra frontmatter.
- Use one JSON-compatible value per YAML line: double-quoted strings, `null`, or JSON objects. This is the supported, validated repository convention.
- Document types: Landing, Standard, Guide, Project, Architecture, ADR, Template, Runbook, Note.
- Status is Draft, Reviewed, Approved, or Deprecated. New/unreviewed content remains Draft.
- Owner is an actual responsible person/team or `null` if unassigned. Last Reviewed is a real content-review date in YYYY-MM-DD or `null`.
- Reviewed/Approved require an assigned owner and actual review date. Checks/builds never promote status automatically. Substantive changes require renewed review.
- `applicableVersions` maps technology to version/scope; use `{}` for version-neutral guidance and explicit unknowns for runtime versions not selected.
- Document status and ADR decision status are separate. Do not confuse Git timestamps with Last Reviewed.
- Treat this file as the canonical repository convention for document metadata and writing rules.

## Navigation and Maintenance
- Every section directory needs `index.mdx` and synchronized `_meta.js`. Use canonical root-relative links and descriptive URLs.
- When moving content, update links and `lib/documentation-redirects.mjs` to preserve existing URLs without duplicate indexed pages. When the user explicitly deletes content, remove redirects that would make deleted pages appear to remain available.
- Before moving or merging documents, summarize original files and destinations, preserve a comparison snapshot, and verify substantive content is retained before removing originals. Point legacy redirects directly at canonical destinations; keep meaningful section anchors when possible.
- Keep metadata and navigation checks aligned with this convention; do not bypass checks to hide missing content.
- Pagefind is generated after build. Rebuild after content changes to refresh search. Do not run build and dev against `.next/` simultaneously.

## Development Workflow and Shared Guidance
- Keep Git/Pull Request and SDD guidance under `content/development-workflow/`; keep deployment/release/rollback under `technology-guides/devops/`, and database migrations under the relevant database guide.
- Use consistent terms and simple Thai. Put practical commands in the relevant technology guide with explicit prerequisites.
- The main/develop model and trunk-based alternative are recommendations, not invented approved organizational policy. Branches are not environments.
- Document changes affecting environments/deployment, preserve PR/commit/tag/artifact/environment traceability, and promote tested immutable artifacts where feasible with separate configuration/secrets.
- Never recommend direct UAT/Production code or database modifications as normal practice. Emergency fixes need controlled review, approval, verification, and synchronization into active development history.
- Document schema/data/reference-data changes through version-controlled migrations. Application rollback does not imply database rollback.
- Do not recreate workflow templates or activate GitHub workflows, PR policies, or infrastructure without explicit requirements.
- Keep navigation and cross-links synchronized when the Overview changes.

## Code Review and Coding Standards
- Keep canonical Code Review and Coding Standards guidance under `content/engineering-standards/code-review-coding-standards/`; workflow, SDD, Technology Guides, and Standards & Compliance should link to it instead of copying its rules.
- Distinguish `MUST`, `SHOULD`, and `MAY`. Do not present example thresholds, reviewer counts, SLAs, or tool configurations as approved organization policy.
- Review against approved requirements, architecture, security requirements, acceptance criteria, tests, migrations, and documentation. Preserve evidence from actual checks and report unexecuted checks.
- AI review may provide evidence-based findings but never replaces required human approval, bypasses quality gates, approves or merges a Pull Request, or modifies code during a review-only task.
- Never expose secrets or sensitive data in review findings, prompts, logs, templates, or examples. Use safe placeholders and restricted evidence references.
- Findings must include evidence, impact, severity or priority, required action, and re-review state. Security severity and maintainability priority are separate dimensions.
- Exceptions require scope, owner, justification, compensating controls, approval reference, and an expiration or review date. Do not invent approvals or accepted risks.
- Keep CI/CD examples documentation-only unless pipeline activation is explicitly requested. Configure coverage and quality thresholds per project risk and baseline; do not invent universal values.

## Standards & Compliance Documentation
- Verify current editions, amendments, legal sources, and framework versions from authoritative owner sources before writing. Record explicit versions in frontmatter and link official references near the guidance.
- Clearly distinguish laws, regulations, contracts, approved organization policies, certifiable requirements, guidance standards, voluntary frameworks, recommendations, and documentation examples.
- Treat legal content as question-preparation guidance, not legal advice. Applicability, interpretation, deadlines, regulatory roles, and subordinate rules require confirmation from Legal, DPO, Compliance, or the accountable owner.
- Do not reproduce copyrighted ISO clauses or control text. Summarize concepts in the team's own words and point authorized users to licensed sources.
- Never claim certification, compliance, audit success, control effectiveness, legal approval, or evidence execution without genuine records and confirmed scope.
- Keep one canonical requirement/evidence mapping instead of duplicating checklists for ISO, NIST, OWASP, ITIL, COBIT, laws, and contracts. Include source/version, scope, owner, verification, evidence reference, gap, and review state.
- Store only safe references to restricted evidence in the Hub. Never copy secrets, personal data, customer evidence, exploitable vulnerability details, or legal-privileged material into documentation.
- Prefer a small number of practical, role-oriented pages and case studies over one placeholder page per clause, control, law section, or framework practice.

## Docker Documentation
- Keep beginner-friendly Docker guidance under `content/technology-guides/docker/`, in simple Thai with English technical terms explained on first use.
- Explain practical commands and prerequisites; keep service names (`frontend`, `backend`, `db`), paths, ports, and configuration consistent across chapters.
- Keep application/configuration examples in MDX code blocks for documentation-only tasks. Link all required files and distinguish complete labs from partial examples.
- Use current `docker compose` syntax and supported Compose fields; avoid deprecated `version`/`links` patterns.
- Never hardcode secrets in Dockerfiles, images, build arguments, Compose examples, or Git. Separate runtime secrets from build artifacts.
- Explain persistence, backups, and destructive operations before showing removal commands. Volumes do not replace database backups.
- Distinguish Local development, lab deployment, and Production requirements. Preserve immutable image traceability and safe migration ordering.
- Validate Compose examples when Docker is available and report the exact scope. Never claim Build, runtime, Ubuntu, or Production verification unless actually executed.

## PostgreSQL Documentation
- Keep beginner-friendly PostgreSQL guidance under `content/technology-guides/postgresql/`, in simple Thai with technical terms and SQL commands explained clearly.
- Use PostgreSQL-compatible SQL with explicit versions/prerequisites and the same Order Management schema across chapters: `customers`, `products`, `orders`, `order_items`, `inventory_movements`.
- Keep one canonical schema/seed source and link related examples. Distinguish SQL labs from Django-managed migration state; do not apply both blindly to one database.
- Prefer safe operations, parameterized application SQL, transaction boundaries, constraints, concurrency checks, and reviewed migrations. Distinguish schema, data, and reference-data changes.
- Never hardcode credentials or use real customer data. Warn before destructive SQL/restores and never use UAT/Production manual edits as the normal workflow.
- Keep database/application examples in MDX for documentation-only tasks. Do not change existing project databases or infrastructure.
- Execute SQL only against an explicitly disposable test database when safe and available. Verify success/failure, rollback, consistency, and restore results as applicable; report unexecuted examples accurately.
- Never claim performance, Production recovery, RPO/RTO, PITR, Django migration, or concurrency results that were not actually tested.

## Django + React Documentation
- Keep beginner-friendly Thai guidance under the existing `technology-guides/django-python/`, `react-typescript/`, and `fullstack/` sections; preserve canonical URLs and navigation.
- Keep application examples in MDX for documentation-only tasks. Explain file responsibilities and prerequisites; do not create an application or infrastructure unless separately requested.
- Use the Task contract in `content/technology-guides/fullstack/index.mdx` as the canonical source for models, API endpoints, success responses, authentication assumptions, and error envelopes. Update Django, React, and tests together when it changes.
- Prefer practical, technically accurate examples and minimal layers. Distinguish frontend presentation/state from backend validation, persistence, and authorization.
- Explain Authentication and Authorization separately. Enforce ownership in backend querysets and relevant object/create paths, not only frontend routes or filtering.
- Use first-party Django sessions with secure cookies as the primary example. Explain shared session storage across instances, CSRF protection including anonymous login, token rotation, and credentialed requests. Never disable security controls to simplify examples or recommend sensitive token/password storage in localStorage.
- Never hardcode secrets or log sensitive credentials, cookies, tokens, or request bodies. Separate Local HTTP settings from Production HTTPS requirements and explain cross-origin constraints.
- Clearly distinguish DRF default errors from the custom API envelope; handle session-related 403, validation, network errors, and safe frontend fallbacks consistently.
- Keep cross-links to PostgreSQL and Docker accurate. Do not mix the Task Django migration state with the Order SQL lab or imply older Docker snippets implement the same API contract.
- Execute examples only in isolated disposable test fixtures when appropriate. Report exact tested versions, database/runtime scope, and unexecuted Browser/Production behavior; never claim tests or integrations were run when they were not.

## Kubernetes Documentation
- Keep beginner-friendly Thai Kubernetes guidance under `content/technology-guides/kubernetes/`; explain terms and kubectl commands and preserve the existing canonical section URL.
- Keep manifests, application prerequisites, and configuration examples in MDX for documentation-only tasks. Do not create/delete clusters or deploy resources without separate explicit requirements.
- Use the shared lab contract in the Kubernetes index: `frontend`, `backend`, `db`, consistent namespaces, labels/selectors, image versions, ports, config/secret keys, and file names. Keep one canonical manifest per resource and link it across chapters.
- Distinguish the original Docker lab API from the secured Fullstack Task v1 contract. Document required image/health/proxy changes; never imply existing images contain unimplemented endpoints.
- Explain browser-accessible routing separately from internal Service DNS. Kubernetes does not provide Ingress/Gateway controllers, Metrics Server, database migrations, or application health endpoints merely from conceptual examples.
- Distinguish startup/liveness/readiness outcomes. Do not make dependency outages trigger liveness restart loops; document probe paths, Host/HTTPS behavior, budgets, and readiness limits.
- Explain HPA metrics and resource requests, node capacity, shared sessions/state, and database connection budgets; increasing web replicas does not scale PostgreSQL automatically.
- Separate local labs from Production requirements. Prefer managed or properly operated stateful PostgreSQL; StatefulSet/PVC is not automatic HA or a backup/restore plan.
- Never hardcode secrets or publish sensitive kubectl output. Explain Secret access controls/encryption limitations and Config/Secret rotation behavior.
- Use explicit contexts/namespaces in commands. Warn before destructive operations, avoid blind deletion as troubleshooting, preserve evidence, and explain that rollout undo does not undo database/configuration changes.
- Validate YAML syntax and Kubernetes schemas offline where tools are available, review cross-resource consistency, and report exact validation scope. Never claim manifests were applied, runtime-tested, scaled, recovered, or Production-ready unless actually verified.
- Keep sidebar metadata, canonical links, diagrams, and cross-references to Docker, Django/React, PostgreSQL, and CI/CD synchronized.

## Spec-Driven Development Documentation
- Keep beginner-friendly SDD guidance under `content/development-workflow/spec-driven-development/`; link reusable security frameworks and compliance checks from `content/standards-compliance/` and implementation details from the relevant Technology Guide.
- Write primarily in simple Thai, retain standard English technical terms, and prefer lightweight workflows that match the risk and complexity of the change.
- Use practical, internally consistent examples with Django REST Framework, React, PostgreSQL, Git/GitHub, Docker, and Kubernetes only where relevant.
- Keep Claude Code and OpenAI Codex guidance aligned with current official documentation. Do not invent commands, model names, permissions, automatic file-loading behavior, or agent capabilities.
- Distinguish durable repository instructions (`AGENTS.md`, `CLAUDE.md`) from feature-specific Requirements, Plan, and Validation records. Do not imply both agents interpret instruction files identically.
- Do not create every suggested SDD artifact by default. Small changes may use an issue plus acceptance criteria; larger or riskier changes need proportionate detail.
- Never claim example specifications, prompts, code, tests, migrations, deployments, or reviews were executed unless they actually were.
- Reuse canonical Git/GitHub, Fullstack, PostgreSQL, Docker, Kubernetes, and CI/CD guides through cross-links instead of duplicating their procedures.
- Keep SDD navigation, prompt examples, terminology, source links, and cross-references synchronized when the workflow changes.
- Keep Security by Design guidance practical and understandable. Address security requirements, design, implementation, validation, review, and deployment throughout the SDD workflow instead of treating security as a final scan.
- Never include real credentials, tokens, customer data, or sensitive configuration in security examples, prompts, specifications, commands, or logs. Use placeholders and approved secret references.
- Do not recommend disabling authentication, authorization, CSRF, TLS verification, certificate checks, or other security controls to simplify an example.
- Explain the security implications of AI-generated code, dependency changes, terminal access, external content, and agent permissions. Treat `AGENTS.md` and `CLAUDE.md` as instructions, not technical security boundaries.
- Reuse canonical Django, React, PostgreSQL, Docker, Kubernetes, and DevOps security guidance through links. Keep examples and Task ownership rules consistent across sections.
- Never claim an application or deployment is secure solely because automated tests, SAST, dependency scans, secret scans, or container scans pass. Report tool scope, actual results, untested areas, and remaining risks.

## Standards and Compliance Documentation
- Keep ISO, PDPA, and compliance pages concise, beginner-friendly, and clearly scoped as starting points rather than complete standards, legal advice, audit results, or certification evidence.
- Link to current authoritative sources and require the actual standard, edition, legal requirement, organization scope, owner, and review status to be confirmed before a project treats guidance as mandatory.
- Never copy licensed standard text without permission or invent compliance owners, approvals, audit findings, certifications, effective dates, or legal interpretations.
- Store references to restricted evidence rather than secrets, personal data, contracts, audit artifacts, or other controlled records in the Hub.

## Quality and Future Tasks
1. Inspect the existing project and read this file before editing.
2. Implement only the requested scope and preserve unrelated user work.
3. Run `npm run lint`, `npm run typecheck`, `npm run check:docs`, and `npm run build`.
4. Verify affected navigation, metadata, diagrams, and search in available browser/runtime tools; use `npm run check:docs -- --url <origin>` for routes, anchors, and redirects.
5. Fix introduced errors. Report checks not performed and known limitations accurately.
6. Summarize changed files, validation results, and maintenance implications.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
