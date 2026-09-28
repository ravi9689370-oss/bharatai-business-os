# PROGRESS

Phase: 2-3 / 5 (Core Business + AI)

Status: Core business features and AI integration in progress

What is done:
- Lead CRM CRUD routes and pages
- Invoice CRUD with GST-ready schema
- AI provider abstraction (mock, OpenAI, Anthropic)
- Sales message generator API and UI
- Billing limits enforcement (leads, invoices, AI messages)
- Pricing page with plan details
- Full auth and org isolation
- Test suite for invoice calculations
- Seed data with demo users and orgs

What is next:
- Complete remaining pages: customers, support KB, marketing generator, admin panel
- Add webhook for Razorpay (mock mode in dev, real mode in prod)
- Polish UI: empty states, error handlers, loading states
- Final build + typecheck + test pass
- Generate mobile APK and web builds

Known issues:
- Mock AI provider returns templated responses
- Razorpay integration not yet complete
- Admin panel routes defined but not UI

Key decisions:
- Using SQLite locally, Postgres-compatible schema for production
- AI providers abstracted so any can be swapped via env vars
- Invoice calculations use integer math (paise) for accuracy
