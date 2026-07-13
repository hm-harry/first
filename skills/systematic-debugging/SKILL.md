# systematic-debugging

| name | systematic-debugging |
|------|------|
| description | Activates when encountering bugs - 4-phase root cause analysis process |

## When to Use

- When a test fails unexpectedly
- When a feature doesn't work as expected
- When encountering runtime errors
- Before making any "fix" — understand the root cause first

## The 4-Phase Process

### Phase 1: Observe

1. **Reproduce**: Get exact steps to reproduce the issue
2. **Collect evidence**:
   - Error messages and stack traces
   - Log output (check Spring Boot logs, frontend console)
   - Expected vs actual behavior
3. **Don't guess** — only state what you can observe

### Phase 2: Hypothesize

1. Based on evidence, form 1-3 hypotheses
2. For each hypothesis, predict what you'd see if it were true
3. Rank by likelihood

Common areas to check:
- **Backend**: Spring Bean injection, JPA mapping, transaction boundaries
- **Frontend**: Async state management, TypeScript type mismatches
- **Database**: Connection pool, query performance, schema mismatches

### Phase 3: Test Hypotheses

1. Test the most likely hypothesis first
2. Use targeted logging/debugging, not random changes
3. Change ONE thing at a time
4. If hypothesis is wrong, move to the next

### Phase 4: Fix

1. **Write a regression test** that fails with the bug present
2. Implement the fix
3. Verify the regression test passes
4. Verify all existing tests still pass
5. Document the root cause

## Root Cause Tracing

Ask "Why?" 5 times:
```
Bug: User can't login
Why? → 401 error returned
Why? → Token validation fails
Why? → Token expired prematurely
Why? → TTL config set to seconds instead of minutes
Why? → Copy-paste error in config (ROOT CAUSE)
```

## Defense in Depth

After fixing, consider:
- Can this class of bug happen elsewhere?
- Should we add validation to prevent it?
- Should we add a test to catch it?

## Checklist

- [ ] Reproduced the issue
- [ ] Collected evidence (logs, errors, behavior)
- [ ] Formed hypotheses based on evidence
- [ ] Tested hypotheses systematically
- [ ] Wrote regression test BEFORE fix
- [ ] Implemented fix
- [ ] Verified all tests pass
- [ ] Considered defense-in-depth
