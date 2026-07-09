# Pragmatic Digital Reusable Toolkit

Comprehensive monorepo containing reusable frontend, backend, and shared code for Pragmatic Digital projects.

**Repository**: `reusable-toolkit`
**Manager**: pnpm workspaces
**Node**: 18+

---

## Quick Reference

### Installation
```bash
# Install from npm
npm install @pragmatic/ui @pragmatic/hooks @pragmatic/types @pragmatic/constants

# Or specific packages
npm install @pragmatic/ui
npm install @pragmatic/http-client
```

### Basic Usage
```typescript
// Frontend Components
import { Hero, Button } from '@pragmatic/ui';

// React Hooks
import { useCustomHook } from '@pragmatic/hooks';

// Types
import type { ApiResponse } from '@pragmatic/types';

// Constants
import { API_ENDPOINTS } from '@pragmatic/constants';

// Backend
import { HttpClient } from '@pragmatic/http-client';
import { Logger } from '@pragmatic/logger';
```

---

## Frontend Packages

### @pragmatic/ui
React component library with accessible, styled components built with Tailwind CSS and shadcn/ui patterns.

**Major Components:**
- `StickyHeader` - Comprehensive sticky header orchestrator
  - 4 layout variants: spread, centred, logo-left-nav-right, logo-left-nav-centre
  - 5 scroll behaviours: fade, shrink, hide, blur, none
  - Responsive mobile/desktop with configurable breakpoint
  - Desktop navigation with mega menus
  - Mobile drawer menu
  - User profile dropdown with avatar
  - Search functionality
  - Announcement bar
  - Full WCAG 2.1 AA accessibility
  - 13 Storybook stories + 50+ tests
  - Import: `import { StickyHeader, type StickyHeaderProps } from '@pragmatic/ui'`

- `Hero` - Large banner hero section component
  - Multiple background types (image, video, gradient, solid colour)
  - Flexible layouts (centred, left, right)
  - Customisable overlays and multiple CTAs
  - Full WCAG 2.1 AA accessibility
  - Mobile-first responsive design
  - 20+ Storybook stories + 68 tests
  - Import: `import { Hero, type HeroProps } from '@pragmatic/ui'`

**Foundation UI Components:**
- `Button` - shadcn/ui-based button (multiple variants, sizes)
- `Input` - Form input with validation states and icons
- `Avatar` - User avatar with image or initials fallback
- `Separator` - Horizontal/vertical visual dividers
- `Sheet` - Mobile drawer/slide-out panel (Radix Dialog)
- `DropdownMenu` - User menus and actions (Radix DropdownMenu)
- `NavigationMenu` - Site navigation with mega menus (Radix NavigationMenu)

**When to Use:**
- Building user interfaces that need reusable, accessible components
- Creating consistent design systems across applications
- Need components with built-in accessibility features
- Want Tailwind-based styling with shadcn patterns
- Building full-featured sticky headers for web applications

**Key Features:**
- TypeScript support with full type safety
- Storybook documentation (20+ stories per component)
- Comprehensive test coverage (50+ tests per complex component)
- Tailwind CSS v4 styling
- British spelling conventions
- CVA (Class Variance Authority) for type-safe variants
- Radix UI primitives for accessibility

### @pragmatic/hooks
Custom React hooks for common patterns and utilities.

**Available Hooks:**
- `useScrollBehavior` - Scroll position tracking and threshold detection
  - Tracks scroll position, scroll state, and threshold crossing
  - Returns: `{ scrollY, isScrolling, isBelowThreshold }`
  - Configurable offset and debounce delay
  - Supports throttle option for performance
  - Import: `import { useScrollBehavior } from '@pragmatic/hooks'`

- `useScrollDirection` - Scroll direction detection (up, down, none)
  - Tracks scroll direction and position changes
  - Returns: `{ direction, previousScrollY, currentScrollY }`
  - Threshold-based filtering for minor scrolls
  - Debounce-based reset
  - Import: `import { useScrollDirection } from '@pragmatic/hooks'`

- `useMediaQuery` - CSS media query matching for responsive design
  - Matches media queries (mobile, dark mode, landscape, etc.)
  - Returns: `boolean` indicating if query matches
  - SSR-safe with window checks
  - Full media query support
  - Import: `import { useMediaQuery } from '@pragmatic/hooks'`

**When to Use:**
- Encapsulating component logic
- Scroll-based animations and effects (sticky headers, parallax)
- Responsive design without Tailwind breakpoints
- Sharing state management patterns across components
- Reusing side effect logic across multiple applications

---

## Backend Packages

### @pragmatic/http-client
Node.js HTTP client utilities for making API requests.

**When to Use:**
- Making HTTP requests from Node.js backend
- Need consistent HTTP handling across projects
- Want typed request/response handling

### @pragmatic/logger
Structured logging utilities for backend services.

**When to Use:**
- Structured logging in backend services
- Need consistent log formatting
- Want to track application events

### @pragmatic/php-*
PHP utilities for Laravel, WordPress, and Craft CMS.

**Packages:**
- PHP utilities for framework-specific needs
- CMS integration helpers

**When to Use:**
- Building PHP applications with Pragmatic toolkit
- Need framework-specific utilities

---

## Shared Packages

### @pragmatic/types
Shared TypeScript type definitions used across projects.

**Common Types:**
- (To be documented as types are added)

**When to Use:**
- Need consistent types across frontend and backend
- Defining API contracts
- Sharing domain models

**Import Pattern:**
```typescript
import type { SharedType, AnotherType } from '@pragmatic/types';
```

### @pragmatic/constants
Shared constants and enums used across projects.

**Common Constants:**
- (To be documented as constants are added)

**When to Use:**
- Need consistent constant values
- Defining error codes, status codes, etc.
- Sharing enum definitions

**Import Pattern:**
```typescript
import { CONSTANT_VALUE } from '@pragmatic/constants';
```

---

## Tooling Packages

### @pragmatic/eslint-config
Shared ESLint configuration for consistent code quality.

**When to Use:**
- All new projects should use this config
- Enforces consistent code style
- Prevents common errors

### @pragmatic/tsconfig
Shared TypeScript configuration with strict mode.

**When to Use:**
- All TypeScript projects should extend this
- Ensures consistent compilation settings
- Enforces strict type checking

---

## Common Patterns

### React Component in New App with StickyHeader
```typescript
import { StickyHeader, Hero, Button } from '@pragmatic/ui';
import type { StickyHeaderProps } from '@pragmatic/ui';

export function App() {
  return (
    <>
      <StickyHeader
        logo={{ src: 'logo.svg', alt: 'Company Logo', href: '/' }}
        navLinks={[
          { label: 'Home', href: '/' },
          { label: 'Products', href: '/products' },
          { label: 'Contact', href: '/contact' }
        ]}
        buttons={[
          { label: 'Sign In', variant: 'ghost' },
          { label: 'Get Started', variant: 'default' }
        ]}
        search={{ enabled: true, placeholder: 'Search...' }}
        user={{
          name: 'John Doe',
          initials: 'JD',
          menuItems: [
            { label: 'Profile', href: '/profile' },
            { label: 'Sign Out', href: '/logout' }
          ]
        }}
        layout="spread"
        sticky
      />

      <Hero
        title="Welcome"
        buttons={[
          { label: 'Get Started', variant: 'default', onClick: () => {} }
        ]}
      />
    </>
  );
}
```

### Using Scroll Hooks
```typescript
import { useScrollBehavior, useScrollDirection } from '@pragmatic/hooks';

export function ScrollingComponent() {
  const scrollState = useScrollBehavior({ offset: 100 });
  const scrollDir = useScrollDirection();

  return (
    <div
      style={{
        opacity: scrollState.isBelowThreshold ? 0.8 : 1,
        transform: scrollDir.direction === 'down' ? 'translateY(-20px)' : 'translateY(0px)'
      }}
    >
      Scroll down to see effect (current: {scrollDir.direction})
    </div>
  );
}
```

### Using Types and Constants
```typescript
import type { ApiResponse } from '@pragmatic/types';
import { API_ENDPOINTS } from '@pragmatic/constants';
import { HttpClient } from '@pragmatic/http-client';

const client = new HttpClient();
const response = await client.get<ApiResponse>(
  API_ENDPOINTS.USERS
);
```

### Custom Hook Usage
```typescript
import { useCustomHook } from '@pragmatic/hooks';

export function MyComponent() {
  const value = useCustomHook();
  return <div>{value}</div>;
}
```

---

## Development Workflow

### Adding New Components to @pragmatic/ui
1. Create component in `packages/frontend/ui/src/components/ComponentName/`
2. Export from `packages/frontend/ui/src/index.ts`
3. Create Storybook stories (`.stories.tsx`)
4. Add comprehensive tests (`.test.tsx`)
5. Update documentation
6. Run `pnpm build` and `pnpm build-storybook`

### Adding New Utilities/Hooks
1. Add to appropriate package
2. Export from package index
3. Document in README
4. Add tests
5. Update this guide

### Publishing
Uses changesets for versioning:
```bash
pnpm changeset
pnpm version-packages
pnpm build
# GitHub Actions handles npm publishing
```

---

## Quality Standards

All code in the toolkit must meet:
- ✅ TypeScript strict mode compliant
- ✅ ESLint rules passing
- ✅ WCAG 2.1 AA accessibility (for UI)
- ✅ Comprehensive test coverage
- ✅ Storybook documentation
- ✅ British spelling throughout
- ✅ No AI/Claude mentions in public code

---

## Key Principles

1. **DRY (Don't Repeat Yourself)** - If code is reusable, it belongs in the toolkit
2. **Type Safety** - All code is TypeScript with strict mode
3. **Accessibility** - UI components meet WCAG 2.1 AA standard
4. **Documentation** - Every package has examples and clear documentation
5. **Testing** - Comprehensive test coverage required
6. **Consistency** - Shared configs enforce consistent style across projects

---

## File Structure
```
reusable-toolkit/
├── packages/
│   ├── frontend/
│   │   ├── ui/              # React components
│   │   └── hooks/           # React hooks
│   ├── backend/
│   │   ├── node/
│   │   │   ├── http-client/
│   │   │   └── logger/
│   │   └── php/
│   └── shared/
│       ├── types/
│       └── constants/
├── tooling/
│   ├── eslint-config/
│   ├── tsconfig/
│   └── php/
├── docs/
└── .ai/                     # AI documentation
```

---

## For AI Assistants

When helping with Pragmatic Digital projects:

1. **Always check this toolkit first** before implementing anything
2. **Suggest reusable packages** when appropriate
3. **Encourage adding to toolkit** for reusable code
4. **Never duplicate** existing functionality
5. **Point to Storybook** for component usage examples
6. **Reference types** from `@pragmatic/types` when available

This toolkit is designed to be the single source of truth for reusable code.
