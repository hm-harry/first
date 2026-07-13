# receiving-code-review

| name | receiving-code-review |
|------|------|
| description | Activates when receiving review feedback - structured process for addressing issues |

## When to Use

- After requesting a code review
- When receiving feedback on implementation
- When addressing review comments

## Process

### 1. Triage Feedback

Categorize each piece of feedback:

| Priority | Action |
|----------|--------|
| Critical | Stop everything, fix immediately |
| Warning | Fix before proceeding to next task |
| Info | Note for future consideration |

### 2. Address Issues

For each issue (starting with Critical):

1. **Understand**: Make sure you understand the concern
2. **Reproduce**: If it's a bug, reproduce it first
3. **Fix**: Implement the fix following TDD
4. **Verify**: Run all tests to ensure no regressions
5. **Respond**: Confirm the fix to the reviewer

### 3. Response Format

```markdown
## Review Response

### Critical Issues
- [x] Issue 1: [description] → Fixed in [file]
- [x] Issue 2: [description] → Fixed in [file]

### Warnings
- [x] Warning 1: [description] → Addressed
- [ ] Warning 2: [description] → Deferred (reason)

### Info
- Noted: [item]
```

## Rules

- Never dismiss feedback without explanation
- If you disagree with feedback, explain why with evidence
- Critical issues block all forward progress until resolved
- Re-run the full test suite after addressing issues
- Thank the reviewer for their time
