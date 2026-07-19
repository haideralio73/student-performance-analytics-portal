# API Planning Document

**Project:** Student Performance Analytics Portal  
**Protocol:** REST over HTTPS  
**Content-Type:** `application/json`  
**Version:** 1.0  
**Last Updated:** July 2026

---

## 1. Conventions

### 1.1 Base URL

```
Development:  http://localhost:5000/api
Production:   https://api.spap.example.com/api
```

### 1.2 Authentication Header

All protected endpoints require a JWT sent as a Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

The token is returned by `POST /api/auth/login` and `POST /api/auth/register`. The client stores it (e.g. `localStorage`) and attaches it to every request via an Axios interceptor.

### 1.3 Standard Response Envelope

**Success:**

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 20, "total": 142 }
}
```

Single-resource responses omit `meta`. List endpoints include `meta` for pagination.

**Error:**

```json
{
  "success": false,
  "message": "Human-readable description of the error",
  "errors": [
    { "field": "email", "message": "Email is already registered" }
  ]
}
```

The `errors` array is present only for validation failures (400). Other errors include only `success` and `message`. In development mode (`NODE_ENV=development`), a `stack` field may be appended.

### 1.4 Pagination

List endpoints accept the following query parameters:

| Param | Type | Default | Max | Description |
|---|---|---|---|---|
| `page` | number | 1 | — | Page number (1-indexed) |
| `limit` | number | 20 | 100 | Items per page |
| `sort` | string | `-createdAt` | — | Sort field; prefix with `-` for descending |

Pagination metadata is returned in the `meta` object:

```json
{
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "pages": 8
  }
}
```

### 1.5 Filtering & Searching

List endpoints accept optional query parameters for filtering. Filtered fields are documented per endpoint. Common patterns:

- `?student=<ObjectId>` — filter by student
- `?course=<ObjectId>` — filter by course
- `?term=Spring` — filter by term
- `?date=2026-03-15` — exact date match
- `?dateFrom=2026-01-01&dateTo=2026-06-30` — date range
- `?search=keyword` — text search (where available)

---

## 2. Auth (`/api/auth`)

### 2.1 Register

```
POST /api/auth/register
```

**Purpose:** Create a new user account and return a JWT.

**Auth:** Public

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | 2–100 chars, trimmed |
| `email` | string | yes | Valid email, unique |
| `password` | string | yes | Min 6 characters |
| `role` | string | yes | `student`, `teacher`, or `admin` |

```json
{
  "name": "Aisha Khan",
  "email": "aisha.khan@university.edu",
  "password": "securepass123",
  "role": "student"
}
```

**Success Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "60a1b2c3d4e5f60001000001",
      "name": "Aisha Khan",
      "email": "aisha.khan@university.edu",
      "role": "student"
    }
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Email is already registered"` |
| `400` | `"Validation failed"` + `errors` array (missing field, short password, invalid role) |

---

### 2.2 Login

```
POST /api/auth/login
```

**Purpose:** Authenticate a user and return a JWT.

**Auth:** Public

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | yes | Registered email |
| `password` | string | yes | Plain-text password |

```json
{
  "email": "aisha.khan@university.edu",
  "password": "securepass123"
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "60a1b2c3d4e5f60001000001",
      "name": "Aisha Khan",
      "email": "aisha.khan@university.edu",
      "role": "student"
    }
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `401` | `"Invalid email or password"` |
| `400` | `"Validation failed"` (missing email or password) |

---

### 2.3 Refresh Token

```
POST /api/auth/refresh
```

**Purpose:** Exchange a valid (but near-expiry) JWT for a new token with a fresh expiry. This allows extending a session without re-entering credentials.

**Auth:** Authenticated (valid, non-expired token required)

**Request Body:** None.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `401` | `"Not authorized, no token provided"` |
| `401` | `"Not authorized, token invalid or expired"` |

> **Note:** If the token has already expired, the client must redirect to login. Refresh only works with a still-valid token.

---

### 2.4 Get Current User (Profile)

```
GET /api/auth/me
```

**Purpose:** Return the authenticated user's full profile.

**Auth:** Authenticated

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60a1b2c3d4e5f60001000001",
    "name": "Aisha Khan",
    "email": "aisha.khan@university.edu",
    "role": "student",
    "studentId": "STU-2024-0142",
    "programme": "Computer Science",
    "enrollmentYear": 2024,
    "guardian": {
      "name": "Fatima Khan",
      "phone": "+92-300-1112233",
      "email": "fatima.khan@email.com"
    },
    "createdAt": "2024-09-01T08:00:00.000Z",
    "updatedAt": "2026-06-15T14:30:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `401` | `"Not authorized, no token provided"` |
| `401` | `"User no longer exists"` |

---

### 2.5 Logout

```
POST /api/auth/logout
```

**Purpose:** Invalidate the current token on the server side. Tokens are stateless JWTs, so this endpoint blacklists the token in a server-side cache (Redis or in-memory set) with a TTL equal to the token's remaining lifespan. The client should also discard the token locally.

**Auth:** Authenticated

**Request Body:** None.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "message": "Logged out successfully"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `401` | `"Not authorized, no token provided"` |

> **Note:** If a token blacklist is not yet implemented, this endpoint returns 200 and the client is responsible for removing the token from `localStorage`. Server-side invalidation can be added later without changing the client contract.

---

## 3. Users (`/api/users`)

All endpoints in this group require **Admin** role unless noted otherwise.

### 3.1 List Users

```
GET /api/users
```

**Purpose:** List all user accounts (paginated, filterable by role).

**Auth:** Admin

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `role` | string | — | Filter by `student`, `teacher`, or `admin` |
| `search` | string | — | Full-text search across `name` and `email` |
| `page` | number | 1 | |
| `limit` | number | 20 | Max 100 |
| `sort` | string | `-createdAt` | |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": "60a1b2c3d4e5f60001000001",
      "name": "Aisha Khan",
      "email": "aisha.khan@university.edu",
      "role": "student",
      "studentId": "STU-2024-0142",
      "programme": "Computer Science",
      "createdAt": "2024-09-01T08:00:00.000Z"
    },
    {
      "id": "60a1b2c3d4e5f60001000002",
      "name": "Dr. Marcus Rivera",
      "email": "m.rivera@university.edu",
      "role": "teacher",
      "department": "Mathematics",
      "createdAt": "2019-08-15T09:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 1204, "pages": 61 }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `401` | `"Not authorized, no token provided"` |
| `403` | `"Role 'student' is not authorized for this resource"` |

---

### 3.2 Get User by ID

```
GET /api/users/:id
```

**Purpose:** Get a single user's full details.

**Auth:** Admin (or self: any authenticated user can view their own profile using `GET /api/auth/me`)

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60a1b2c3d4e5f60001000001",
    "name": "Aisha Khan",
    "email": "aisha.khan@university.edu",
    "role": "student",
    "studentId": "STU-2024-0142",
    "programme": "Computer Science",
    "enrollmentYear": 2024,
    "guardian": {
      "name": "Fatima Khan",
      "phone": "+92-300-1112233",
      "email": "fatima.khan@email.com"
    },
    "createdAt": "2024-09-01T08:00:00.000Z",
    "updatedAt": "2026-06-15T14:30:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `403` | `"Role 'student' is not authorized for this resource"` |
| `404` | `"User not found"` |

---

### 3.3 Create User

```
POST /api/users
```

**Purpose:** Admin creates a new user account.

**Auth:** Admin

**Request Body:**

```json
{
  "name": "James Chen",
  "email": "james.chen@university.edu",
  "password": "temppass123",
  "role": "student",
  "studentId": "STU-2024-0187",
  "programme": "Physics",
  "enrollmentYear": 2024
}
```

**Success Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": "60a1b2c3d4e5f60001000004",
    "name": "James Chen",
    "email": "james.chen@university.edu",
    "role": "student",
    "studentId": "STU-2024-0187",
    "programme": "Physics",
    "enrollmentYear": 2024,
    "createdAt": "2026-07-01T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Email is already registered"` |
| `400` | `"Validation failed"` + `errors` array |
| `403` | `"Role 'teacher' is not authorized for this resource"` |

---

### 3.4 Update User

```
PUT /api/users/:id
```

**Purpose:** Admin updates an existing user's details (name, email, role, profile fields). Password changes are handled by a separate endpoint.

**Auth:** Admin

**Request Body** (all fields optional — send only what changed):

```json
{
  "name": "James Chen-Updated",
  "programme": "Applied Physics"
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60a1b2c3d4e5f60001000004",
    "name": "James Chen-Updated",
    "email": "james.chen@university.edu",
    "role": "student",
    "studentId": "STU-2024-0187",
    "programme": "Applied Physics",
    "enrollmentYear": 2024,
    "updatedAt": "2026-07-01T12:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Validation failed"` + `errors` array |
| `404` | `"User not found"` |

---

### 3.5 Delete User

```
DELETE /api/users/:id
```

**Purpose:** Admin deletes a user account. Associated grades and attendance records are **not** cascade-deleted — they remain for audit purposes but the user reference becomes orphaned (handled by `null` checks in queries).

**Auth:** Admin

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "message": "User removed"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `404` | `"User not found"` |

---

### 3.6 Update Own Profile

```
PUT /api/users/profile
```

**Purpose:** Authenticated user updates their own profile fields (name, email, guardian info). Cannot change role or studentId. Password changes go through a separate endpoint.

**Auth:** Authenticated

**Request Body** (all fields optional):

```json
{
  "name": "Aisha Khan-Updated",
  "guardian": {
    "phone": "+92-300-9998877"
  }
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60a1b2c3d4e5f60001000001",
    "name": "Aisha Khan-Updated",
    "email": "aisha.khan@university.edu",
    "role": "student",
    "studentId": "STU-2024-0142",
    "programme": "Computer Science",
    "guardian": {
      "name": "Fatima Khan",
      "phone": "+92-300-9998877",
      "email": "fatima.khan@email.com"
    },
    "updatedAt": "2026-07-01T14:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Validation failed"` + `errors` array |
| `401` | `"Not authorized, no token provided"` |

---

### 3.7 Change Password

```
PUT /api/users/password
```

**Purpose:** Authenticated user changes their own password. Requires the current password for verification.

**Auth:** Authenticated

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `currentPassword` | string | yes | Existing password for verification |
| `newPassword` | string | yes | Min 6 characters |

```json
{
  "currentPassword": "securepass123",
  "newPassword": "newSecure456"
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "message": "Password updated successfully"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Current password is incorrect"` |
| `400` | `"Validation failed"` (new password too short) |

---

## 4. Courses (`/api/courses`)

### 4.1 List Courses

```
GET /api/courses
```

**Purpose:** List courses. Scoped by role: students see enrolled courses, teachers see courses they teach, admins see all courses.

**Auth:** Authenticated

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `term` | string | — | e.g. `Spring` |
| `academicYear` | string | — | e.g. `2025-2026` |
| `status` | string | — | `active` or `archived` |
| `page` | number | 1 | |
| `limit` | number | 20 | |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": "60c1d2e3f4a5b60001000010",
      "name": "Data Structures and Algorithms",
      "code": "CS-201",
      "teacher": {
        "id": "60a1b2c3d4e5f60001000002",
        "name": "Dr. Marcus Rivera"
      },
      "studentCount": 32,
      "term": "Spring",
      "academicYear": "2025-2026",
      "status": "active",
      "createdAt": "2026-01-10T08:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 48, "pages": 3 }
}
```

> **Note:** The `students` array is **not** included in the list response (it can be large). Use `GET /api/courses/:id` for the full roster.

---

### 4.2 Get Course by ID

```
GET /api/courses/:id
```

**Purpose:** Get full course details including the enrolled student roster.

**Auth:** Authenticated, scoped (student must be enrolled; teacher must teach it; admin sees all)

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60c1d2e3f4a5b60001000010",
    "name": "Data Structures and Algorithms",
    "code": "CS-201",
    "description": "Fundamental data structures, algorithm analysis, and complexity theory.",
    "teacher": {
      "id": "60a1b2c3d4e5f60001000002",
      "name": "Dr. Marcus Rivera",
      "email": "m.rivera@university.edu"
    },
    "students": [
      { "id": "60a1b2c3d4e5f60001000001", "name": "Aisha Khan", "studentId": "STU-2024-0142" },
      { "id": "60a1b2c3d4e5f60001000004", "name": "James Chen", "studentId": "STU-2024-0187" }
    ],
    "term": "Spring",
    "academicYear": "2025-2026",
    "status": "active",
    "createdAt": "2026-01-10T08:00:00.000Z",
    "updatedAt": "2026-06-28T16:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `403` | `"You are not enrolled in this course"` |
| `404` | `"Course not found"` |

---

### 4.3 Create Course

```
POST /api/courses
```

**Purpose:** Admin creates a new course and assigns a teacher.

**Auth:** Admin

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `name` | string | yes | e.g. "Data Structures" |
| `code` | string | yes | Unique, e.g. "CS-201" |
| `description` | string | no | |
| `teacher` | ObjectId | yes | Must reference a user with role=`teacher` |
| `term` | string | yes | `Spring`, `Fall`, or `Summer` |
| `academicYear` | string | yes | e.g. `"2025-2026"` |

```json
{
  "name": "Operating Systems",
  "code": "CS-301",
  "description": "Process management, memory management, file systems.",
  "teacher": "60a1b2c3d4e5f60001000002",
  "term": "Fall",
  "academicYear": "2026-2027"
}
```

**Success Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": "60c1d2e3f4a5b60001000012",
    "name": "Operating Systems",
    "code": "CS-301",
    "description": "Process management, memory management, file systems.",
    "teacher": "60a1b2c3d4e5f60001000002",
    "students": [],
    "term": "Fall",
    "academicYear": "2026-2027",
    "status": "active",
    "createdAt": "2026-07-01T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Course code 'CS-201' already exists"` |
| `400` | `"Assigned teacher does not exist or is not a teacher"` |
| `400` | `"Validation failed"` + `errors` array |

---

### 4.4 Update Course

```
PUT /api/courses/:id
```

**Purpose:** Admin updates course metadata (name, code, description, teacher, term, status).

**Auth:** Admin

**Request Body** (all fields optional — send only what changed):

```json
{
  "status": "archived",
  "description": "Updated description..."
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60c1d2e3f4a5b60001000010",
    "name": "Data Structures and Algorithms",
    "code": "CS-201",
    "description": "Updated description...",
    "status": "archived",
    "updatedAt": "2026-07-01T15:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Course code already in use by another course"` |
| `404` | `"Course not found"` |

---

### 4.5 Enroll Student in Course

```
POST /api/courses/:id/enroll
```

**Purpose:** Admin enrolls a student (adds them to the `students` array). Idempotent — enrolling a student who is already enrolled returns the course unchanged.

**Auth:** Admin

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `studentId` | ObjectId | yes | Must reference a user with role=`student` |

```json
{
  "studentId": "60a1b2c3d4e5f60001000001"
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60c1d2e3f4a5b60001000010",
    "name": "Data Structures and Algorithms",
    "code": "CS-201",
    "studentCount": 33,
    "message": "Student enrolled"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"User is not a student"` |
| `404` | `"Course not found"` |
| `404` | `"Student not found"` |

---

### 4.6 Unenroll Student from Course

```
DELETE /api/courses/:id/enroll/:studentId
```

**Purpose:** Admin removes a student from the course roster.

**Auth:** Admin

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "message": "Student unenrolled from course"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `404` | `"Course not found"` |
| `404` | `"Student is not enrolled in this course"` |

---

### 4.7 Delete Course

```
DELETE /api/courses/:id
```

**Purpose:** Admin permanently deletes a course. Associated grades and attendance records are **not** cascade-deleted (retained for audit).

**Auth:** Admin

> **Recommendation:** Prefer `PUT /api/courses/:id` with `{ "status": "archived" }` over deletion. Archiving preserves data integrity while removing the course from active views.

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "message": "Course removed"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `404` | `"Course not found"` |

---

## 5. Grades (`/api/grades`)

### 5.1 List Grades

```
GET /api/grades
```

**Purpose:** List grades. Scoped by role: students see only their own; teachers see only grades for courses they teach; admins see all.

**Auth:** Authenticated

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `student` | ObjectId | auto (self) | Forced to `req.user.id` for student role |
| `course` | ObjectId | — | Filter by course |
| `assessmentType` | string | — | `exam`, `quiz`, `assignment`, `project` |
| `term` | string | — | |
| `dateFrom` | date | — | e.g. `2026-01-01` |
| `dateTo` | date | — | e.g. `2026-06-30` |
| `page` | number | 1 | |
| `limit` | number | 20 | |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": "60d1e2f3a4b5c60001000020",
      "student": {
        "id": "60a1b2c3d4e5f60001000001",
        "name": "Aisha Khan",
        "studentId": "STU-2024-0142"
      },
      "course": {
        "id": "60c1d2e3f4a5b60001000010",
        "name": "Data Structures",
        "code": "CS-201"
      },
      "assessmentName": "Midterm Exam",
      "assessmentType": "exam",
      "score": 87,
      "maxScore": 100,
      "weight": 2,
      "percentage": 87,
      "date": "2026-03-15T10:00:00.000Z",
      "recordedBy": {
        "id": "60a1b2c3d4e5f60001000002",
        "name": "Dr. Marcus Rivera"
      },
      "createdAt": "2026-03-15T14:00:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 14, "pages": 1 }
}
```

> `percentage` is a computed field: `Math.round((score / maxScore) * 100)`. It is not stored in the database.

---

### 5.2 Get Grade by ID

```
GET /api/grades/:id
```

**Purpose:** Get a single grade record. Scoped by role.

**Auth:** Authenticated

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60d1e2f3a4b5c60001000020",
    "student": { "id": "...", "name": "Aisha Khan", "studentId": "STU-2024-0142" },
    "course": { "id": "...", "name": "Data Structures", "code": "CS-201" },
    "assessmentName": "Midterm Exam",
    "assessmentType": "exam",
    "score": 87,
    "maxScore": 100,
    "weight": 2,
    "percentage": 87,
    "date": "2026-03-15T10:00:00.000Z",
    "recordedBy": { "id": "...", "name": "Dr. Marcus Rivera" },
    "createdAt": "2026-03-15T14:00:00.000Z",
    "updatedAt": "2026-03-15T14:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `403` | `"You do not have access to this grade"` |
| `404` | `"Grade not found"` |

---

### 5.3 Create Grade

```
POST /api/grades
```

**Purpose:** Teacher (or admin) records a new assessment grade.

**Auth:** Admin, Teacher (scoped: must teach the course)

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `student` | ObjectId | yes | Must be enrolled in the course |
| `course` | ObjectId | yes | Teacher must teach this course |
| `assessmentName` | string | yes | e.g. "Final Exam" |
| `assessmentType` | string | yes | `exam`, `quiz`, `assignment`, `project` |
| `score` | number | yes | Must be ≥ 0 and ≤ maxScore |
| `maxScore` | number | yes | Defaults to 100 if omitted |
| `weight` | number | no | Defaults to 1; used in weighted average calculations |
| `date` | date | no | Defaults to current date |

```json
{
  "student": "60a1b2c3d4e5f60001000001",
  "course": "60c1d2e3f4a5b60001000010",
  "assessmentName": "Final Exam",
  "assessmentType": "exam",
  "score": 92,
  "maxScore": 100,
  "weight": 3,
  "date": "2026-06-10T09:00:00.000Z"
}
```

**Success Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": "60d1e2f3a4b5c60001000025",
    "student": "60a1b2c3d4e5f60001000001",
    "course": "60c1d2e3f4a5b60001000010",
    "assessmentName": "Final Exam",
    "assessmentType": "exam",
    "score": 92,
    "maxScore": 100,
    "weight": 3,
    "percentage": 92,
    "date": "2026-06-10T09:00:00.000Z",
    "recordedBy": "60a1b2c3d4e5f60001000002",
    "createdAt": "2026-06-10T14:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Score must be between 0 and maxScore"` |
| `400` | `"Student is not enrolled in this course"` |
| `403` | `"You do not teach this course"` |
| `404` | `"Student not found"` |
| `404` | `"Course not found"` |

---

### 5.4 Bulk Create Grades

```
POST /api/grades/bulk
```

**Purpose:** Teacher records grades for multiple students in a single request (e.g. after grading an exam for the whole class). The course and assessment metadata is shared across all entries.

**Auth:** Admin, Teacher (scoped: must teach the course)

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `course` | ObjectId | yes | Shared across all entries |
| `assessmentName` | string | yes | Shared across all entries |
| `assessmentType` | string | yes | Shared across all entries |
| `maxScore` | number | yes | Shared across all entries |
| `weight` | number | no | Shared, defaults to 1 |
| `date` | date | no | Shared, defaults to current date |
| `grades` | array | yes | Array of `{ student, score }` objects |

```json
{
  "course": "60c1d2e3f4a5b60001000010",
  "assessmentName": "Final Exam",
  "assessmentType": "exam",
  "maxScore": 100,
  "weight": 3,
  "date": "2026-06-10T09:00:00.000Z",
  "grades": [
    { "student": "60a1b2c3d4e5f60001000001", "score": 92 },
    { "student": "60a1b2c3d4e5f60001000004", "score": 78 },
    { "student": "60a1b2c3d4e5f60001000005", "score": 85 }
  ]
}
```

**Success Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "created": 3,
    "failed": 0,
    "grades": [
      { "id": "...", "student": "...", "score": 92 },
      { "id": "...", "student": "...", "score": 78 },
      { "id": "...", "student": "...", "score": 85 }
    ]
  }
}
```

> Errors for individual students (e.g. not enrolled) are collected and returned in a `failed` array, with partial success for the rest.

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"No valid grades to create"` (all entries failed validation) |
| `400` | `"Validation failed"` + errors array per entry |
| `403` | `"You do not teach this course"` |

---

### 5.5 Update Grade

```
PUT /api/grades/:id
```

**Purpose:** Teacher updates an existing grade (score, maxScore, assessmentName, etc.). Admin can update any grade.

**Auth:** Admin, Teacher (scoped: must teach the course the grade belongs to)

**Request Body** (all fields optional — send only what changed):

```json
{
  "score": 95
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60d1e2f3a4b5c60001000020",
    "assessmentName": "Midterm Exam",
    "score": 95,
    "maxScore": 100,
    "percentage": 95,
    "updatedAt": "2026-06-12T10:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Score must be between 0 and maxScore"` |
| `403` | `"You do not teach the course this grade belongs to"` |
| `404` | `"Grade not found"` |

---

### 5.6 Delete Grade

```
DELETE /api/grades/:id
```

**Purpose:** Admin deletes a grade record. Teachers cannot delete grades (only update them).

**Auth:** Admin

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "message": "Grade removed"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `403` | `"Only admins can delete grades"` |
| `404` | `"Grade not found"` |

---

## 6. Attendance (`/api/attendance`)

### 6.1 List Attendance

```
GET /api/attendance
```

**Purpose:** List attendance records. Scoped by role: students see their own; teachers see records for courses they teach; admins see all.

**Auth:** Authenticated

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `student` | ObjectId | auto (self) | Forced to `req.user.id` for student role |
| `course` | ObjectId | — | |
| `date` | date | — | Exact date |
| `dateFrom` | date | — | |
| `dateTo` | date | — | |
| `status` | string | — | `present`, `absent`, `late`, `excused` |
| `page` | number | 1 | |
| `limit` | number | 20 | |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": [
    {
      "id": "60e1f2a3b4c5d60001000030",
      "student": {
        "id": "60a1b2c3d4e5f60001000001",
        "name": "Aisha Khan",
        "studentId": "STU-2024-0142"
      },
      "course": {
        "id": "60c1d2e3f4a5b60001000010",
        "name": "Data Structures",
        "code": "CS-201"
      },
      "date": "2026-02-05T00:00:00.000Z",
      "status": "present",
      "markedBy": {
        "id": "60a1b2c3d4e5f60001000002",
        "name": "Dr. Marcus Rivera"
      },
      "createdAt": "2026-02-05T10:05:00.000Z"
    }
  ],
  "meta": { "page": 1, "limit": 20, "total": 86, "pages": 5 }
}
```

---

### 6.2 Create Attendance Record

```
POST /api/attendance
```

**Purpose:** Teacher marks a single student's attendance for a course session.

**Auth:** Admin, Teacher (scoped: must teach the course)

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `student` | ObjectId | yes | Must be enrolled in the course |
| `course` | ObjectId | yes | Teacher must teach this course |
| `date` | date | yes | Day of the session |
| `status` | string | yes | `present`, `absent`, `late`, `excused` |

```json
{
  "student": "60a1b2c3d4e5f60001000001",
  "course": "60c1d2e3f4a5b60001000010",
  "date": "2026-02-05T00:00:00.000Z",
  "status": "present"
}
```

**Success Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "id": "60e1f2a3b4c5d60001000030",
    "student": "60a1b2c3d4e5f60001000001",
    "course": "60c1d2e3f4a5b60001000010",
    "date": "2026-02-05T00:00:00.000Z",
    "status": "present",
    "markedBy": "60a1b2c3d4e5f60001000002",
    "createdAt": "2026-02-05T10:05:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Attendance for this student, course, and date already exists"` |
| `400` | `"Invalid status value"` |
| `400` | `"Student is not enrolled in this course"` |
| `403` | `"You do not teach this course"` |

---

### 6.3 Bulk Mark Attendance

```
POST /api/attendance/bulk
```

**Purpose:** Teacher marks attendance for an entire course session at once.

**Auth:** Admin, Teacher (scoped: must teach the course)

**Request Body:**

| Field | Type | Required | Notes |
|---|---|---|---|
| `course` | ObjectId | yes | |
| `date` | date | yes | |
| `records` | array | yes | Array of `{ student, status }` objects |

```json
{
  "course": "60c1d2e3f4a5b60001000010",
  "date": "2026-06-15T00:00:00.000Z",
  "records": [
    { "student": "60a1b2c3d4e5f60001000001", "status": "present" },
    { "student": "60a1b2c3d4e5f60001000004", "status": "absent" },
    { "student": "60a1b2c3d4e5f60001000005", "status": "late" }
  ]
}
```

**Success Response** `201 Created`:

```json
{
  "success": true,
  "data": {
    "created": 3,
    "failed": 0,
    "records": [
      { "student": "...", "status": "present" },
      { "student": "...", "status": "absent" },
      { "student": "...", "status": "late" }
    ]
  }
}
```

---

### 6.4 Update Attendance Record

```
PUT /api/attendance/:id
```

**Purpose:** Teacher updates a student's attendance status for a previously recorded session.

**Auth:** Admin, Teacher (scoped: must teach the course the record belongs to)

**Request Body:**

```json
{
  "status": "excused"
}
```

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "id": "60e1f2a3b4c5d60001000030",
    "status": "excused",
    "updatedAt": "2026-06-16T09:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `400` | `"Invalid status value"` |
| `403` | `"You do not teach this course"` |
| `404` | `"Attendance record not found"` |

---

## 7. Analytics (`/api/analytics`)

All analytics endpoints return **precomputed data** from the `analyticsReports` collection (not live aggregations). Reports are recalculated automatically when grades or attendance are created/updated, and via a nightly cron job to catch any stragglers.

### 7.1 Student Performance Summary

```
GET /api/analytics/student/:studentId
```

**Purpose:** Return the performance summary for a specific student for the given semester/term. Students can only query their own ID; teachers can query students in their courses; admins can query anyone.

**Auth:** Authenticated, scoped

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `period` | string | current term | e.g. `"Spring-2026"` — if empty, defaults to the current academic period |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "student": {
      "id": "60a1b2c3d4e5f60001000001",
      "name": "Aisha Khan",
      "studentId": "STU-2024-0142",
      "programme": "Computer Science"
    },
    "period": "Spring-2026",
    "overallAverage": 85.67,
    "totalAssessments": 12,
    "attendanceRate": 88.5,
    "gradeDistribution": { "A": 5, "B": 4, "C": 2, "D": 1, "F": 0 },
    "courseAverages": [
      { "courseId": "...", "courseName": "Data Structures", "code": "CS-201", "average": 89.5, "assessmentCount": 8 },
      { "courseId": "...", "courseName": "Linear Algebra", "code": "MTH-102", "average": 78.0, "assessmentCount": 4 }
    ],
    "lastCalculated": "2026-06-30T02:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `403` | `"You do not have access to this student's analytics"` |
| `404` | `"Student not found"` |

---

### 7.2 Course Performance Summary

```
GET /api/analytics/course/:courseId
```

**Purpose:** Return performance metrics for a course. Students see only if enrolled; teachers see only courses they teach; admins see all.

**Auth:** Authenticated, scoped

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `period` | string | current term | |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "course": {
      "id": "60c1d2e3f4a5b60001000010",
      "name": "Data Structures and Algorithms",
      "code": "CS-201",
      "teacher": { "id": "...", "name": "Dr. Marcus Rivera" }
    },
    "period": "Spring-2026",
    "enrolledCount": 32,
    "classAverage": 81.4,
    "attendanceRate": 85.2,
    "gradeDistribution": { "A": 8, "B": 10, "C": 9, "D": 3, "F": 2 },
    "assessmentAverages": [
      { "assessmentName": "Midterm Exam", "classAverage": 78.5, "highScore": 98, "lowScore": 42 },
      { "assessmentName": "Final Project", "classAverage": 86.2, "highScore": 100, "lowScore": 65 }
    ],
    "topPerformers": [
      { "studentId": "...", "name": "Sakura Tanaka", "average": 96.3 }
    ],
    "lastCalculated": "2026-06-30T02:30:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `403` | `"You are not enrolled in this course"` |
| `404` | `"Course not found"` |

---

### 7.3 System-Wide Summary

```
GET /api/analytics/system
```

**Purpose:** Admin-only endpoint returning cross-course, cross-programme aggregate statistics for the entire institution.

**Auth:** Admin

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `period` | string | current term | |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": {
    "period": "Spring-2026",
    "totalStudents": 1187,
    "totalTeachers": 34,
    "totalCourses": 48,
    "overallAverage": 76.8,
    "overallAttendanceRate": 84.2,
    "gradeDistribution": { "A": 312, "B": 405, "C": 278, "D": 121, "F": 71 },
    "programmeAverages": [
      { "programme": "Computer Science", "studentCount": 210, "average": 79.4 },
      { "programme": "Mathematics", "studentCount": 145, "average": 74.8 },
      { "programme": "Physics", "studentCount": 98, "average": 76.1 }
    ],
    "attendanceByProgramme": [
      { "programme": "Computer Science", "rate": 86.3 },
      { "programme": "Mathematics", "rate": 81.7 },
      { "programme": "Physics", "rate": 84.9 }
    ],
    "lastCalculated": "2026-06-30T03:00:00.000Z"
  }
}
```

**Error Responses:**

| Code | Example Message |
|---|---|
| `403` | `"Only admins can view system-wide analytics"` |

---

### 7.4 Export Report

```
GET /api/analytics/export
```

**Purpose:** Export analytics data as a downloadable file. Scoped by role.

**Auth:** Authenticated, scoped (student = own data; teacher = own courses; admin = all)

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `format` | string | `csv` | `csv` or `pdf` |
| `type` | string | — | `student`, `course`, or `system` |
| `targetId` | ObjectId | — | Required if type=`student` or `course` |
| `period` | string | current term | |

**Success Response** `200 OK`:

- `format=csv`: Returns `Content-Type: text/csv` with `Content-Disposition: attachment`
- `format=pdf`: Returns `Content-Type: application/pdf` with `Content-Disposition: attachment`

---

## 8. Error Reference

All endpoints return errors in the standard envelope. Below is a consolidated reference of HTTP status codes used across the API.

| Code | Label | When |
|---|---|---|
| `200` | OK | Successful GET, PUT, DELETE |
| `201` | Created | Successful POST |
| `400` | Bad Request | Validation failure, duplicate record, business rule violation |
| `401` | Unauthorized | Missing, expired, or invalid JWT |
| `403` | Forbidden | Valid JWT but insufficient role/permission for the resource |
| `404` | Not Found | Resource (user, course, grade, attendance) does not exist |
| `409` | Conflict | Duplicate unique field (email, course code, student ID) |
| `429` | Too Many Requests | Rate limit exceeded (when implemented) |
| `500` | Internal Server Error | Unexpected server failure |

---

## 9. Search API (`/api/search`)

### 9.1 Unified Search

```
GET /api/search
```

**Purpose:** Search across one or more collections with a single query.

**Auth:** Authenticated

**Query Parameters:**

| Param | Type | Default | Notes |
|---|---|---|---|
| `q` | string | **required** | Min 2 characters, regex escaped |
| `type` | string | all | Comma-separated: `students`, `users`, `grades`, `attendance` |
| `page` | number | 1 | |
| `limit` | number | 20 | Max 50 |

**Success Response** `200 OK`:

```json
{
  "success": true,
  "query": "data",
  "typesSearched": ["grades"],
  "totalHits": 14,
  "results": {
    "grades": {
      "data": [ ... ],
      "total": 14,
      "page": 1,
      "limit": 20
    }
  }
}
```

**Search fields per collection:**

| Collection | Fields searched |
|---|---|
| `users` | `name`, `email` |
| `students` | `studentId`, `programme` |
| `grades` | `subject`, `assessmentName`, `term` |
| `attendance` | `subject` |

---

## 10. Export API (`/api/export`)

### 10.1 Export CSV

```
GET /api/export/:resource/csv
```

**Purpose:** Download filtered data as a CSV file.

**Auth:** Authenticated

**Supported resources:** `grades`, `attendance`, `students`, `users`

**Accepts the same query filters as the corresponding list endpoint** (e.g. `?subject=X&dateFrom=Y` for grades).

**Success Response** `200 OK`:

- `Content-Type: text/csv`
- `Content-Disposition: attachment; filename="grades-export-2026-07-19.csv"`
- Body: CSV text with header row

### 10.2 Export JSON

```
GET /api/export/:resource/json
```

**Purpose:** Download filtered data as JSON.

**Auth:** Authenticated

**Success Response** `200 OK`:

```json
{
  "success": true,
  "data": [ ... ],
  "meta": { "total": 15 }
}
```

---

## 11. Enhanced Filtering

All list endpoints (`/api/grades`, `/api/attendance`, `/api/users`, `/api/students`) support the following enhanced query parameters:

| Feature | Example | Description |
|---|---|---|
| **Multi-value** | `?assessmentType=exam,quiz` | Filter by multiple comma-separated values |
| **Date range** | `?dateFrom=2026-01-01&dateTo=2026-06-30` | Inclusive date range |
| **Text search** | `?search=algebra` | Regex search within name/email/subject |
| **Pagination** | `?page=1&limit=20&sort=-createdAt` | Page, limit, sort field |
| **Role filter** | `?role=student` | Filter users by role |

Standard response for all list endpoints:

```json
{
  "success": true,
  "data": [ ... ],
  "meta": { "page": 1, "limit": 20, "total": 142, "pages": 8 }
}
```

---

## 12. Logging

Winston logger configured with:
- `logs/combined.log` — all requests with timestamps, methods, URLs, status codes, response times
- `logs/error.log` — errors only with full stack traces
- File rotation: 5MB max, 5 files retained
- Console output in development mode
- Unhandled promise rejection and uncaught exception capture

---

## 13. Quick Reference — Complete Endpoint List

| Method | Route | Auth | Roles |
|---|---|---|---|
| POST | `/api/auth/register` | Public | — |
| POST | `/api/auth/login` | Public | — |
| POST | `/api/auth/refresh` | Bearer | All |
| GET | `/api/auth/me` | Bearer | All |
| POST | `/api/auth/logout` | Bearer | All |
| GET | `/api/users` | Bearer | Admin |
| GET | `/api/users/:id` | Bearer | Admin |
| POST | `/api/users` | Bearer | Admin |
| PUT | `/api/users/:id` | Bearer | Admin |
| DELETE | `/api/users/:id` | Bearer | Admin |
| PUT | `/api/users/profile` | Bearer | All |
| PUT | `/api/users/password` | Bearer | All |
| GET | `/api/courses` | Bearer | All (scoped) |
| GET | `/api/courses/:id` | Bearer | All (scoped) |
| POST | `/api/courses` | Bearer | Admin |
| PUT | `/api/courses/:id` | Bearer | Admin |
| DELETE | `/api/courses/:id` | Bearer | Admin |
| POST | `/api/courses/:id/enroll` | Bearer | Admin |
| DELETE | `/api/courses/:id/enroll/:studentId` | Bearer | Admin |
| GET | `/api/grades` | Bearer | All (scoped) |
| GET | `/api/grades/:id` | Bearer | All (scoped) |
| POST | `/api/grades` | Bearer | Admin, Teacher |
| POST | `/api/grades/bulk` | Bearer | Admin, Teacher |
| PUT | `/api/grades/:id` | Bearer | Admin, Teacher |
| DELETE | `/api/grades/:id` | Bearer | Admin |
| GET | `/api/attendance` | Bearer | All (scoped) |
| POST | `/api/attendance` | Bearer | Admin, Teacher |
| POST | `/api/attendance/bulk` | Bearer | Admin, Teacher |
| PUT | `/api/attendance/:id` | Bearer | Admin, Teacher |
| GET | `/api/analytics/student/:studentId` | Bearer | All (scoped) |
| GET | `/api/analytics/course/:courseId` | Bearer | All (scoped) |
| GET | `/api/analytics/system` | Bearer | Admin |
| GET | `/api/analytics/export` | Bearer | All (scoped) |
| **GET** | **`/api/search?q=&type=`** | **Bearer** | **All** |
| **GET** | **`/api/export/:resource/csv`** | **Bearer** | **All** |
| **GET** | **`/api/export/:resource/json`** | **Bearer** | **All** |
