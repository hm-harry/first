# dispatching-parallel-agents

| name | dispatching-parallel-agents |
|------|------|
| description | Activates when multiple independent tasks can be executed concurrently by subagents |

## When to Use

- When tasks.md has multiple independent task groups
- When backend and frontend work can proceed simultaneously
- When multiple test suites need to be written

## Prerequisites

Before dispatching parallel agents:

1. **Conflict Analysis**: Ensure tasks don't modify the same files
2. **Dependency Check**: Ensure no task depends on another's output
3. **Context Preparation**: Each agent needs self-contained context

## Dispatch Strategy

### Safe Parallel Groups

| Group A | Group B | Group C |
|---------|---------|---------|
| Backend Service | Frontend Components | Database Migrations |
| Backend Tests | Frontend Tests | Integration Config |

### Unsafe Parallel Groups (MUST be sequential)

- Two tasks modifying the same Java class
- Two tasks modifying the same TypeScript module
- Database migration + code that depends on new schema

## Process

1. **Identify parallelizable task groups** from tasks.md
2. **Verify no file conflicts** between groups
3. **Prepare isolated context** for each agent
4. **Dispatch all agents** simultaneously
5. **Collect results** and verify integration
6. **Run full test suite** to catch integration issues

## Checklist

- [ ] Identified independent task groups
- [ ] Verified no file conflicts
- [ ] Prepared self-contained context per agent
- [ ] Dispatched agents in parallel
- [ ] Collected and merged results
- [ ] Ran full test suite
- [ ] Resolved any integration conflicts
