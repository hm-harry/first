# verification-before-completion

| name | verification-before-completion |
|------|------|
| description | Activates before declaring a task complete - ensures the fix actually works |

## When to Use

- Before marking any task as complete
- After fixing a bug
- After implementing a feature
- Before requesting code review

## The Verification Process

### 1. Automated Verification

Run all relevant test suites:

```bash
# Backend tests
cd backend && mvn test

# Frontend tests
cd frontend && pnpm test

# Full build
cd backend && mvn clean package
cd frontend && pnpm build
```

### 2. Manual Verification

- [ ] Feature works as described in the spec
- [ ] Edge cases are handled
- [ ] Error messages are helpful
- [ ] No console errors or warnings (frontend)
- [ ] No unhandled exceptions in logs (backend)

### 3. Integration Verification

- [ ] Backend API responds correctly
- [ ] Frontend can communicate with backend
- [ ] Database operations work as expected
- [ ] No breaking changes to existing features

## Evidence Collection

For each verification, collect evidence:

| Type | Evidence |
|------|----------|
| Test pass | Test output showing all green |
| Feature works | Description of manual verification |
| No regressions | Full test suite results |

## Red Flags (Not Actually Fixed)

These signs mean you're not done:

- Tests pass but only because they don't cover the bug
- "It works on my machine" without checking edge cases
- Fix introduces new warnings or errors
- Fix requires disabling other tests
- Behavior is correct only for the happy path

## Checklist

- [ ] All automated tests pass
- [ ] Feature manually verified
- [ ] No regressions in existing features
- [ ] Evidence collected for each check
- [ ] Edge cases tested
- [ ] Error handling verified
