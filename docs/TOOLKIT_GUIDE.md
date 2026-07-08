# Pragmatic Digital Toolkit Developer Guide

A comprehensive guide for developers to understand and use the Pragmatic Digital reusable toolkit.

---

## What is the Toolkit?

The reusable toolkit is a monorepo containing shared, production-ready code for building applications at Pragmatic Digital. It includes:

- **Frontend Components** - Accessible React UI components
- **React Hooks** - Custom hooks for common patterns
- **Backend Utilities** - Node.js and PHP utilities
- **Shared Code** - Types, constants, configurations

**Key Principle:** If code is reusable, it belongs in the toolkit. Never duplicate functionality across projects.

---

## Quick Start

### For Using Components (Frontend Developers)

```bash
# Install component library
npm install @pragmatic/ui

# Use in your project
import { Hero, Button } from '@pragmatic/ui';

# View documentation
pnpm --filter @pragmatic/ui storybook
```

### For Using Hooks

```bash
npm install @pragmatic/hooks

import { useCustomHook } from '@pragmatic/hooks';
```

### For Using Types

```bash
npm install @pragmatic/types

import type { ApiResponse } from '@pragmatic/types';
```

---

## Decision Tree: Choosing the Right Package

### Need a UI Component?
→ Check `@pragmatic/ui` first
→ If not available, check Storybook for similar components
→ Not available? Consider adding it to the toolkit

```tsx
import { Hero, Button } from '@pragmatic/ui';
```

### Need React Logic?
→ Check `@pragmatic/hooks` for custom hooks
→ Consider adding reusable hooks to the toolkit

```tsx
import { useCustomHook } from '@pragmatic/hooks';
```

### Need Backend Code?

**Node.js?**
→ Check `@pragmatic/http-client` for HTTP requests
→ Check `@pragmatic/logger` for logging

```typescript
import { HttpClient } from '@pragmatic/http-client';
import { Logger } from '@pragmatic/logger';
```

**PHP?**
→ Check `@pragmatic/php-*` packages for framework utilities

### Need Types or Constants?

**Types?**
→ Check `@pragmatic/types` for shared type definitions
→ Add new domain types to toolkit if reusable

```typescript
import type { ApiResponse } from '@pragmatic/types';
```

**Constants?**
→ Check `@pragmatic/constants` for shared values
→ Add new constants to toolkit if reused across projects

```typescript
import { API_ENDPOINTS } from '@pragmatic/constants';
```

### Need Configuration?

**ESLint?**
→ Use `@pragmatic/eslint-config`

**TypeScript?**
→ Extend `@pragmatic/tsconfig`

---

## All Available Packages

### Frontend

| Package | Purpose | Use When |
|---------|---------|----------|
| `@pragmatic/ui` | Accessible React components | Building UIs, need consistent design system |
| `@pragmatic/hooks` | Custom React hooks | Need reusable component logic, state management patterns |

### Backend

| Package | Purpose | Use When |
|---------|---------|----------|
| `@pragmatic/http-client` | HTTP client utilities | Making API requests from Node.js |
| `@pragmatic/logger` | Logging utilities | Need structured logging in backend |
| `@pragmatic/php-*` | PHP framework utilities | Building PHP applications |

### Shared

| Package | Purpose | Use When |
|---------|---------|----------|
| `@pragmatic/types` | TypeScript type definitions | Need consistent types across projects |
| `@pragmatic/constants` | Shared constants and enums | Need consistent constant values |

### Tooling

| Package | Purpose | Use When |
|---------|---------|----------|
| `@pragmatic/eslint-config` | ESLint configuration | Setting up code linting |
| `@pragmatic/tsconfig` | TypeScript configuration | Setting up TypeScript compilation |

---

## Component Examples

### Using Hero Component

```tsx
import { Hero } from '@pragmatic/ui';

export function LandingPage() {
  return (
    <Hero
      title="Transform Your Business"
      subtitle="With our platform"
      description="Build better digital experiences"
      backgroundType="gradient"
      gradient={{
        direction: 'to-bottom-right',
        from: '#667eea',
        to: '#764ba2'
      }}
      layout="centered"
      buttons={[
        {
          label: 'Get Started',
          variant: 'default',
          onClick: () => navigateTo('/signup')
        },
        {
          label: 'Learn More',
          variant: 'outline',
          onClick: () => scrollTo('features')
        }
      ]}
      minHeight={500}
    />
  );
}
```

### Using Button Component

```tsx
import { Button } from '@pragmatic/ui';

export function MyComponent() {
  return (
    <div className="flex gap-3">
      <Button variant="default" onClick={onSubmit}>
        Submit
      </Button>
      <Button variant="secondary" onClick={onReset}>
        Reset
      </Button>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
```

### Using Custom Hook

```tsx
import { useCustomHook } from '@pragmatic/hooks';

export function MyComponent() {
  const value = useCustomHook();

  return <div>{value}</div>;
}
```

### Using Types and Constants

```tsx
import type { ApiResponse } from '@pragmatic/types';
import { API_ENDPOINTS } from '@pragmatic/constants';
import { HttpClient } from '@pragmatic/http-client';

async function fetchUsers(): Promise<ApiResponse> {
  const client = new HttpClient();
  return await client.get(API_ENDPOINTS.USERS);
}
```

---

## When Should Code Be Added to the Toolkit?

### ✅ Add to Toolkit If:

1. **Reusable across projects** - Used in 2+ applications
2. **Stable API** - Won't change frequently
3. **Well-tested** - Comprehensive test coverage
4. **Well-documented** - Clear examples and API docs
5. **Follows patterns** - Consistent with existing toolkit code
6. **No breaking changes** - Can be versioned independently

### ❌ Don't Add to Toolkit If:

1. **Project-specific** - Only used in one app
2. **Experimental** - Still evolving API
3. **Untested** - No test coverage
4. **Undocumented** - No clear usage examples
5. **Depends on project specifics** - Tightly coupled to one project

### Example: Should I Add This Hook?

```typescript
// ❌ NO - Too project-specific
function useMyCompanySpecificLogic() {
  // Uses company-specific constants
  // Only used in one app
}

// ✅ YES - Reusable pattern
function usePagination(items: T[], pageSize: number) {
  // Generic pagination logic
  // Useful in many projects
  // Well-tested and documented
}
```

---

## Development Workflow

### Using Toolkit Packages in New Projects

```bash
# 1. Create new project
npx create-react-app my-app

# 2. Install toolkit packages
npm install @pragmatic/ui @pragmatic/hooks @pragmatic/types @pragmatic/constants

# 3. Extend configs
npm install --save-dev @pragmatic/eslint-config @pragmatic/tsconfig

# 4. Configure eslint
# .eslintrc.js
module.exports = {
  extends: ['@pragmatic/eslint-config']
};

# 5. Configure TypeScript
# tsconfig.json
{
  "extends": "@pragmatic/tsconfig/react"
}

# 6. Use components
import { Hero, Button } from '@pragmatic/ui';
```

### Adding to Toolkit

```bash
# 1. Decide which package (ui, hooks, types, etc.)
# 2. Create component/utility in appropriate package
# 3. Add tests
# 4. Add Storybook story (if component)
# 5. Update package README
# 6. Build and test
pnpm build
pnpm build-storybook

# 7. Create changeset for version bump
pnpm changeset

# 8. Commit and push
git add .
git commit -m "Add new feature to @pragmatic/package"
```

---

## Best Practices

### 1. **Check Toolkit First**
Always check if functionality exists before implementing:
```typescript
// ❌ DON'T - Create new
function MyButton() { /* ... */ }

// ✅ DO - Use toolkit
import { Button } from '@pragmatic/ui';
```

### 2. **Use Consistent Types**
Import types from toolkit:
```typescript
// ❌ DON'T - Define locally
interface User {
  id: string;
  name: string;
}

// ✅ DO - Use toolkit types
import type { User } from '@pragmatic/types';
```

### 3. **Follow British Spelling**
All code uses British spelling:
```typescript
// ❌ DON'T
const backgroundColor = 'blue';
function customizeComponent() {}

// ✅ DO
const backgroundColour = 'blue';
function customiseComponent() {}
```

### 4. **Test Before Publishing**
```bash
# Run all checks before committing
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

### 5. **Document Usage**
Add examples to README and Storybook:
```typescript
/**
 * MyComponent - Does something useful
 *
 * @example
 * <MyComponent prop1="value" />
 */
export const MyComponent = () => { /* ... */ };
```

---

## Versioning & Publishing

The toolkit uses **Changesets** for versioning:

```bash
# 1. Make your changes
# 2. Create a changeset
pnpm changeset

# Follow prompts to describe the change
# - Type: patch, minor, major
# - Description: What changed

# 3. Commit
git commit -m "Add feature"

# 4. When ready to release, changesets are used
# GitHub Actions automatically publishes to npm
```

---

## Support & Documentation

### Find Documentation For:

**Components:**
```bash
pnpm --filter @pragmatic/ui storybook
```

**Entire Toolkit:**
- `.ai/pragmatic-toolkit.md` - Full overview
- `packages/*/README.md` - Package-specific docs

### Need Help?

1. Check `.ai/pragmatic-toolkit.md`
2. View Storybook stories for components
3. Read package README files
4. Check existing tests for examples
5. Review similar implementations

---

## Summary

| Task | Package |
|------|---------|
| Build UI | `@pragmatic/ui` |
| Reusable component logic | `@pragmatic/hooks` |
| Make HTTP requests | `@pragmatic/http-client` |
| Log structured data | `@pragmatic/logger` |
| Share types | `@pragmatic/types` |
| Share constants | `@pragmatic/constants` |
| Configure ESLint | `@pragmatic/eslint-config` |
| Configure TypeScript | `@pragmatic/tsconfig` |

**Remember:** When in doubt, check the toolkit first!
