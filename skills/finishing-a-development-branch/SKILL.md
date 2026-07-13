# finishing-a-development-branch

| name | finishing-a-development-branch |
|------|------|
| description | Activates when all tasks are complete - verifies tests, presents options, cleans up |

## When to Use

- When all tasks in tasks.md are checked off
- After the final verification passes
- When ready to wrap up a change

## Process

### 1. Final Verification

Run the complete verification suite:

```bash
# Backend: full build + tests
cd backend && mvn clean verify

# Frontend: full build + tests
cd frontend && pnpm build && pnpm test
```

- [ ] All backend tests pass
- [ ] All frontend tests pass
- [ ] Build succeeds without warnings
- [ ] No uncommitted changes

### 2. Spec Compliance Check

Compare implementation against:
- [ ] `openspec/changes/<name>/proposal.md` - all intents addressed
- [ ] `openspec/changes/<name>/specs/` - all delta specs implemented
- [ ] `openspec/changes/<name>/design.md` - design decisions followed
- [ ] `openspec/changes/<name>/tasks.md` - all tasks complete

### 3. Present Options

Ask the human partner what to do next:

| Option | Description |
|--------|-------------|
| Archive | Run `/opsx:archive` to merge delta specs and archive the change |
| PR | Create a pull request for review |
| Keep | Keep the branch for further work |
| Discard | Discard the changes |

### 4. Archive (if chosen)

```
/opsx:archive
```

This will:
1. Merge ADDED specs into `openspec/specs/`
2. Apply MODIFIED specs to existing specs
3. Remove REMOVED specs from main specs
4. Move the change folder to `openspec/changes/archive/<date>-<name>/`

### 5. Cleanup

- Remove any temporary files
- Update documentation if needed
- Ensure the workspace is clean

## Checklist

- [ ] Full test suite passes
- [ ] Build succeeds
- [ ] All tasks in tasks.md checked off
- [ ] Spec compliance verified
- [ ] Options presented to human partner
- [ ] Archive or PR completed
- [ ] Workspace cleaned up
