# Changesets

This repository uses [Changesets](https://github.com/changesets/changesets) to manage versioning and publishing.

## Creating a changeset

When you make changes to a package, create a changeset:

```bash
pnpm changeset
```

Follow the prompts to:

1. Select which packages changed
2. Choose version bump type (major/minor/patch)
3. Write a summary of the changes

A new changeset file will be created in this directory. Commit it with your changes.

## Versioning packages

To bump package versions based on changesets:

```bash
pnpm changeset:version
```

This will:

- Update package.json versions
- Update CHANGELOG.md files
- Remove changeset files

## Publishing

To publish all changed packages to npm:

```bash
pnpm changeset:publish
```

**Note:** Publishing is typically handled automatically by GitHub Actions when changesets are merged to `main`.
