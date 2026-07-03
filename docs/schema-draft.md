/**
 * docs/schema-draft.md — MongoDB schema reference.
 *
 * Documents each Mongoose model, its fields, types,
 * validation rules, and relationships.
 */

# Schema Draft

## User

| Field      | Type   | Required | Notes                           |
|------------|--------|----------|---------------------------------|
| name       | String | Yes      | Trimmed                         |
| email      | String | Yes      | Unique, lowercase               |
| password   | String | Yes      | Min 6 chars, hashed, select: false |
| role       | String | Yes      | student / teacher / admin       |
| createdAt  | Date   | Auto     |                                 |
| updatedAt  | Date   | Auto     |                                 |

## Student

| Field          | Type     | Required | Notes                         |
|----------------|----------|----------|-------------------------------|
| user           | ObjectId | Yes      | Ref → User                    |
| studentId      | String   | Yes      | Unique identifier             |
| programme      | String   | Yes      | e.g. "Computer Science"       |
| enrollmentYear | Number   | Yes      | e.g. 2024                     |
| guardian       | Object   | No       | name, phone, email            |

## Grade

| Field          | Type     | Required | Notes                         |
|----------------|----------|----------|-------------------------------|
| student        | ObjectId | Yes      | Ref → Student                 |
| subject        | String   | Yes      |                               |
| score          | Number   | Yes      | Min 0                         |
| maxScore       | Number   | Yes      | Default 100                   |
| term           | String   | Yes      | e.g. "Fall 2025"              |
| assessmentType | String   | Yes      | exam / quiz / assignment / project |
| recordedBy     | ObjectId | No       | Ref → User                    |

## Attendance

| Field     | Type     | Required | Notes                            |
|-----------|----------|----------|----------------------------------|
| student   | ObjectId | Yes      | Ref → Student                    |
| date      | Date     | Yes      |                                  |
| subject   | String   | Yes      |                                  |
| status    | String   | Yes      | present / absent / late / excused |
| markedBy  | ObjectId | No       | Ref → User                       |

Compound unique index on (student, date, subject).
