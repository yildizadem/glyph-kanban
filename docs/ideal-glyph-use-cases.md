# Ideal Use Cases & Project Fits for Glyph

A strategic guide on identifying the best project types, architectures, and problem domains for adopting **[Glyph](https://github.com/chadetov/glyph)** (`@glyphlang/glyph`).

---

## Overview

Glyph is designed for environments where **correctness, exhaustiveness, and AI-verifiability are more critical than permissive scripting ergonomics**. It eliminates common runtime traps (such as unhandled conditions, `any` type casts, and silent mutations) by enforcing strict language-level invariants.

---

## 1. Autonomous AI-Maintained & Agentic Codebases

- **The Problem in TypeScript**: LLMs and AI coding agents frequently hallucinate APIs, use `as any` type assertions to bypass compiler errors, or forget edge cases in `switch` and `if/else` ladders.
- **How Glyph Solves It**: Glyph removes escape hatches (no `any`, no type casts) and requires exhaustive `match` arms. An AI agent cannot produce code that silently fails or leaves untyped gaps.
- **Target Systems**:
  - Codebases maintained or refactored continuously by autonomous AI agents (e.g. Antigravity, Devin, Claude Engineer).
  - Automated PR generation, bug-fixing bots, and generative code pipelines.

---

## 2. State Machines & Multi-Step Lifecycle Engines

- **The Problem in TypeScript**: Adding a new status or transition step often requires manually hunting down every conditional check across multiple files.
- **How Glyph Solves It**: Adding a single new variant to a sum type (e.g., adding `PartiallyRefunded` or `UnderAudit`) immediately triggers compiler errors in every function that hasn't explicitly handled the new state.
- **Target Systems**:
  - **E-Commerce Order Pipelines**: `Pending` $\rightarrow$ `PaymentAuthorized` $\rightarrow$ `Fulfillment` $\rightarrow$ `Shipped` $\rightarrow$ `Delivered` / `Returned`.
  - **Issue Trackers & Kanban Systems**: Ticket transitions, SLA escalation rules, and approval workflows.
  - **Onboarding & Multi-Step Wizards**: KYC compliance verification, loan applications, checkout wizards.

---

## 3. Fintech, Pricing, & Tax Calculation Engines

- **The Problem in TypeScript**: Accidental in-place mutation or implicit type coercion can cause catastrophic accounting and billing discrepancies.
- **How Glyph Solves It**:
  - **Auditable Mutation**: Every mutation requires the `mut` keyword prefix (`mut total = total + 1`). A security or financial auditor can run `grep -n "^\s*mut "` to inspect 100% of mutations in a module.
  - **Pure Transformations**: Records and collections default to immutable structures.
- **Target Systems**:
  - Tiered SaaS subscription billing & discounting engines.
  - Tax calculation, fee schedules, and currency settlement calculators.
  - Payroll, commission, and bonus formula processors.

---

## 4. Role-Based Access Control (RBAC) & Security Policy Matrices

- **The Problem in TypeScript**: Authorization logic can accidentally fail open due to a missing `else` or loose boolean fallback.
- **How Glyph Solves It**: Enforces explicit pattern matching across `(Role, Resource, Action)`. Every permission check must return a definitive boolean decision across all defined roles.
- **Target Systems**:
  - Enterprise permission engines (Admins, Managers, Members, Contractors, Viewers).
  - HIPAA / GDPR data access policies and compliance audit layers.

---

## 5. Webhook Receivers, Ingestion Pipelines, & API Decoders

- **The Problem in TypeScript**: External data from third-party APIs (Stripe, GitHub, Shopify, Salesforce) must be manually validated with external libraries like Zod.
- **How Glyph Solves It**: Every Glyph record type automatically synthesizes a runtime schema descriptor (`T.parse(unknown)`). Unregistered payload fields are rejected by default unless marked with `@open`.
- **Target Systems**:
  - Microservice event consumers and message queue workers (Kafka / RabbitMQ / SQS).
  - Third-party webhook handlers (payment confirmation, logistics updates).

---

## 6. The "Core Domain" in Hybrid DDD (Domain-Driven Design) Apps

Because Glyph transpiles to clean, standard TypeScript, it is ideal for gradual adoption in a hybrid architecture:

- **Use Glyph for**: `src/domain/` (Pure Entities, Invariants, Business Rules, State Transitions, Metric Calculators).
- **Use Standard TypeScript/React for**: `src/ui/` (Vite, React components, Tailwind, Lucide icons, browser hooks) and `src/infra/` (Database queries, Express/Fastify routing).

---

## When NOT to Use Glyph

- **Fast Throwaway Prototypes / Hackathons**: Where you need rapid, loose scripting with arbitrary object literals and third-party JS snippets.
- **UI/DOM-Heavy Animation Libraries**: Where low-level Canvas, WebGL, or reactive CSS animation pipelines require direct mutable references.
- **Glue Scripts**: Simple one-off bash-like Node.js scripts that just need to call external CLI tools.
