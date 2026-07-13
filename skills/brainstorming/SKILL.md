# brainstorming

| name | brainstorming |
|------|------|
| description | Activates before writing code - refines rough ideas through questions, explores alternatives, presents design in sections for validation |

## When to Use

- Before starting any new feature or significant change
- When requirements are unclear or ambiguous
- When there are multiple possible approaches
- Before creating an OpenSpec proposal

## Process

### Phase 1: Understand Intent

1. Ask: "What are you really trying to accomplish?"
2. Read existing `openspec/specs/` to understand current system behavior
3. Identify constraints from `rules/` and `AGENTS.md`

### Phase 2: Explore Alternatives

1. Present 2-3 possible approaches with trade-offs
2. Consider impact on:
   - Backend (Spring Boot services, JPA entities)
   - Frontend (Node.js modules, TypeScript types)
   - Database (MySQL schema changes)
3. Recommend the simplest approach (YAGNI)

### Phase 3: Refine Design

Present design in digestible sections:

1. **What**: Requirements and scope
2. **How**: Technical approach
3. **Why**: Rationale for decisions
4. **Risks**: Potential issues and mitigations

Wait for validation after each section before proceeding.

### Phase 4: Output

Save the approved design as a proposal:
- Create `openspec/changes/<change-name>/proposal.md`
- Use the template from `openspec/changes/_template/`

## Checklist

- [ ] Understood the user's true intent
- [ ] Read relevant specs in `openspec/specs/`
- [ ] Explored at least 2 alternatives
- [ ] Presented design in sections
- [ ] Got validation on each section
- [ ] Created proposal document

## Anti-Patterns

- Jumping straight to code without design
- Presenting the entire design at once (too much to review)
- Ignoring existing specs and conventions
- Over-engineering: adding complexity "just in case"
