# test-driven-development

| name | test-driven-development |
|------|------|
| description | Activates during implementation - enforces RED-GREEN-REFACTOR cycle for both Java and TypeScript |

## When to Use

- During every implementation task
- Before writing any production code
- When fixing bugs (write regression test first)

## The Cycle

```
RED → GREEN → REFACTOR
 ↑                  |
 └──────────────────┘
```

### RED: Write a Failing Test

1. Write a test that describes the desired behavior
2. Run the test — it MUST fail
3. If the test passes without new code, the test is wrong

**Backend (JUnit 5)**:
```java
@Test
void should_returnUser_when_validIdProvided() {
    // Arrange
    var expected = new User(1L, "test@example.com");
    when(repository.findById(1L)).thenReturn(Optional.of(expected));

    // Act
    var result = userService.getUserById(1L);

    // Assert
    assertThat(result).isEqualTo(expected);
}
```

**Frontend (Vitest)**:
```typescript
it('should return user when valid id provided', async () => {
  // Arrange
  const mockUser = { id: 1, name: 'Test' };
  vi.spyOn(api, 'getUser').mockResolvedValue(mockUser);

  // Act
  const result = await getUserById(1);

  // Assert
  expect(result).toEqual(mockUser);
});
```

### GREEN: Write Minimal Code

1. Write the minimum code to make the test pass
2. Don't add features beyond what the test requires
3. Run the test — it MUST pass

### REFACTOR: Clean Up

1. Remove duplication
2. Improve naming
3. Extract common patterns
4. Run tests again — they MUST still pass

## Rules

- **NEVER** write production code before the test
- **NEVER** skip the RED step
- **NEVER** refactor without green tests
- If you catch yourself writing code first: STOP, delete it, write the test

## Testing Anti-Patterns

| Anti-Pattern | Fix |
|-------------|-----|
| Testing implementation details | Test behavior/outcomes |
| Tests that always pass | Verify RED step first |
| Fragile tests (break on refactor) | Test public API, not internals |
| Slow tests | Use mocks, avoid real DB/network |
| Test data dependencies | Each test creates its own data |

## Checklist

- [ ] Wrote failing test first (RED)
- [ ] Verified test fails for the right reason
- [ ] Wrote minimal implementation (GREEN)
- [ ] Verified test passes
- [ ] Refactored for clarity (REFACTOR)
- [ ] All existing tests still pass
