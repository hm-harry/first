# requesting-code-review

| name | requesting-code-review |
|------|------|
| description | Activates between tasks - reviews implementation against plan and code quality standards |

## When to Use

- After completing a batch of implementation tasks
- Before moving to the next task group
- When you want a quality check on recent changes

## Pre-Review Checklist

Before requesting review, verify:

- [ ] All tasks in the batch are complete
- [ ] All tests pass (`mvn test` for backend, `pnpm test` for frontend)
- [ ] Code follows `rules/code-style.md`
- [ ] No TODO/FIXME comments without associated issue tracking
- [ ] No hardcoded values that should be configurable

## Review Request Format

```markdown
## Review Request

### Tasks Completed
- [x] Task 1: [description]
- [x] Task 2: [description]

### Files Changed
- `backend/src/main/java/com/firstmain/...`
- `frontend/src/...`

### Test Results
- Backend: X passed, Y failed
- Frontend: X passed, Y failed

### Notes
[Any concerns or areas needing special attention]
```

## Review Categories

| Category | What to Check |
|----------|--------------|
| Correctness | Does it do what the spec says? |
| Completeness | Are all requirements addressed? |
| Style | Does it follow code-style.md? |
| Testing | Are tests meaningful and comprehensive? |
| Security | Any obvious vulnerabilities? |
| Performance | Any N+1 queries, unnecessary allocations? |

## Severity Levels

| Level | Action |
|-------|--------|
| Critical | Block progress, must fix immediately |
| Warning | Should fix before merge |
| Info | Nice to have, consider for future |
