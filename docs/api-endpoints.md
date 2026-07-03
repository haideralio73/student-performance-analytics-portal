/**
 * docs/api-endpoints.md — API endpoint reference.
 *
 * Documents every REST endpoint, its HTTP method, required
 * authentication/role, request body shape, and response format.
 */

# API Endpoints

Base URL: `http://localhost:5000/api`

## Auth

| Method | Endpoint         | Auth   | Body                              | Description                |
|--------|------------------|--------|-----------------------------------|----------------------------|
| POST   | /auth/register   | —      | name, email, password, role       | Register a new user        |
| POST   | /auth/login      | —      | email, password                   | Login, returns JWT         |
| GET    | /auth/me         | Bearer | —                                 | Get current user profile   |

## Users (Admin)

| Method | Endpoint         | Auth   | Description                       |
|--------|------------------|--------|-----------------------------------|
| GET    | /users           | Admin  | List all users                    |
| GET    | /users/:id       | Admin  | Get user by ID                    |
| PUT    | /users/:id       | Admin  | Update user                       |
| DELETE | /users/:id       | Admin  | Delete user                       |

## Students

| Method | Endpoint         | Auth         | Description                       |
|--------|------------------|--------------|-----------------------------------|
| GET    | /students        | Admin/Teacher| List all students                 |
| POST   | /students        | Admin        | Create student profile            |
| GET    | /students/:id    | Bearer       | Get student by ID                 |
| PUT    | /students/:id    | Admin/Teacher| Update student                    |
| DELETE | /students/:id    | Admin        | Delete student                    |

## Grades

| Method | Endpoint         | Auth         | Description                       |
|--------|------------------|--------------|-----------------------------------|
| GET    | /grades          | Bearer       | List grades (filterable)          |
| POST   | /grades          | Admin/Teacher| Record a new grade                |
| GET    | /grades/:id      | Bearer       | Get grade by ID                   |
| PUT    | /grades/:id      | Admin/Teacher| Update grade                      |
| DELETE | /grades/:id      | Admin        | Delete grade                      |

## Attendance

| Method | Endpoint          | Auth         | Description                      |
|--------|-------------------|--------------|----------------------------------|
| GET    | /attendance       | Bearer       | List attendance (filterable)     |
| POST   | /attendance       | Admin/Teacher| Record attendance                |
| POST   | /attendance/bulk  | Admin/Teacher| Bulk record attendance           |
| PUT    | /attendance/:id   | Admin/Teacher| Update attendance record         |

## Analytics

| Method | Endpoint                  | Auth   | Description                      |
|--------|---------------------------|--------|----------------------------------|
| GET    | /analytics/student/:id    | Bearer | Per-student summary metrics      |
| GET    | /analytics/class-overview | Bearer | Aggregate class statistics       |
