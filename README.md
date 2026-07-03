# Student Performance Analytics Portal

A MERN stack platform for tracking and analyzing student academic performance.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-8-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/status-planning-blue)](./CHANGELOG.md)

---

## Problem Statement

Educational institutions struggle with fragmented, paper-based systems for tracking student grades and attendance. Teachers lack real-time visibility into class performance; students have no centralized dashboard to monitor their academic progress; and administrators cannot easily identify at-risk students or generate institution-wide reports. SPAP solves this by providing a single, role-aware web platform where every stakeholder sees the right data at the right time.

---

## Documentation

All planning and design documents live in the `docs/` directory:

| Document | Description |
|---|---|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | System architecture, Mermaid diagrams, component breakdown, deployment targets |
| [DATABASE_SCHEMA.md](docs/DATABASE_SCHEMA.md) | MongoDB collections, field specifications, indexes, ER diagram, sample documents |
| [API_PLAN.md](docs/API_PLAN.md) | Full REST API reference — 34 endpoints, request/response shapes, error codes |
| [USER_ROLES.md](docs/USER_ROLES.md) | Role-based access control, permissions matrix, route protection table |
| [wireframes/](docs/wireframes/) | Low-fidelity HTML wireframes (6 screens, desktop + mobile) |

---

## Project Structure

```
codiora/
│
├── client/                          # React 18 SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/              # Organized by feature: analytics/, auth/, dashboard/, shared/
│   │   ├── pages/                   # Route-level page components
│   │   ├── hooks/                   # useAuth, useFetch
│   │   ├── services/                # Axios-based API call wrappers (auth, grades, attendance, etc.)
│   │   ├── context/                 # AuthContext — JWT state, login/logout/register
│   │   ├── utils/                   # Constants, helpers, formatters
│   │   ├── App.jsx                  # Route definitions + ProtectedRoute guard
│   │   └── main.jsx                 # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                          # Node.js + Express REST API
│   ├── src/
│   │   ├── config/                  # db.js (MongoDB connection), env.js
│   │   ├── models/                  # Mongoose schemas: User, Student, Grade, Attendance
│   │   ├── controllers/             # Thin route handlers
│   │   ├── routes/                  # Express routers per domain
│   │   ├── middleware/               # Auth (JWT), Role (RBAC), Error handler
│   │   ├── services/                # Business logic layer
│   │   ├── utils/                   # Custom errors, constants
│   │   └── server.js                # Entry point
│   └── package.json
│
├── docs/                            # All planning and design documentation
│   ├── ARCHITECTURE.md
│   ├── DATABASE_SCHEMA.md
│   ├── API_PLAN.md
│   ├── USER_ROLES.md
│   └── wireframes/
│
├── .env.example                     # Template for server environment variables
├── .gitignore
├── CONTRIBUTING.md
├── CHANGELOG.md
└── README.md                        # You are here
```

---

## Getting Started

> **Current status:** Planning and design phase. Implementation begins after milestone approval.  
> Sections marked `[ADD: once implementation begins]` will be populated with real values when the code is written.

### Prerequisites

- Node.js 20+
- MongoDB 8+ (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm 10+

### Clone & Install

```bash
git clone https://github.com/haideralio73/student-performance-analytics-portal.git
cd student-performance-analytics-portal

# Install server dependencies
cd server
npm install             # [ADD: once implementation begins]
cd ..

# Install client dependencies
cd client
npm install             # [ADD: once implementation begins]
cd ..
```

### Environment Variables

Copy the example env files and fill in your values:

```bash
cp server/.env.example server/.env   # [ADD: once implementation begins]
cp client/.env.example client/.env   # [ADD: once implementation begins]
```

Required server variables: `MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`.  
Required client variables: `VITE_API_URL`.

### Run Development Servers

```bash
# Terminal 1 — start the API
cd server
npm run dev             # [ADD: once implementation begins]

# Terminal 2 — start the React app
cd client
npm run dev             # [ADD: once implementation begins]
```

- API: `http://localhost:5000`
- Client: `http://localhost:5173`

### Production Build

```bash
cd client
npm run build           # [ADD: once implementation begins]
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Recharts, React Router 6 |
| **Backend** | Node.js 20, Express 4, Mongoose 8, JWT, bcrypt |
| **Database** | MongoDB 8 (Mongoose ODM) |
| **Auth** | JWT (stateless), role-based access control |
| **Tooling** | ESLint, Prettier, Nodemon |

---

## Roadmap

- [x] System architecture design
- [x] Database schema design
- [x] API endpoint planning (34 endpoints)
- [x] User roles & permissions matrix
- [x] Low-fidelity wireframes (6 screens, desktop + mobile)
- [ ] Backend implementation (models, controllers, routes, middleware)
- [ ] Frontend implementation (components, pages, data fetching)
- [ ] Authentication & authorization wiring
- [ ] Analytics dashboard implementation
- [ ] Testing (unit + integration)
- [ ] Deployment (Vercel + Render + MongoDB Atlas)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions, and the PR process.

## License

MIT
