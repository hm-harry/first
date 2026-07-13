# using-superpowers

| name | using-superpowers |
|------|------|
| description | Use when starting any conversation - establishes how to find and use skills, requiring skill invocation before ANY response |

If you were dispatched as a subagent to execute a specific task, ignore this skill.

**IF you think there is even a 1% chance a skill might apply to what you are doing, you ABSOLUTELY MUST invoke the skill.**

## The Rule

Invoke relevant or requested skills BEFORE any response or action — including clarifying questions, exploring the codebase, or checking files.

Before entering plan mode: if you haven't already brainstormed, invoke the brainstorming skill first.

Then announce "Using [skill] to [purpose]" and follow the skill exactly. If it has a checklist, create a todo per item.

## Skill Priority

When multiple skills apply, process skills come first — they set the approach, then implementation skills carry it out.

- "Let's build X" → brainstorming first, then implementation skills
- "Fix this bug" → systematic-debugging first, then domain skills

## Red Flags

These thoughts mean STOP — you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying questions. |
| "Let me explore the codebase first" | Skills tell you HOW to explore. Check first. |
| "This doesn't need a formal skill" | If a skill exists, use it. |
| "The skill is overkill" | Simple things become complex. Use it. |

## Project-Specific Adaptation

This project uses:
- **Backend**: Spring Boot 3.3 + Java 17
- **Frontend**: Node.js 16 + TypeScript
- **Database**: MySQL 8
- **Testing**: JUnit 5 (backend) + Vitest (frontend)

Always check `rules/` directory for project-specific conventions before writing code.

## User Instructions

User instructions (AGENTS.md, .cursorrules, direct requests) take precedence over skills, which in turn override default behavior.
