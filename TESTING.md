# Testing Guide - AWMusic

Comprehensive testing setup for the AWMusic monorepo.

## 📋 Test Structure

```
packages/
├── shared/
│   ├── src/types/music.test.ts     # Type validation tests
│   └── vitest.config.ts            # Vitest configuration
├── api/
│   ├── src/index.test.ts           # API endpoint tests
│   └── vitest.config.ts            # Vitest configuration
└── mobile/
    ├── components/__tests__/        # Component tests
    ├── hooks/__tests__/             # Hook tests
    └── jest.config.js               # Jest configuration
```

## 🧪 Testing Frameworks

### Shared & API Packages
- **Framework:** Vitest
- **Coverage:** V8
- **Why:** Fast, modern, TypeScript-first testing for Node.js code

### Mobile Package
- **Framework:** Jest with jest-expo preset
- **Testing Library:** @testing-library/react-native
- **Why:** Official Expo testing setup, React Native compatibility

## 🚀 Running Tests

### All Packages
```bash
# Run all tests
pnpm test

# Watch mode (all packages)
pnpm test:watch

# Coverage report (all packages)
pnpm test:coverage
```

### Individual Packages
```bash
# Shared types
pnpm test:shared

# API server
pnpm test:api

# Mobile app
pnpm test:mobile
```

### Package-Specific Commands
```bash
# In packages/shared/
pnpm test              # Run once
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage

# In packages/api/
pnpm test              # Run once
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage

# In packages/mobile/
pnpm test              # Run once
pnpm test:watch        # Watch mode
pnpm test:coverage     # With coverage
```

## 📊 Coverage Reports

Coverage reports are generated in each package's `coverage/` directory:

```
packages/shared/coverage/
packages/api/coverage/
packages/mobile/coverage/
```

View HTML reports:
```bash
# Shared
open packages/shared/coverage/index.html

# API
open packages/api/coverage/index.html

# Mobile
open packages/mobile/coverage/index.html
```

## ✅ Test Categories

### 1. Type Tests (`@awmusic/shared`)
- **File:** `src/types/music.test.ts`
- **Tests:** Type validation, interface compliance
- **Coverage:** MusicTrack, SearchResult, UserPreferences, Subscription

Example:
```typescript
it('should create a valid MusicTrack object', () => {
  const track: MusicTrack = {
    id: 'track-123',
    title: 'Test Song',
    // ... other fields
  };
  expect(track.qualityScore).toBeGreaterThanOrEqual(1);
});
```

### 2. API Tests (`@awmusic/api`)
- **File:** `src/index.test.ts`
- **Tests:** Endpoint responses, error handling, CORS
- **Tools:** Supertest for HTTP assertions

Example:
```typescript
it('should return health check status', async () => {
  const response = await request(app).get('/health');
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('status', 'ok');
});
```

### 3. Component Tests (`@awmusic/mobile`)
- **Files:** `components/__tests__/*.test.tsx`
- **Tests:** Rendering, props, user interaction
- **Coverage:** ThemedText, ThemedView components

Example:
```typescript
it('should render text content', () => {
  const { getByText } = render(<ThemedText>Test</ThemedText>);
  expect(getByText('Test')).toBeTruthy();
});
```

### 4. Hook Tests (`@awmusic/mobile`)
- **Files:** `hooks/__tests__/*.test.ts`
- **Tests:** Hook behavior, theme switching
- **Coverage:** useThemeColor hook

Example:
```typescript
it('should return light color when light theme is active', () => {
  const { result } = renderHook(() => useThemeColor({...}, 'background'));
  expect(result.current).toBe('#ffffff');
});
```

## 🎯 Test Standards

### Coverage Targets
- **Minimum:** 70% overall coverage
- **Goal:** 80%+ coverage
- **Critical paths:** 90%+ coverage

### Test Requirements
- ✅ All new components must have tests
- ✅ All API endpoints must have tests
- ✅ All shared types must have validation tests
- ✅ Critical user flows must have integration tests

### Best Practices
1. **Descriptive test names:** Use clear, action-oriented descriptions
2. **Arrange-Act-Assert:** Structure tests in clear phases
3. **Isolation:** Tests should not depend on each other
4. **Mocking:** Mock external dependencies and API calls
5. **Edge cases:** Test boundary conditions and error states

## 🔧 Configuration Files

### Vitest Config (`vitest.config.ts`)
```typescript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
```

### Jest Config (`jest.config.js`)
```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['<rootDir>/jest-setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
};
```

## 🐛 Debugging Tests

### Vitest (Shared & API)
```bash
# Run specific test file
pnpm vitest src/types/music.test.ts

# Debug mode
pnpm vitest --inspect-brk
```

### Jest (Mobile)
```bash
# Run specific test file
pnpm test components/__tests__/themed-text.test.tsx

# Update snapshots
pnpm test -u

# Debug mode
node --inspect-brk node_modules/.bin/jest --runInBand
```

## 📝 Writing New Tests

### Adding Tests for Shared Types
1. Create `*.test.ts` file next to type definition
2. Import types and vitest utilities
3. Write validation tests
4. Run `pnpm test:shared`

### Adding Tests for API Endpoints
1. Create test file in `packages/api/src/`
2. Use supertest for HTTP testing
3. Mock external services
4. Run `pnpm test:api`

### Adding Tests for Mobile Components
1. Create `__tests__/` directory in component folder
2. Use `@testing-library/react-native`
3. Mock hooks and expo modules
4. Run `pnpm test:mobile`

## 🔄 CI/CD Integration

### Pre-commit Hooks (Future)
```bash
pnpm test              # Run all tests
pnpm type-check        # Type checking
pnpm lint              # Linting
```

### GitHub Actions (Future)
```yaml
- name: Run tests
  run: pnpm test:coverage
  
- name: Upload coverage
  uses: codecov/codecov-action@v3
```

## 🧹 Cleaning Test Artifacts

```bash
# Remove all test coverage
pnpm clean:test

# Remove all build artifacts and tests
pnpm clean:all
```

## 📚 Resources

- [Vitest Documentation](https://vitest.dev)
- [Jest Documentation](https://jestjs.io)
- [React Native Testing Library](https://callstack.github.io/react-native-testing-library/)
- [Testing Library](https://testing-library.com)
- [Supertest](https://github.com/ladjs/supertest)
