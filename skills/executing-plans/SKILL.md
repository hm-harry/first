# executing-plans

| name | executing-plans |
|------|------|
| description | Activates with plan - executes tasks in batches with human checkpoints between groups |

## When to Use

- When tasks.md is ready and approved
- During the `/opsx:apply` phase
- When implementing a sequence of related tasks

## Process

### 1. Preparation

1. Read `openspec/changes/<name>/tasks.md`
2. Read `openspec/changes/<name>/design.md` for context
3. Check `rules/code-style.md` and `rules/testing.md`
4. Set up tracking (todo list for task progress)

### 2. Batch Execution

Execute tasks in logical batches:

| Batch | Contents | Checkpoint |
|-------|----------|------------|
| 1 | Infrastructure & setup tasks | Confirm setup works |
| 2 | Backend core implementation | Run `mvn test` |
| 3 | Frontend implementation | Run `pnpm test` |
| 4 | Integration & polish | Full test suite |

### 3. Per-Task Workflow

For each task in the batch:

1. **Announce**: "Working on task [number]: [title]"
2. **Implement**: Write the code per task spec
3. **Test**: Run the verification step
4. **Commit**: If tests pass, check off the task
5. **Continue**: Move to next task

### 4. Human Checkpoints

After each batch:
- Summarize what was completed
- Show any issues encountered
- Ask for approval before next batch

## Checklist

- [ ] Read tasks.md and design.md
- [ ] Created tracking todo list
- [ ] Executed tasks in batches
- [ ] Ran tests after each batch
- [ ] Got human approval at checkpoints
- [ ] All tasks checked off

## Error Handling

- If a test fails: STOP, fix the issue, re-run test
- If design needs adjustment: Update the artifact, note the change
- If task is unclear: Refer back to design.md for context
