# Setup Guide — Pragmatic Digital Reusable Toolkit

This guide walks through the initial setup of the Reusable Toolkit monorepo.

## Prerequisites

- Node.js 18+ ([download](https://nodejs.org/))
- pnpm 9+ (`npm install -g pnpm`)
- Git

## Initial Setup (First Time)

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

   This installs all dependencies for every package in the monorepo and links workspace packages together.

2. **Verify the setup:**

   ```bash
   pnpm typecheck  # Should pass with no errors
   pnpm lint       # Should pass with no errors
   ```

## Daily Development

### Running Storybook (for UI components)

```bash
pnpm storybook
```

Opens Storybook on `http://localhost:6006`. Hot-reloads as you edit components.

### Building All Packages

```bash
pnpm build
```

Compiles TypeScript and generates JavaScript output in each package's `dist/` folder.

### Watching for Changes

```bash
pnpm dev
```

Watches all packages and rebuilds on changes (useful during development).

### Linting and Type-Checking

```bash
pnpm lint       # Runs ESLint across all JS/TS packages
pnpm typecheck  # Runs TypeScript type-checking
pnpm lint -- --fix  # Auto-fix linting issues
```

## Changing a Package

When you make changes to a package that should be released:

1. **Create a changeset:**

   ```bash
   pnpm changeset
   ```

2. **Follow the prompts:**
   - Select which packages changed
   - Choose the version bump (major/minor/patch)
   - Write a brief description

3. **Commit the changeset** along with your code changes

When your PR is merged to `main`, the CI/CD pipeline automatically:
1. Creates a "Version Packages" PR with updated versions and changelogs
2. Publishes changed packages to npm (JS/TS) and/or Packagist (PHP)

## Adding a New Package

To add a new JS/TS package:

1. Create directory: `packages/{frontend|backend/node|shared}/{package-name}`
2. Create `package.json`, `tsconfig.json`, `src/index.ts`, and `README.md`
3. Reference the templates in existing packages
4. Update `pnpm-workspace.yaml` if needed

To add a new PHP package:

1. Create directory: `packages/backend/php/{package-name}`
2. Create `composer.json` with appropriate `require` dependencies
3. Create `src/` directory with namespace-based structure
4. Create `README.md`

## npm Publishing Setup

To enable npm publishing from CI:

1. **Create an npm account** (if you don't have one)
2. **Generate an access token** at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/tokens)
3. **Add to GitHub Secrets:**
   - Go to repo Settings → Secrets and variables → Actions
   - Add secret: `NPM_TOKEN` with your token value

After this, `pnpm changeset:publish` in the release workflow will automatically publish to npm.

## Packagist Setup (PHP Packages)

PHP package publishing is **deferred** for now. When ready to publish PHP packages:

1. **Create Packagist account** at [packagist.org](https://packagist.org)
2. **Set up GitHub Actions split workflow** (see main README, section "PHP split mechanism")
3. **Link split repos to Packagist**

For now, consume PHP packages locally via Composer's `path` or `vcs` repositories.

## Troubleshooting

### `pnpm install` fails

- Ensure you have Node.js 18+ and pnpm 9+
- Try clearing cache: `pnpm store prune`

### TypeScript errors in VS Code

- Restart the TypeScript server: Cmd+Shift+P → "TypeScript: Restart TS Server"
- Ensure TypeScript extension is active

### Build fails in CI but works locally

- Ensure `pnpm-lock.yaml` is committed and up to date
- Run `pnpm install --frozen-lockfile` to match CI environment

### Storybook won't start

- Ensure you're running from the root directory: `pnpm storybook`
- Check that the `@pragmatic/ui` package dependencies are installed

## Next Steps

1. **Read the main README** for architecture overview
2. **Review CONTRIBUTING.md** for code style and workflow
3. **Start adding packages** — choose a feature from your project that would benefit from being shared
4. **Invite collaborators** — add team members to the GitHub org and repo

## Questions?

Refer to:
- Main `README.md` — project overview and structure
- `CONTRIBUTING.md` — code style, changeset workflow, package guidelines
- Individual package `README.md` files — package-specific usage
- `.changeset/README.md` — detailed Changesets documentation
