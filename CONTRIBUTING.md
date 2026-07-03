# Contributing to SPAP

Thank you for your interest in contributing to the Student Performance Analytics Portal. This document outlines the conventions and process for contributing — whether you're a solo developer keeping yourself accountable or part of a team.

---

## Branch Naming

Create branches from `main` using one of the following prefixes:

| Prefix | Example | Use for |
|---|---|---|
| `feature/` | `feature/grade-bulk-upload` | New functionality, new endpoints, new UI components |
| `fix/` | `fix/attendance-duplicate-check` | Bug fixes |
| `docs/` | `docs/api-endpoints-update` | Documentation changes in `docs/` or `README.md` |
| `refactor/` | `refactor/analytics-service` | Code restructuring without changing behavior |
| `chore/` | `chore/update-dependencies` | Dependency updates, CI changes, tooling |
| `test/` | `test/grade-controller-unit` | Adding or updating tests |

Branch names are lowercase, hyphen-separated, and reference the GitHub issue number if one exists:

```
feature/42-grade-bulk-upload
fix/attendance-duplicate-check
```

---

## Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>(<scope>): <short description>

[optional body — what and why, not how]

[optional footer — closes #issue, BREAKING CHANGE]
```

**Types:** `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `style`, `perf`

**Scopes:** `client`, `server`, `docs`, `auth`, `grades`, `attendance`, `analytics`, `courses`, `users`

**Examples:**

```
feat(server): add bulk grade creation endpoint
fix(client): prevent duplicate attendance submission
docs(api): document analytics export endpoint
refactor(server): extract grade calculation to service layer
chore(deps): bump mongoose to 8.7.0
```

Rules:
- Use imperative mood: "add" not "added" or "adds"
- First line ≤ 72 characters
- Reference issues in the footer: `Closes #42`

---

## Pull Request Process

1. **Create a branch** from `main` following the naming convention above.
2. **Make your changes** in focused, well-scoped commits.
3. **Keep PRs small** — aim for under 400 lines changed. Large PRs are harder to review and more likely to introduce bugs.
4. **Write a clear PR description**:
   - What does this change do?
   - Which issue does it fix or feature does it implement?
   - How was it tested? (manual, automated, or both)
   - Screenshots or screen recordings for UI changes.
5. **Self-review** your diff before requesting review. Check for:
   - Leftover `console.log` or commented-out code
   - Secrets or keys accidentally committed
   - Unused imports or variables
   - Matching code style with the rest of the project
6. **Request review** — even on a solo project, let the PR sit for a few hours and come back with fresh eyes before merging.
7. **Squash and merge** into `main` with a clean commit message summarizing the change.

---

## Code Style

- **Server:** ES modules (`import`/`export`). Use existing patterns from `controllers/`, `services/`, and `middleware/` as templates.
- **Client:** JSX with functional components. Use Tailwind utility classes. Follow the component organization in `components/feature/`.
- **Naming:** `camelCase` for variables and functions, `PascalCase` for React components and Mongoose models.
- **No dead code:** Delete it, don't comment it out. Git history preserves it if needed.
- **Error handling:** All async route handlers must use `try/catch` with `next(error)` — never let a promise rejection go unhandled.

---

## Project Status

This project is currently in **planning phase**. The `docs/` directory contains the full system design. Implementation begins after design approval. If you're reviewing this during the planning phase, feedback on the docs (architecture, schema, API, roles) is welcome via GitHub Discussions or Issues.
