# writing-skills

| name | writing-skills |
|------|------|
| description | Guide for creating new skills following best practices |

## When to Use

- When creating a new skill for the project
- When modifying an existing skill
- When the team identifies a recurring workflow that should be formalized

## Skill Structure

Each skill is a markdown file at `skills/<skill-name>/SKILL.md` with:

```markdown
# skill-name

| name | skill-name |
|------|------|
| description | One-line description of when to activate this skill |

## When to Use
- Trigger conditions

## Process
- Step-by-step workflow

## Checklist
- [ ] Verification items
```

## Design Principles

### 1. Trigger Clarity

The `description` must be specific enough that the agent knows when to activate:

| Bad | Good |
|-----|------|
| "Use when coding" | "Activates before writing code - refines ideas through questions" |
| "Use for bugs" | "Activates when encountering bugs - 4-phase root cause analysis" |

### 2. Actionable Steps

Every step must be concrete and actionable:

| Bad | Good |
|-----|------|
| "Think about the problem" | "Ask: What are you really trying to accomplish?" |
| "Write tests" | "Write a failing test that describes the desired behavior" |

### 3. Verification Checklist

Every skill must end with a checklist to verify completion.

### 4. Anti-Patterns Section

Include common mistakes and how to avoid them.

## Testing a New Skill

1. Create the skill file
2. Start a new session
3. Trigger the skill's condition
4. Verify the skill activates automatically
5. Follow the skill and check if the output matches expectations

## Project-Specific Skills

When writing skills for this project, consider:
- Spring Boot 3.3 backend conventions
- Node.js 16 frontend patterns
- MySQL 8 database operations
- JUnit 5 and Vitest testing approaches
- OpenSpec workflow integration

## Checklist

- [ ] Skill has clear trigger description
- [ ] Process steps are actionable
- [ ] Checklist is comprehensive
- [ ] Anti-patterns documented
- [ ] Tested in a real session
- [ ] Follows existing skill format
