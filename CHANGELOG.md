# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.1.0] — 2026-07-03

### Added

- System architecture document with Mermaid diagrams, component breakdown, and deployment strategy ([`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md))
- Database schema design covering 5 MongoDB collections with full field specifications, indexes, and sample documents ([`docs/DATABASE_SCHEMA.md`](docs/DATABASE_SCHEMA.md))
- API planning document with 34 REST endpoints across 6 resource groups, including request/response shapes and error codes ([`docs/API_PLAN.md`](docs/API_PLAN.md))
- User roles & permissions document with RBAC matrix, JWT design, and route protection table ([`docs/USER_ROLES.md`](docs/USER_ROLES.md))
- Low-fidelity HTML wireframes for 6 screens (login, student dashboard, teacher dashboard, admin dashboard, grade entry, analytics detail) with desktop and mobile views ([`docs/wireframes/`](docs/wireframes/))
- Project scaffold with client/ (React + Vite + Tailwind) and server/ (Express + Mongoose) directory structures and placeholder files
- Root README, CONTRIBUTING guide, .gitignore, and CHANGELOG
