# Full-Stack Integration Document

**Project:** Student Performance Analytics Portal  
**Version:** 1.0  
**Last Updated:** July 2026

---

## Data Flow Architecture

```
Browser (React SPA)
    |
    | HTTPS + JWT Bearer Token
    v
Express API Server
    |  Auth Middleware  ->  Role Middleware  ->  Scope Middleware
    |
    |  Mongoose ODM (lean(), pagination, indexes)
    v
MongoDB (Atlas / Local)
    |  Collections: users, students, grades, attendances, analyticsreports
    |
    v
JSON Response { success, data, meta }
    |
    v
React Dashboard (Recharts, Tailwind)
```

## Verified Endpoints

| Group | Endpoints | Status |
|---|---|---|
| Auth | Register, Login, Refresh, Logout, GetMe | Working |
| Users | List (paginated/filtered), GetById, Update, Delete | Working |
| Students | Create, List, GetById, Update, Delete | Working |
| Grades | Create, List (filtered), GetById, Update, Delete | Working |
| Attendance | Create, Bulk, List (filtered), Update | Working |
| Analytics | Student summary, Class overview | Working |
| Search | Unified search across 4 collections | Working |
| Export | CSV + JSON export for all resources | Working |
| Health | /api/health | Working |

## Authentication Flow

1. User submits credentials via React login form
2. Axios POST to `/api/auth/login`
3. Server returns JWT `{ success, data: { token, user } }`
4. AuthContext stores token in localStorage, user in state
5. Axios interceptor attaches `Authorization: Bearer <token>` to every request
6. `protect` middleware verifies JWT, looks up user from DB
7. `authorize` middleware checks role against route requirements
8. `scopeStudentRead` middleware limits student to own data
9. On 401 response, axios interceptor removes token and redirects to /login

## Role-Based Access

| Route | Student | Teacher | Admin |
|---|---|---|---|
| `/api/users` | 403 | 403 | 200 |
| `/api/students` GET | Scoped (own) | 200 | 200 |
| `/api/students` POST | 403 | 403 | 201 |
| `/api/grades` GET | Scoped (own) | 200 | 200 |
| `/api/grades` POST | 403 | Scoped (own courses) | 201 |
| `/api/analytics/student/:id` | Self only | Own students | All |

## Frontend-Backend Integration

| Component | API Call | Data Displayed |
|---|---|---|
| StudentDashboard | GET /grades, /attendance | 4 stat cards + 4 Recharts |
| TeacherDashboard | GET /grades, /attendance | Course cards + distribution charts |
| AdminDashboard | GET /users, /students | User panel + student roster |
| StudentsPage | GET /students, POST/PUT/DELETE | Table + CRUD modal |
| GradesPage | GET /grades | Table + Export CSV |
| AttendancePage | GET /attendance | Table + status badges + Export CSV |
| AnalyticsPage | GET /grades, /attendance | 4 chart panels |
| UsersPage | GET /users | Table + role badges + Export CSV |

## Active Database State

| Collection | Documents | Indexes |
|---|---|---|
| users | 24 | 4 |
| students | 7 | 3 |
| grades | 40 | 5 |
| attendances | 60 | 5 |
| analyticsreports | — | 3 |

## Security Layers

| Layer | Implementation |
|---|---|
| Transport | HTTPS + Helmet headers |
| Auth | JWT (7d expiry, bcrypt 12 rounds) |
| RBAC | protect + authorize + scopedAccess |
| NoSQL injection | express-mongo-sanitize |
| Parameter pollution | hpp with whitelist |
| Rate limiting | 20/15min auth, 200/15min general |
| Body size | 10kb limit |
| Input validation | express-validator + Mongoose schema |
| Error logging | Winston (file rotation + console) |
