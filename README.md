# Pragmatic Digital — Reusable Toolkit

A single internal monorepo for code reused across Pragmatic Digital client projects.

## Overview

This monorepo contains:

- **Frontend packages**: React components, hooks, and utilities (`@pragmatic/ui`, `@pragmatic/hooks`)
- **Backend packages**: Node.js utilities and PHP helpers (`@pragmatic/logger`, `@pragmatic/http-client`, `pragmatic/*`)
- **Shared packages**: Cross-stack types and constants (`@pragmatic/types`, `@pragmatic/constants`)
- **Tooling**: Shared ESLint configs, TypeScript configs, and PHP tooling

## Repository Structure

```
reusable-toolkit/
├── packages/
│   ├── frontend/        React components and hooks
│   ├── backend/         Backend utilities (Node.js and PHP)
│   └── shared/          Cross-stack types and constants
├── tooling/             Shared configuration packages
├── .github/workflows/   CI/CD workflows
└── .changeset/          Versioning configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9+

### Installation

```bash
pnpm install
```

### Available Scripts

```bash
# Build all packages
pnpm build

# Run in development mode
pnpm dev

# Lint all packages
pnpm lint

# Type-check all packages
pnpm typecheck

# Run tests
pnpm test

# Run Storybook (UI package)
pnpm storybook

# Build Storybook
pnpm build-storybook
```

## Versioning

This monorepo uses [Changesets](https://github.com/changesets/changesets) for independent package versioning and changelog generation.

### Creating a Changeset

When making changes to a package, create a changeset:

```bash
pnpm changeset
```

Follow the interactive prompts to:

1. Select which packages changed
2. Choose version bump type (major/minor/patch)
3. Write a summary of the changes

### Publishing

Version bumps and npm publishing are handled automatically by GitHub Actions when changesets are merged to `main`.

## Package Structure

### JavaScript/TypeScript Packages (`@pragmatic/*`)

Located in `packages/frontend/*`, `packages/backend/node/*`, and `packages/shared/*`.

- Published to npm registry
- Independently versioned with Changesets
- TypeScript with strict mode
- ESLint + Prettier

### PHP Packages (`pragmatic/*`)

Located in `packages/backend/php/*`.

- Published to Packagist (deferred setup)
- Framework-specific helpers split by CMS/framework
- PHPCS (PSR-12) and PHPStan (level 8) validation
- Independent Composer configuration per package

## Contribution Guidelines

1. **Choose the right package**: See the Contributing section below
2. **Create a changeset**: Required for feature branches
3. **Follow code style**: ESLint + Prettier (JS/TS), PHPCS (PHP)
4. **Add tests**: Where applicable
5. **Update documentation**: Package READMEs

### Where to Add Code

- **React-only code** → `packages/frontend/*`
- **Node.js-only code** → `packages/backend/node/*`
- **Framework-specific PHP** → `packages/backend/php/{laravel,wordpress,craft}-support`
- **Framework-agnostic PHP** → `packages/backend/php/support`
- **Cross-stack types/constants** → `packages/shared/*`

## License

MIT © Pragmatic Digital
