# BharatAI Business OS

A lightweight, multi-tenant SaaS foundation for Indian SMEs built with Next.js + Prisma + SQLite for local development.

## Overview
This project starts with Phase 1 of the PRD: auth, organization setup, dashboard shell, role model, Prisma schema, seed data, and a working local development environment.

## Features in Phase 1
- Authentication: register, login, logout, me
- Organization creation and current-org endpoints
- Role model: OWNER / ADMIN / STAFF
- Dashboard summary route and shell UI
- Prisma schema with business entities
- Seed user accounts for local dev
- Docker Compose for Postgres
- Base UI with Tailwind

## Local setup
1. Install dependencies:
   npm install
   # or pnpm install
2. Create a local env file:
   cp .env.example .env
3. Generate Prisma client and migrate the database:
   pnpm db:generate && pnpm db:migrate && pnpm db:seed
4. Start app:
   pnpm dev
5. Open http://localhost:3000

## Default demo credentials
- Demo owner: demo@bharatai.local / DemoPassword123!
- Platform admin: admin@bharatai.local / AdminPassword123!

## Scripts
- pnpm dev
- pnpm build
- pnpm typecheck
- pnpm test
- pnpm db:migrate
- pnpm db:seed

## Security note
Never commit real secrets. Use `.env` locally and keep keys in deployment secrets.

## Roadmap
See `PROGRESS.md` for current details.
