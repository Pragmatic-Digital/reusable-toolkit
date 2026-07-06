# Contributing to Pragmatic Digital Reusable Toolkit

Thank you for contributing to the Pragmatic Digital Reusable Toolkit! This guide will help you get started.

## Getting Started

1. Clone the repository
2. Install dependencies: `pnpm install`
3. Create a new branch for your feature: `git checkout -b feature/your-feature-name`

## Development Workflow

### Running Commands

Most commands are run from the root directory using pnpm:

```bash
# Build all packages
pnpm build

# Develop (watch mode)
pnpm dev

# Lint code
pnpm lint

# Type-check
pnpm typecheck

# Run Storybook for UI components
pnpm storybook
```

### Creating a Changeset

When you make changes that should be released, create a changeset:

```bash
pnpm changeset
```

Follow the prompts to:
1. Select which packages changed
2. Choose the version bump type (major/minor/patch)
3. Describe the changes

**Important:** Do not manually bump version numbers in package.json. Changesets handle this automatically.

## Code Style

### JavaScript/TypeScript

- ESLint checks code quality
- Prettier handles formatting
- TypeScript strict mode is enabled

Run before committing:

```bash
pnpm lint      # Fix linting issues
pnpm typecheck # Check types
```

### PHP

- PHPCS enforces PSR-12 coding standards
- PHPStan provides static analysis (level 8)

Run in individual package directories:

```bash
composer phpcs    # Check coding standards
composer phpstan  # Run static analysis
```

## Package Organization

### Where to Add Code

- **React components** → `packages/frontend/ui`
- **React hooks** → `packages/frontend/hooks`
- **Node.js utilities** → `packages/backend/node/{logger,http-client}`
- **Framework-agnostic PHP** → `packages/backend/php/support`
- **Laravel helpers** → `packages/backend/php/laravel-support`
- **WordPress helpers** → `packages/backend/php/wordpress-support`
- **Craft CMS helpers** → `packages/backend/php/craft-support`
- **Shared types/constants** → `packages/shared/{types,constants}`

### Adding a New Package

If you need to create a new package:

1. Create the package directory in the appropriate location
2. Add a `package.json` (for JS/TS) or `composer.json` (for PHP)
3. Create `src/` and `README.md`
4. Add to `pnpm-workspace.yaml` or `composer.json` if needed

## Testing

While not yet configured in this monorepo, tests are encouraged. When testing is set up:

```bash
pnpm test
```

## Documentation

- Update package READMEs when adding new features
- Add JSDoc comments to exported functions and types
- Use Storybook for documenting UI components

## Pull Request Process

1. Create a changeset for your changes
2. Ensure all linting and type-checking passes: `pnpm lint && pnpm typecheck`
3. Create a pull request with a clear description
4. Address any feedback from reviews

## Release Process

Releasing is handled automatically by GitHub Actions:

1. When a PR with changesets is merged to `main`, the release workflow creates a "Version Packages" PR
2. Merge that PR to bump versions and publish to npm/Packagist
3. Individual packages are versioned independently

## Questions?

Refer to the main README or check the package-specific READMEs for more information.
