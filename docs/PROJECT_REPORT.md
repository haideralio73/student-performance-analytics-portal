# Project Report — Student Performance Analytics Portal

**Intern:** Haider Ali  
**Trade:** MERN Stack Development  
**Duration:** 8 Weeks  
**Repository:** github.com/haideralio73/student-performance-analytics-portal  

---

## 1. Project Overview

The Student Performance Analytics Portal (SPAP) is a full-stack web application built on the MERN stack (MongoDB, Express, React, Node.js). It enables educational institutions to track student academic performance through three role-based interfaces: Student, Teacher, and Admin.

## 2. Problem Statement

Educational institutions rely on fragmented systems for tracking grades and attendance. Teachers lack real-time visibility into class performance, students have no centralized dashboard to monitor progress, and administrators cannot easily generate institution-wide reports. SPAP solves this by providing a single, role-aware platform.

## 3. Technologies Used

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Recharts 2, React Router 6 |
| Backend | Node.js 20, Express 4, Mongoose 8 |
| Database | MongoDB 7 |
| Authentication | JWT (jsonwebtoken), bcryptjs |
| Security | Helmet, express-mongo-sanitize, hpp, express-rate-limit |
| Validation | express-validator, Mongoose schema validation |
| Logging | Winston, Morgan |
| Testing | Custom test suite (42 scenarios), Postman |

## 4. System Architecture

```
Browser (React SPA) → REST API (Express/Node) → MongoDB
```

The application follows a three-tier client-server architecture:
- **Presentation Tier:** React SPA with Tailwind CSS and Recharts
- **Application Tier:** Express REST API with JWT authentication and RBAC middleware
- **Data Tier:** MongoDB with Mongoose ODM, 13 compound indexes

## 5. Database Design

| Collection | Documents | Indexes | Purpose |
|---|---|---|---|
| users | 24 | 4 | Authentication and role management |
| students | 7 | 3 | Student profiles with embedded guardian info |
| grades | 40 | 5 | Assessment results across subjects |
| attendances | 60 | 5 | Daily attendance tracking |

### Key Design Decisions
- MongoDB chosen over SQL for flexible document structure
- ObjectId references over embedded documents for independent write paths
- Pre-computed analytics reports for dashboard performance
- Sparse indexes for role-specific unique fields (studentId, employeeId)

## 6. API Design

### Endpoint Summary (40+ endpoints)

| Group | Endpoints | Auth |
|---|---|---|
| Auth | Register, Login, Refresh, Logout, GetMe | Public/Bearer |
| Users | List, GetById, Create, Update, Delete | Admin |
| Students | Create, List, GetById, Update, Delete | Admin/Teacher |
| Grades | Create, List, GetById, Update, Delete | Admin/Teacher |
| Attendance | Create, Bulk, List, Update | Admin/Teacher |
| Analytics | Student summary, Class overview | Bearer |
| Search | Unified search across 4 collections | Bearer |
| Export | CSV + JSON for all resources | Bearer |

### Key Features
- Pagination (page/limit/sort) on all list endpoints
- Multi-value filters (assessmentType=exam,quiz)
- Date range filtering (dateFrom/dateTo)
- Text search across multiple fields
- CSV/JSON export with all filters applied

## 7. Authentication & Security

### Authentication Flow
1. User submits credentials via React login form
2. Express validates inputs (express-validator)
3. Server hashes password (bcrypt, 12 rounds)
4. JWT signed with 7-day expiry, returned to client
5. Axios interceptor attaches `Authorization: Bearer <token>` to all requests
6. protect middleware verifies JWT and looks up user
7. authorize middleware checks role permissions
8. scopedAccess middleware enforces row-level data access

### Security Layers
- **Transport:** Helmet security headers (CSP, HSTS, X-Frame-Options)
- **Injection:** express-mongo-sanitize (NoSQL injection prevention)
- **Parameter pollution:** hpp with whitelist
- **Rate limiting:** 20 req/15min on auth, 200 req/15min general
- **Body size:** 10kb limit
- **Input validation:** express-validator + Mongoose schema validation
- **Logging:** Winston with file rotation (5MB, 5 files)

## 8. Role-Based Access Control

| Action | Student | Teacher | Admin |
|---|---|---|---|
| View own grades/attendance | Yes | Yes | Yes |
| View all students | — | Scoped (own courses) | Yes |
| Create/Edit/Delete students | — | Edit only | Yes |
| Record grades | — | Yes (own courses) | Yes |
| Mark attendance | — | Yes (own courses) | Yes |
| View all users | — | — | Yes |
| Add/Delete users | — | — | Yes |
| Export CSV reports | Own data | Own courses | All data |
| View system analytics | — | Course level | Yes |

## 9. Frontend Implementation

### Pages (10 total)
- Login / Register (split-panel, SVG logo, role selector cards)
- Student Dashboard (4 stat cards + 4 Recharts charts)
- Teacher Dashboard (course cards, quick actions, charts)
- Admin Dashboard (user panel, student roster, management cards)
- Students Page (CRUD with one-click create + dropdown)
- Grades Page (CRUD with modal, export CSV)
- Attendance Page (CRUD with modal, status badges)
- Analytics Page (4 chart panels with colored borders)
- Users Page (add/delete, role badges, export CSV)
- Settings Page (profile + security sections)

### UI Features
- Dark theme (bg-gray-900/gray-950)
- 22 custom SVG icons + gradient logo
- Recharts visualizations (Line, Bar, Pie, Donut)
- Scrollable modals with custom select dropdowns
- Loading spinners, empty states, toast notifications
- Responsive sidebar with role-based navigation

## 10. Testing

### Test Suite Coverage (42 scenarios)
- Auth: Register, Login, Refresh, Logout, GetMe
- CRUD: Students, Grades, Attendance
- RBAC: 401 unauthorized, 403 forbidden, role scoping
- Validation: Empty fields, invalid emails, short passwords
- API: Search, Export CSV/JSON, filtering, pagination
- Error: 404 not found, 409 duplicate, 400 bad request

### Test Results
- All 42 scenarios verified
- 10/10 final verification checks passed
- Build: 910 modules, 0 errors

## 11. Project Timeline

| Week | Focus | Deliverables |
|---|---|---|
| 1 | Project Planning | Architecture, DB schema, wireframes, API plan |
| 2 | Backend Setup | Express server, MongoDB, Student CRUD |
| 3 | Authentication | JWT, bcrypt, input validation, rate limiting |
| 4 | RBAC & Integration | Role-based scoping, frontend-backend connection |
| 5 | Advanced APIs | Search, filters, CSV export, Winston logging |
| 6 | Security & Testing | mongo-sanitize, hpp, test suite, error handling |
| 7 | Full Integration | End-to-end flow, CRUD UI, dashboard charts |
| 8 | Finalization | Code cleanup, documentation, final demo |

## 12. Learning Outcomes

Through this internship, I gained practical experience in:
- Designing and implementing RESTful APIs with Express and Mongoose
- Implementing JWT-based authentication with bcrypt password hashing
- Building role-based access control with middleware composition
- Creating responsive React SPAs with Tailwind CSS and Recharts
- Optimizing MongoDB queries with compound indexes and lean()
- Applying security best practices (Helmet, rate limiting, input sanitization)
- Structuring a professional MERN project with separation of concerns
- Testing APIs systematically and handling edge cases
- Documenting technical decisions for maintainability

## 13. Conclusion

The Student Performance Analytics Portal is a production-ready full-stack application that demonstrates professional MERN development practices. It features a secure authentication system, comprehensive RBAC, optimized database queries, real-time data visualizations, and a polished dark-themed UI. The project is fully documented with architecture diagrams, API specifications, database schemas, and integration documentation.
