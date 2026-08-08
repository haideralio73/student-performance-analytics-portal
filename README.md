# Student Performance Analytics Portal

A full-stack MERN application for tracking and analyzing student academic performance across student, teacher, and admin roles.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite)](https://vitejs.dev/)
[![Tailwind](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/status-complete-brightgreen)](./CHANGELOG.md)

---

## Documentation

| Document | Description |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, Mermaid diagrams, deployment targets |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | MongoDB collections, fields, indexes, ER diagram, sample documents |
| [API_PLAN.md](docs/API_PLAN.md) | 40+ REST endpoints with request/response shapes and error codes |
| [USER_ROLES.md](docs/USER_ROLES.md) | RBAC matrix, JWT design, route protection table |
| [INTEGRATION.md](docs/INTEGRATION.md) | Full-stack data flow, component-to-API mapping |
| [wireframes/](docs/wireframes/) | 6 HTML wireframes (desktop + mobile) |

---

## Quick Start

### Prerequisites
- Node.js 20+
- MongoDB 7+
- npm 10+

### Install & Run

```bash
# Server
cd server && npm install
cp .env.example .env         # edit MONGO_URI and JWT_SECRET
npm run dev

# Client
cd client && npm install
cp .env.example .env         # edit VITE_API_URL if needed
npm run dev
```

- API: `http://localhost:5000`
- Client: `http://localhost:5173`

### Demo Accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@portal.edu` | `admin123` |
| Teacher | `sarah@portal.edu` | `teach123` |
| Student | `ahmed@portal.edu` | `student123` |

---

## Database

| Collection | Documents | Purpose |
|---|---|---|
| users | 24 | Auth + role management |
| students | 7 | Student profiles with guardian info |
| grades | 40 | Assessment results (exam, quiz, assignment, project) |
| attendances | 60 | Daily attendance records |

---

## API Endpoints (40+)

| Group | Endpoints |
|---|---|
| Auth | Register, Login, Refresh, Logout, GetMe |
| Users | List (paginated/filtered), GetById, Update, Delete, Create |
| Students | Create, List, GetById, Update, Delete |
| Grades | Create, List (filtered/paginated), GetById, Update, Delete |
| Attendance | Create, Bulk, List (filtered), Update |
| Analytics | Student summary, Class overview |
| Search | Unified search across 4 collections |
| Export | CSV + JSON export for all resources |

All list endpoints support: pagination (`page/limit/sort`), multi-value filters (`exam,quiz`), date ranges (`dateFrom/dateTo`), text search (`search=keyword`).

---

## Security

| Layer | Implementation |
|---|---|
| Auth | JWT (7d expiry, bcrypt 12 rounds) |
| RBAC | protect + authorize + scopedAccess middleware |
| NoSQL injection | express-mongo-sanitize |
| Parameter pollution | hpp with whitelist |
| Rate limiting | 20/15min auth, 200/15min general |
| Security headers | Helmet (CSP, HSTS, X-Frame-Options) |
| Input validation | express-validator + Mongoose schema |
| Logging | Winston (file rotation + console) |

---

## Project Structure

```
codiora/
├── client/                    # React 18 SPA (Vite + Tailwind)
│   └── src/
│       ├── components/        # analytics/, auth/, dashboard/, shared/
│       ├── pages/             # 10 page components
│       ├── hooks/             # useAuth, useFetch
│       ├── services/          # Axios API wrappers
│       ├── context/           # AuthContext (JWT state)
│       └── utils/             # Constants, helpers
├── server/                    # Express + Mongoose REST API
│   └── src/
│       ├── config/            # db.js, logger.js, env.js
│       ├── models/            # User, Student, Grade, Attendance
│       ├── controllers/       # 8 domain controllers
│       ├── routes/            # 8 route modules
│       ├── middleware/         # auth, role, validate, scopedAccess, errorHandler, performanceLogger
│       └── utils/             # apiError, constants
└── docs/                      # Architecture, Schema, API docs, Wireframes, Integration
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Recharts 2, React Router 6 |
| Backend | Node.js 20, Express 4, Mongoose 8 |
| Database | MongoDB 7 (Mongoose ODM) |
| Auth | JWT, bcryptjs, RBAC middleware |
| Security | Helmet, express-mongo-sanitize, hpp, rate-limit |
| Logging | Winston, Morgan |
| Charts | Recharts (Line, Bar, Pie, Donut) |

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
