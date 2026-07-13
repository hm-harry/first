# subagent-driven-development

| name | subagent-driven-development |
|------|------|
| description | Activates with plan - dispatches fresh subagent per task with two-stage review (spec compliance, then code quality) |

## When to Use

- When tasks.md has been approved and implementation begins
- When tasks are independent enough for parallel execution
- For large features with many distinct components

## Process

### 1. Task Analysis

Review tasks.md and identify:
- Independent tasks that can run in parallel
- Dependent tasks that must be sequential
- Tasks that need the same files (potential conflicts)

### 2. Subagent Dispatch

For each task:

1. **Prepare context**: Provide the subagent with:
   - The specific task from tasks.md
   - Relevant design decisions from design.md
   - Applicable rules from `rules/`
   - Related existing code

2. **Dispatch**: Send the subagent to execute the task

3. **Two-Stage Review**:
   - **Stage 1 - Spec Compliance**: Does the output match the task requirements?
   - **Stage 2 - Code Quality**: Does it follow `rules/code-style.md` and `rules/testing.md`?

### 3. Integration

After subagents complete:
1. Merge all outputs
2. Resolve any conflicts
3. Run the full test suite
4. Verify the integrated result

## Review Criteria

### Stage 1: Spec Compliance

- [ ] All requirements from the task are implemented
- [ ] File paths match the task specification
- [ ] Verification criteria are met

### Stage 2: Code Quality

- [ ] Follows `rules/code-style.md`
- [ ] Follows `rules/testing.md`
- [ ] No unnecessary complexity
- [ ] Tests are meaningful (not just coverage padding)

## Anti-Patterns

- Dispatching without clear task boundaries
- Skipping the review stages
- Not checking for conflicts between subagent outputs
- Dispatching too many tasks simultaneously without conflict analysis
