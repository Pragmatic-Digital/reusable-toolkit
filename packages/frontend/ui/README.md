# @pragmatic/ui

Accessible, reusable React UI components built with Tailwind CSS and shadcn/ui patterns. Part of the Pragmatic Digital reusable toolkit.

## Features

- ✨ **Accessible** - WCAG 2.1 AA compliant components
- 🎨 **Styled** - Tailwind CSS + shadcn/ui patterns
- 📱 **Responsive** - Mobile-first design approach
- 🔧 **Type-Safe** - Full TypeScript support with strict mode
- 📚 **Well-Documented** - Storybook stories and comprehensive examples
- ✅ **Tested** - Comprehensive test coverage with Vitest + RTL

## Installation

```bash
npm install @pragmatic/ui
# or
pnpm add @pragmatic/ui
```

## Available Components

### Hero

Versatile, accessible hero section component with multiple background types and layouts.

**Quick Start:**
```tsx
import { Hero } from '@pragmatic/ui';

<Hero
  title="Welcome to Our Platform"
  subtitle="Build Something Amazing"
  backgroundType="gradient"
  gradient={{
    direction: 'to-bottom-right',
    from: '#667eea',
    to: '#764ba2'
  }}
  layout="centered"
  buttons={[
    { label: 'Get Started', variant: 'default' },
    { label: 'Learn More', variant: 'outline' }
  ]}
/>
```

**Features:**
- Multiple background types: image, video, gradient, solid colour
- Three layout variants: centred, left-aligned, right-aligned
- Customisable overlay with opacity control
- Multiple CTA buttons with variants
- WCAG 2.1 AA accessibility
- Mobile-first responsive design

See [Storybook](#storybook) for complete component documentation and interactive examples.

### Button

shadcn/ui-based button component with multiple variants and sizes.

**Quick Start:**
```tsx
import { Button } from '@pragmatic/ui';

<Button variant="default" onClick={() => {}}>
  Click Me
</Button>
```

**Variants:** default, secondary, outline, destructive, ghost, link
**Sizes:** default, sm, lg, icon

See [Storybook](#storybook) for all available variants and usage examples.

## Usage

```tsx
import { Hero, Button, type HeroProps } from '@pragmatic/ui';

export function MyComponent() {
  return (
    <>
      <Hero
        title="Welcome"
        buttons={[{ label: 'Start', variant: 'default' }]}
      />
      <Button>Click here</Button>
    </>
  );
}
```

## Development

### Storybook

View interactive component documentation:

```bash
# From the ui package directory
pnpm storybook
# Opens at http://localhost:6006

# Or from root
pnpm --filter @pragmatic/ui storybook
```

Build static Storybook:
```bash
pnpm build-storybook
```

### Testing

```bash
pnpm test              # Run tests
pnpm test:watch       # Watch mode
pnpm test:ui          # Vitest UI
pnpm test:coverage    # Coverage report
```

### Building

```bash
pnpm build            # Build for production
pnpm typecheck        # Type checking
pnpm lint             # ESLint
pnpm dev              # Watch mode (TypeScript)
```

## Styling

Components use **Tailwind CSS v4**. Ensure your project includes:

```css
@import "tailwindcss";
```

Configure `tailwind.config.ts`:
```typescript
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {},
  },
}
```

## Accessibility

All components are built with accessibility in mind:
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus management
- Colour contrast compliance (WCAG 2.1 AA)
- Screen reader optimised

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Requires ES2022+

## Adding New Components

1. Create component in `src/components/ComponentName/`
2. Export from `src/index.ts`
3. Create Storybook stories (`.stories.tsx`)
4. Add comprehensive tests (`.test.tsx`)
5. Ensure WCAG 2.1 AA compliance
6. Update this README
7. Run `pnpm build` and verify Storybook

## Contributing

When contributing new components or improvements:
- Follow existing code patterns
- Maintain TypeScript strict mode compliance
- Include comprehensive JSDoc comments
- Write Storybook stories for all variants
- Add unit and integration tests
- Use British spelling throughout
- Test accessibility with keyboard and screen readers

## Related Packages

- `@pragmatic/hooks` - Custom React hooks
- `@pragmatic/types` - Shared TypeScript types
- `@pragmatic/constants` - Shared constants
- `@pragmatic/eslint-config` - Shared ESLint config
- `@pragmatic/tsconfig` - Shared TypeScript config

## Documentation

- [Pragmatic Toolkit Guide](.ai/pragmatic-toolkit.md) - Complete toolkit overview
- [Developer Guide](../../docs/TOOLKIT_GUIDE.md) - How to choose and use toolkit packages

## License

Internal Pragmatic Digital package
