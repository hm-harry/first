# 测试规范 — first-main

## 核心原则

1. **测试先行**：所有新功能必须先写测试，再写实现代码 (TDD)
2. **测试命名**：测试名应清晰描述预期行为
3. **测试独立性**：每个测试用例必须相互独立
4. **测试可靠性**：测试必须可重复执行，不依赖外部环境

## 后端测试 (JUnit 5 + Mockito)

### 文件结构

```
src/test/java/com/firstmain/
├── controller/      # Controller 集成测试
├── service/         # Service 单元测试
├── repository/      # Repository 测试
└── integration/     # 端到端集成测试
```

### 命名规范

```java
// 测试类命名
class UserServiceTest { }        // 单元测试
class UserControllerIT { }       // 集成测试

// 测试方法命名：should_预期结果_when_条件
@Test
void should_returnUser_when_validIdProvided() { }

@Test
void should_throwException_when_userNotFound() { }
```

### 测试结构 (Arrange-Act-Assert)

```java
@Test
void should_createUser_when_validRequest() {
    // Arrange: 准备测试数据
    UserRequest request = new UserRequest("test@example.com", "Test User");
    when(repository.save(any())).thenReturn(expectedUser);

    // Act: 执行被测方法
    UserResponse result = userService.createUser(request);

    // Assert: 验证结果
    assertThat(result.getName()).isEqualTo("Test User");
    verify(repository).save(any());
}
```

### 覆盖率要求

| 层次 | 最低覆盖率 | 说明 |
|------|-----------|------|
| Service | 80% | 核心业务逻辑 |
| Controller | 70% | API 端点 |
| Repository | 60% | 数据访问 |
| Util | 90% | 工具函数 |

## 前端测试 (Vitest + React Testing Library)

### 文件结构

```
frontend/src/
├── app/
│   └── __tests__/          # 页面级测试
├── components/
│   └── __tests__/          # 组件测试
├── hooks/
│   └── __tests__/          # Hook 测试
├── services/
│   └── __tests__/          # 服务测试
└── utils/
    └── __tests__/          # 工具函数测试
```

### 命名规范

```typescript
// 文件名: *.test.tsx (组件) / *.test.ts (工具/Hook)
describe('UserCard', () => {
  it('should display user name when user is loaded', () => { });
  it('should show loading spinner when fetching', () => { });
});
```

### 组件测试示例 (React Testing Library)

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { UserCard } from '../UserCard';

describe('UserCard', () => {
  it('should display user name', () => {
    // Arrange & Act
    render(<UserCard name="Test User" email="test@example.com" />);

    // Assert
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  it('should call onDelete when delete button clicked', () => {
    const handleDelete = vi.fn();
    render(<UserCard name="Test" email="t@t.com" onDelete={handleDelete} />);

    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(handleDelete).toHaveBeenCalledOnce();
  });
});
```

### 工具函数测试

```typescript
describe('formatDate', () => {
  it('should format ISO date to YYYY-MM-DD', () => {
    const input = '2025-01-15T10:30:00Z';
    const result = formatDate(input);
    expect(result).toBe('2025-01-15');
  });
});
```

## 测试反模式 (禁止)

- 测试中依赖真实数据库连接（应使用 Mock 或 H2 内存数据库）
- 测试之间有共享状态
- 使用 `Thread.sleep()` 等待异步结果
- 测试中硬编码环境相关的配置
- 只测试 happy path，忽略异常路径
- 测试名不描述预期行为

## CI 集成

测试必须在 CI 中全部通过才能合并代码：

```bash
# 后端测试
cd backend && mvn test

# 前端测试
pnpm --filter frontend test
```
