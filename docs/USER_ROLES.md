# User Roles & Permissions

**Project:** Student Performance Analytics Portal  
**Authorization Model:** Role-Based Access Control (RBAC)  
**Version:** 1.0  
**Last Updated:** July 2026

---

## 1. Role Definitions

### Student

The primary consumer of the platform. Students view their own academic data — grades, attendance, and performance analytics — across all courses in which they are enrolled. They have no write access to any resource and cannot see other students' data.

### Teacher

Instructors responsible for one or more courses. Teachers can record grades and mark attendance **only for students enrolled in their own courses**. They can view aggregated analytics for their courses (class averages, grade distributions, attendance rates) but cannot see individual student data outside their course roster. Teachers cannot create courses or manage user accounts.

### Admin

System-wide administrative role. Admins have unrestricted access to all resources: they manage user accounts (create, update, delete), student profiles, courses, and can view all grades and attendance records. Admins can export reports and view system-wide analytics across all courses and terms. This role is not scoped — access is global.

---

## 2. Permissions Matrix

| # | Action | Student | Teacher | Admin |
|---|---|---|---|---|
| 1 | View own grades (all courses) | Yes | Yes | Yes |
| 2 | View own attendance (all courses) | Yes | Yes | Yes |
| 3 | View own performance analytics | Yes | Yes | Yes |
| 4 | View grades for students in **own** courses | — | Yes | — |
| 5 | View grades for **any** student | — | — | Yes |
| 6 | View attendance for students in **own** courses | — | Yes | — |
| 7 | View attendance for **any** student | — | — | Yes |
| 8 | Submit / edit a grade | — | Own courses only | Yes |
| 9 | Delete a grade | — | — | Yes |
| 10 | Mark attendance (single or bulk) | — | Own courses only | Yes |
| 11 | Edit an attendance record | — | Own courses only | Yes |
| 12 | View own course list (enrolled) | Yes | — | — |
| 13 | View own course list (teaching) | — | Yes | Yes |
| 14 | View all courses | — | — | Yes |
| 15 | Create / edit a course | — | — | Yes |
| 16 | Delete or archive a course | — | — | Yes |
| 17 | Enroll / unenroll students in a course | — | — | Yes |
| 18 | View all user accounts | — | — | Yes |
| 19 | Create / edit user accounts | — | — | Yes |
| 20 | Delete user accounts | — | — | Yes |
| 21 | View course-level analytics (own courses) | — | Yes | — |
| 22 | View system-wide analytics | — | — | Yes |
| 23 | Export reports (CSV / PDF) | Own data only | Own courses only | Yes |
| 24 | Access admin settings | — | — | Yes |

---

## 3. Access Scope Rules

Access scope is **enforced at the API middleware level**, not merely hidden in the UI. A student calling `GET /api/grades?student=<other_student_id>` must receive a 403 response, regardless of whether the frontend hides that filter.

### 3.1 Student Scope

- All `GET` endpoints that return grade, attendance, or analytics data for a student are implicitly scoped to `req.user.id`.
- If a student supplies a query parameter targeting another student (e.g. `?student=<foreign_id>`), the server must **ignore or override** that parameter with their own ID — not expose data.
- Students cannot access any `POST`, `PUT`, or `DELETE` endpoints on grades, attendance, courses, or users.

### 3.2 Teacher Scope

- A teacher may only interact with data for students who are enrolled in a course they teach.
- **Enforcement mechanism:** Before any write to grades or attendance, the server queries the `courses` collection to verify `course.teacher === req.user.id` **and** `studentId ∈ course.students`. If either check fails, the server returns 403.
- For read queries (e.g. `GET /api/grades?course=X`), the server pre-filters the course list to only those where `course.teacher === req.user.id`.
- Teachers can never escalate to admin — the `role` middleware blocks any route marked `authorize('admin')`.

### 3.3 Admin Scope

- No scope restrictions. Admins pass all `authorize()` middleware checks.
- Admin endpoints (`/api/users`, course management, report exports) are gated behind `authorize('admin')`.
- Admins can impersonate no one — there is no "act as" feature. Admin actions are auditable via the `recordedBy` / `markedBy` fields on grades and attendance.

### 3.4 Scope Enforcement Flow

```
Client Request
      │
      ▼
┌─────────────────┐
│ 1. auth.js       │  Verifies JWT → attaches req.user { id, role }
└────────┬────────┘
         ▼
┌─────────────────┐
│ 2. role.js       │  Checks req.user.role ∈ allowedRoles for the route
└────────┬────────┘
         ▼
┌─────────────────┐
│ 3. Controller     │
│    (scope check) │  For teacher routes: validates course ownership
│                   │  For student routes: overrides query filters to req.user.id
└────────┬────────┘
         ▼
┌─────────────────┐
│ 4. Service        │  Executes the data operation within the enforced scope
└─────────────────┘
```

---

## 4. JWT Token Payload & Auth Implementation

### 4.1 Token Contents

The JWT is generated at login/registration and carries the minimal payload required to identify and authorize the user on every request:

```json
{
  "id": "60a1b2c3d4e5f60001000002",
  "role": "teacher",
  "iat": 1720000000,
  "exp": 1720604800
}
```

| Claim | Type | Purpose |
|---|---|---|
| `id` | String (ObjectId) | Unique user identifier — used to look up the full user document on each request |
| `role` | String | One of `student`, `teacher`, `admin` — used by the RBAC middleware |
| `iat` | Number (epoch) | Issued-at timestamp (added automatically by `jsonwebtoken`) |
| `exp` | Number (epoch) | Expiration timestamp (derived from `JWT_EXPIRES_IN`) |

### 4.2 What Does NOT Go in the Token

- **Assigned course IDs for teachers** are **not** embedded in the token. Tokens are long-lived (up to `JWT_EXPIRES_IN`, e.g. 7 days). Course assignments change — if a teacher's courses are updated, their still-valid token would carry stale data. Instead, the server queries `courses.find({ teacher: req.user.id })` when scoping teacher operations. This adds one indexed query per request but guarantees correct, up-to-date authorization.
- **Student IDs** — a teacher token does not need to enumerate their students because the server resolves the roster at query time via the `courses` collection.
- **Personal data** — no name, email, or profile fields. The token is only for identity and authorization; profile data is fetched from the database on `GET /api/auth/me`.

### 4.3 Token Lifecycle

```
POST /api/auth/login
  │  email + password verified
  │  jwt.sign({ id, role }, secret, { expiresIn })
  ▼
  JWT returned to client
  │  localStorage.setItem('token', token)
  ▼
Every subsequent request
  │  Axios interceptor → Authorization: Bearer <token>
  ▼
  protect middleware → jwt.verify(token, secret) → req.user
  │
  ├─ Token valid?    → Continue to role check
  ├─ Token expired?  → 401, client interceptor redirects to /login
  └─ Token malformed? → 401
```

### 4.4 Role Middleware (Implementation Reference)

```js
// middleware/role.js
export const authorize = (...roles) => {
  return (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        message: `Role '${req.user.role}' is not authorized for this resource`,
      });
      return;
    }
    next();
  };
};

// Usage in routes:
router.post('/grades', protect, authorize('admin', 'teacher'), createGrade);
```

### 4.5 Teacher Scope Middleware (Implementation Reference)

```js
// middleware/teacherScope.js
import Course from '../models/Course.js';

export const verifyCourseOwnership = async (req, _res, next) => {
  if (req.user.role === 'admin') return next(); // admins bypass

  const courseId = req.body.course || req.params.courseId;
  const course = await Course.findById(courseId);

  if (!course || course.teacher.toString() !== req.user.id) {
    res.status(403).json({ message: 'You do not teach this course.' });
    return;
  }

  req.course = course; // attach for downstream use
  next();
};
```

---

## 5. Role-Based Route Protection

The table below maps every API route to the roles permitted to access it. This serves as the reference for building backend middleware.

### 5.1 Authentication (`/api/auth`)

| Method | Route | Student | Teacher | Admin | Notes |
|---|---|---|---|---|---|
| POST | `/api/auth/register` | Public | Public | Public | First admin is seeded manually or via script |
| POST | `/api/auth/login` | Public | Public | Public | Returns JWT |
| GET | `/api/auth/me` | Bearer | Bearer | Bearer | Returns the authenticated user's profile |

### 5.2 Users (`/api/users`)

| Method | Route | Student | Teacher | Admin |
|---|---|---|---|---|
| GET | `/api/users` | — | — | Admin |
| GET | `/api/users/:id` | — | — | Admin |
| POST | `/api/users` | — | — | Admin |
| PUT | `/api/users/:id` | — | — | Admin |
| DELETE | `/api/users/:id` | — | — | Admin |

### 5.3 Students (`/api/students`)

*Note: If the unified `users` collection design (from DATABASE_SCHEMA.md) is adopted, these routes may be consolidated into `/api/users`. The table below assumes the current separate-collection design.*

| Method | Route | Student | Teacher | Admin | Scope Rule |
|---|---|---|---|---|---|
| GET | `/api/students` | — | Teacher | Admin | Teacher sees only students in their courses |
| POST | `/api/students` | — | — | Admin | |
| GET | `/api/students/:id` | Self only | If enrolled in own course | Admin | Self or scoped |
| PUT | `/api/students/:id` | — | — | Admin | |
| DELETE | `/api/students/:id` | — | — | Admin | |

### 5.4 Courses (`/api/courses`)

| Method | Route | Student | Teacher | Admin | Scope Rule |
|---|---|---|---|---|---|
| GET | `/api/courses` | Enrolled only | Teaching only | Admin | Scoped by user |
| POST | `/api/courses` | — | — | Admin | |
| GET | `/api/courses/:id` | If enrolled | If teaching | Admin | Scoped |
| PUT | `/api/courses/:id` | — | — | Admin | |
| DELETE | `/api/courses/:id` | — | — | Admin | Soft-delete (archive) preferred |
| POST | `/api/courses/:id/enroll` | — | — | Admin | Add student to roster |
| DELETE | `/api/courses/:id/enroll/:studentId` | — | — | Admin | Remove student from roster |

### 5.5 Grades (`/api/grades`)

| Method | Route | Student | Teacher | Admin | Scope Rule |
|---|---|---|---|---|---|
| GET | `/api/grades` | Own only | Own courses only | All | Student: `student` filter forced to `req.user.id`. Teacher: `course` filter pre-scoped. |
| POST | `/api/grades` | — | Own courses only | Yes | Must verify `req.body.course` belongs to teacher |
| GET | `/api/grades/:id` | If own | If student in own course | Yes | |
| PUT | `/api/grades/:id` | — | Own courses only | Yes | Must re-verify course ownership on the existing grade |
| DELETE | `/api/grades/:id` | — | — | Admin | |

### 5.6 Attendance (`/api/attendance`)

| Method | Route | Student | Teacher | Admin | Scope Rule |
|---|---|---|---|---|---|
| GET | `/api/attendance` | Own only | Own courses only | All | Same scoping rules as grades |
| POST | `/api/attendance` | — | Own courses only | Yes | Single record |
| POST | `/api/attendance/bulk` | — | Own courses only | Yes | Array of records; verify `course` ownership once |
| PUT | `/api/attendance/:id` | — | Own courses only | Yes | Re-verify course ownership |

### 5.7 Analytics (`/api/analytics`)

| Method | Route | Student | Teacher | Admin | Scope Rule |
|---|---|---|---|---|---|
| GET | `/api/analytics/student/:studentId` | Self only | If student in own course | Yes | Student: `studentId` forced to `req.user.id` |
| GET | `/api/analytics/course/:courseId` | If enrolled | If teaching | Yes | |
| GET | `/api/analytics/class-overview` | — | — | Admin | System-wide aggregates |
| GET | `/api/analytics/export` | Own data only | Own courses only | Yes | Generates CSV/PDF |

### 5.8 Reports / Export

| Method | Route | Student | Teacher | Admin | Scope Rule |
|---|---|---|---|---|---|
| GET | `/api/reports/grades/pdf` | Own only | Own courses only | All | Scoped |
| GET | `/api/reports/attendance/csv` | Own only | Own courses only | All | Scoped |
| GET | `/api/reports/system` | — | — | Admin | Cross-course, cross-term |

---

## 6. Quick Reference Card

```
                    ┌─────────┬─────────┬─────────┐
                    │ Student │ Teacher │  Admin  │
┌───────────────────┼─────────┼─────────┼─────────┤
│ View own grades   │    ✓    │    ✓    │    ✓    │
│ View own attnd    │    ✓    │    ✓    │    ✓    │
│ View own stats    │    ✓    │    ✓    │    ✓    │
│ View others' data │    —    │ scoped  │    ✓    │
│ Record grades     │    —    │ scoped  │    ✓    │
│ Mark attendance   │    —    │ scoped  │    ✓    │
│ Manage courses    │    —    │    —    │    ✓    │
│ Manage users      │    —    │    —    │    ✓    │
│ View all analytics│    —    │ scoped  │    ✓    │
│ Export reports    │   own   │ scoped  │    ✓    │
│ Access settings   │    —    │    —    │    ✓    │
└───────────────────┴─────────┴─────────┴─────────┘

scoped = limited to students enrolled in the teacher's own courses
own    = limited to the authenticated user's own data
```

---

## 7. Enforcement Checklist

When implementing or reviewing the backend, verify each point:

- [ ] `protect` middleware runs on every route that is not `/api/auth/login` or `/api/auth/register`
- [ ] `authorize()` middleware gates every admin-only route
- [ ] Teacher-scope middleware verifies `course.teacher === req.user.id` before any grade/attendance write
- [ ] Student-read routes override or ignore `?student=<foreign_id>` query params
- [ ] Grade/attendance deletion is restricted to admins only (no teacher can delete)
- [ ] Course management (create, update, delete, enroll) is admin-only
- [ ] Export/report routes apply the same scoping rules as their corresponding data routes
- [ ] `recordedBy` and `markedBy` fields are set to `req.user.id` on every write
- [ ] 401 is returned for missing/expired tokens; 403 is returned for insufficient role/permission
- [ ] Frontend route guards mirror backend protection (ProtectedRoute component with role array)
