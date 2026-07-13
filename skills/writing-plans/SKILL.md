# writing-plans

| name | writing-plans |
|------|------|
| description | Activates with approved design - breaks work into bite-sized tasks with exact file paths, complete code, verification steps |

## When to Use

- After a design/proposal has been approved via brainstorming
- When you need a clear implementation roadmap
- Before starting any multi-file change

## Process

### 1. Read Context

- Read the approved proposal from `openspec/changes/<name>/proposal.md`
- Read the design from `openspec/changes/<name>/design.md`
- Check `openspec/specs/` for existing system behavior
- Review `rules/code-style.md` and `rules/testing.md`

### 2. Break Down Tasks

Each task should be:
- **Small**: Completable in 2-5 minutes
- **Specific**: Exact file paths and function names
- **Testable**: Clear verification criteria
- **Ordered**: Dependencies respected

### 3. Task Format

```markdown
## [Group Name]

- [ ] [number]. [Task title]
  - File: `path/to/file`
  - Action: [Create/Modify/Delete]
  - Description: What to do
  - Verify: How to confirm it works
```

### 4. Include Test Tasks

Every implementation task must have a corresponding test task:
- Backend: JUnit 5 test in `src/test/java/com/firstmain/`
- Frontend: Vitest test in `src/__tests__/`

### 5. Output

Save as `openspec/changes/<change-name>/tasks.md`

## Checklist

- [ ] Read proposal and design documents
- [ ] Checked existing specs
- [ ] Tasks are small (2-5 min each)
- [ ] Each task has exact file paths
- [ ] Each task has verification steps
- [ ] Test tasks included for every feature
- [ ] Tasks are properly ordered
- [ ] Saved to tasks.md

## Principles

- **YAGNI**: Only include tasks from the approved design
- **DRY**: Identify shared components that can be reused
- **TDD**: Test tasks come before or alongside implementation tasks
