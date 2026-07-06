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

**Note:** pnpm commands below apply to **JavaScript/TypeScript packages only**. PHP packages use Composer and have their own separate workflow.

```bash
# Build all JS/TS packages
pnpm build

# Run in development mode (watch JS/TS packages)
pnpm dev

# Lint all JS/TS packages
pnpm lint

# Type-check all JS/TS packages
pnpm typecheck

# Run tests (when configured)
pnpm test

# Run Storybook for UI components (@pragmatic/ui only)
pnpm storybook

# Build Storybook for deployment
pnpm build-storybook
```

#### PHP Package Workflow

For PHP packages (`packages/backend/php/*`), work in the individual package directory:

```bash
cd packages/backend/php/support
composer install
composer phpcs      # Check coding standards
composer phpstan    # Run static analysis
composer test       # Run tests (when configured)
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

- **Package manager:** pnpm
- **Build tool:** TypeScript compiler
- **Published to:** npm registry
- **Independently versioned** with Changesets
- **Code quality:** TypeScript strict mode, ESLint, Prettier
- **UI packages:** Storybook support for component documentation
- **Linting/Building:** Managed by pnpm workspace commands (`pnpm build`, `pnpm lint`, `pnpm typecheck`)

### PHP Packages (`pragmatic/*`)

Located in `packages/backend/php/*`.

- **Package manager:** Composer (per-package)
- **Build tool:** None (PHP is interpreted)
- **Published to:** Packagist (deferred setup)
- **Code quality:** PHPCS (PSR-12), PHPStan (level 8)
- **Framework-specific:** Laravel, WordPress/Bedrock, Craft CMS helpers
- **Independently versioned** (deferred publication to Packagist)
- **Linting/Analysis:** Run within individual package directories using Composer scripts
- **Note:** pnpm and Storybook do not apply to PHP packages

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
