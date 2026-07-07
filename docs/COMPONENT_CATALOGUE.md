# Pragmatic Digital — Component & Utility Catalogue

A comprehensive reference of reusable components and utilities planned for the Pragmatic Digital Toolkit. This document serves as a planning guide for implementation across packages.

---

## Table of Contents

1. [Frontend Components (@pragmatic/ui)](#frontend-components-pragmaticui)
2. [Frontend Hooks (@pragmatic/hooks)](#frontend-hooks-pragmatichooks)
3. [Node.js Utilities](#nodejs-utilities)
4. [PHP Utilities](#php-utilities)

---

## Frontend Components (@pragmatic/ui)

React components for common marketing, content, and application patterns. All components are TypeScript, accessible, and optimised for performance.

### Layout & Structure

#### **StickyHeader**
Header that transitions between states based on scroll position.
- **Use Case**: Marketing sites, documentation, app navigation
- **Features**:
  - Configurable scroll distance before transition
  - Transitions between transparent and solid backgrounds
  - Changes size/layout on scroll (e.g., large hero to compact)
  - Configurable breakpoints for mobile
  - Animation variants
- **Props**: `scrollThreshold`, `variants`, `breakpoints`, `isTransparent`

#### **PageSection**
Semantic section wrapper with built-in spacing and backgrounds.
- **Use Case**: Marketing page sections, content areas
- **Features**:
  - Consistent padding/margins
  - Background variants (solid, gradient, image)
  - Intersection observer hooks for scroll animations
  - Full-width/constrained width options
  - Bleed variants for backgrounds
- **Props**: `variant`, `background`, `padding`, `fullWidth`, `onIntersect`

#### **Hero**
Large impactful page header with background options and CTA.
- **Use Case**: Landing pages, campaign pages, section introductions
- **Features**:
  - Background image, video, gradient, or solid colour
  - Overlay with opacity control
  - Centered, left-aligned, or right-aligned layouts
  - Heading, subheading, description, multiple CTAs
  - Text alignment and size variants
  - Mobile-optimised backgrounds
- **Props**: `background`, `overlay`, `layout`, `title`, `subtitle`, `buttons`

#### **Grid**
CSS Grid wrapper with common responsive patterns.
- **Use Case**: Feature grids, product grids, gallery layouts
- **Features**:
  - `auto-fit`, `auto-fill`, masonry-style layouts
  - Responsive column counts
  - Custom gap/spacing
  - Matches design system breakpoints
- **Props**: `columns`, `gap`, `variant`, `autoFlow`

#### **Container**
Max-width container with consistent padding and responsive sizing.
- **Use Case**: Constraining content width, consistent horizontal padding
- **Features**:
  - Configurable max-width
  - Responsive padding
  - Full-width bleed variants
  - Center/left-align options
- **Props**: `maxWidth`, `padding`, `align`

---

### Hero & Marketing

#### **CallToAction**
CTA section combining heading, description, and action button(s).
- **Use Case**: End of sections, promotional areas
- **Features**:
  - Background image, video, or colour
  - Multiple CTA buttons
  - Text alignment options
  - Overlay for image/video backgrounds
  - Content positioning (left, right, center)
- **Props**: `background`, `title`, `description`, `buttons`, `alignment`

#### **FeatureGrid**
Grid of feature cards with icon/image, heading, and description.
- **Use Case**: Highlighting product features, services, benefits
- **Features**:
  - Icon or image per feature
  - 2-4 column responsive layout
  - Optional feature highlights/badges
  - Heading and description per feature
- **Props**: `features`, `columns`, `layout`

#### **Testimonial**
Quote display with author details.
- **Use Case**: Social proof, case studies, reviews
- **Features**:
  - Quote text
  - Author photo, name, company
  - Rating/stars support
  - Variants (single, highlighted, compact)
  - Carousel support
- **Props**: `quote`, `author`, `company`, `image`, `rating`

#### **LogoGrid**
Client/partner logos with optional links.
- **Use Case**: Client listings, partner sections, integrations
- **Features**:
  - Responsive grid layout
  - Grayscale with hover effect
  - Optional links to partners
  - Consistent height/aspect ratio
- **Props**: `logos`, `columns`, `maxHeight`, `showLinks`

#### **Pricing**
Pricing table or card layout for service tiers.
- **Use Case**: Pricing pages, service comparison
- **Features**:
  - Table or card variants
  - Highlight featured tier
  - Feature lists per tier
  - CTA buttons per tier
  - Currency and billing period display
- **Props**: `tiers`, `featured`, `currency`, `billingPeriod`

---

### Content & Media

#### **ImageText**
Side-by-side image and text layout.
- **Use Case**: About sections, process steps, feature explanations
- **Features**:
  - Left/right image positioning
  - Stacked layout on mobile
  - Optional overline, heading, description, CTA
  - Image aspect ratio control
  - Text alignment options
- **Props**: `image`, `title`, `description`, `layout`, `imagePosition`

#### **Carousel**
Content carousel/slider with autoplay, navigation, and touch support.
- **Use Case**: Image galleries, testimonials, feature showcases
- **Features**:
  - Auto-play with configurable interval
  - Previous/next arrows
  - Dot indicators
  - Touch/swipe support
  - Keyboard navigation
  - Fade or slide transitions
  - Responsive height
- **Props**: `items`, `autoPlay`, `interval`, `transition`, `showDots`, `showArrows`

#### **Card**
Generic content card with image, heading, excerpt, and link.
- **Use Case**: Blog posts, team members, portfolio items
- **Features**:
  - Image with lazy loading
  - Heading and excerpt
  - Optional badge/tag
  - Hover effects
  - Footer action (link/button)
- **Props**: `image`, `title`, `excerpt`, `badge`, `link`

#### **ResponsiveImage**
Image with automatic srcset, sizes, lazy loading, and CMS integration.
- **Use Case**: All image display throughout app
- **Features**:
  - Automatic srcset generation
  - Lazy loading with placeholder blur-up
  - CMS image service integration (Imgix, Cloudinary, Craft transforms)
  - Aspect ratio control
  - LQIP (low quality image placeholder)
  - Error handling with fallback
- **Props**: `src`, `alt`, `sizes`, `priority`, `cmsService`, `aspectRatio`

#### **VideoEmbed**
YouTube/Vimeo embed with responsive aspect ratio and privacy mode.
- **Use Case**: Embedded videos, tutorials, testimonial videos
- **Features**:
  - YouTube and Vimeo support
  - Responsive container (16:9, 4:3, etc.)
  - Play button overlay
  - Privacy-enhanced mode (no cookie until play)
  - Autoplay support
  - Full-screen support
- **Props**: `videoId`, `provider`, `aspectRatio`, `privacy`, `autoplay`

#### **ImageGallery**
Gallery with lightbox, thumbnails, and zoom.
- **Use Case**: Product galleries, portfolio, before/after
- **Features**:
  - Main image with thumbnail grid
  - Lightbox on click
  - Zoom on hover
  - Keyboard navigation (arrow keys)
  - Touch swipe support
  - Lazy loading
  - CMS image service integration
- **Props**: `images`, `thumbnails`, `zoom`, `lightbox`

#### **CMSImage**
Image component with automatic Craft/WordPress field handling.
- **Use Case**: Rendering CMS image fields directly
- **Features**:
  - Automatic field type detection
  - Transform API integration
  - Focal point support
  - Multiple image variants
  - CMS-specific metadata
- **Props**: `field`, `transforms`, `focalPoint`

#### **CMSLink**
Link component handling internal/external links and CMS entry links.
- **Use Case**: Rendering CMS link fields
- **Features**:
  - Internal/external link detection
  - CMS entry link resolution
  - Tel/mailto link support
  - Consistent link styling
  - Automatic target/_blank for external
- **Props**: `field`, `className`

---

### Forms & Inputs

#### **FormField**
Wrapper combining label, input, error message, and help text.
- **Use Case**: Any form field
- **Features**:
  - Consistent spacing and styling
  - Error message display
  - Help/hint text
  - Required indicator
  - Accessibility attributes (aria-describedby, etc.)
- **Props**: `label`, `error`, `hint`, `required`, `children`

#### **FileUpload**
Drag-and-drop file upload with preview and progress.
- **Use Case**: Document uploads, image uploads, media management
- **Features**:
  - Drag-and-drop zone
  - File type validation
  - File size validation
  - Progress indicator during upload
  - File preview (images, documents)
  - Direct-to-S3/Cloudflare upload support
  - Error handling and retry
- **Props**: `accept`, `maxSize`, `onUpload`, `preview`, `multiple`

#### **RichTextEditor**
Configured TipTap/Slate wrapper with standardised toolbar.
- **Use Case**: CMS content editing, user-generated content
- **Features**:
  - Standardised toolbar (bold, italic, link, heading, list, etc.)
  - Paste handling and link auto-detection
  - CMS integration patterns
  - HTML output validation
  - Configurable features
- **Props**: `value`, `onChange`, `toolbar`, `onBlur`

#### **DateRangePicker**
Date range selection with presets.
- **Use Case**: Analytics dashboards, reporting, filtering
- **Features**:
  - Date range selection
  - Presets ("Last 7 days", "This month", "Custom")
  - Configurable date format
  - Keyboard navigation
  - Mobile-optimised date picker
- **Props**: `value`, `onChange`, `presets`, `format`

#### **SearchInput**
Debounced search input with results and keyboard navigation.
- **Use Case**: Search bars, filters, product search
- **Features**:
  - Debounced input (configurable)
  - Loading state while searching
  - Recent searches cache (localStorage)
  - Keyboard navigation (arrow keys, enter)
  - Clear button
  - Dropdown result display
- **Props**: `onSearch`, `debounce`, `showRecent`, `results`

---

### Data Display

#### **DataTable**
Table with sorting, filtering, pagination, and CSV export.
- **Use Case**: Admin panels, dashboards, data listings
- **Features**:
  - Column sorting (ASC/DESC)
  - Row filtering
  - Server-side or client-side pagination
  - Row selection with bulk actions
  - CSV/Excel export
  - Responsive horizontal scroll on mobile
  - Loading states
- **Props**: `columns`, `data`, `sortable`, `filterable`, `paginated`, `onExport`

#### **InfiniteScroll**
List/grid with intersection observer-based infinite loading.
- **Use Case**: Blog posts, search results, feed-style content
- **Features**:
  - Intersection observer for load trigger
  - Configurable load threshold
  - Skeleton/placeholder states during load
  - End-of-list indicator
  - Error handling and retry
  - Manual retry button
- **Props**: `items`, `onLoadMore`, `hasMore`, `isLoading`, `loadThreshold`

#### **StatCard**
Dashboard metric card with trend indicator and sparkline.
- **Use Case**: KPI display, dashboard metrics, analytics
- **Features**:
  - Value display (large, prominent)
  - Trend indicator (↑/↓ with percentage)
  - Sparkline/mini-chart option
  - Period comparison (vs. last month, etc.)
  - Icon or colour-coded status
  - Loading state
- **Props**: `value`, `trend`, `title`, `sparkline`, `comparison`, `icon`

#### **Timeline**
Vertical or horizontal timeline for events/milestones.
- **Use Case**: Activity feeds, order tracking, project milestones, history
- **Features**:
  - Vertical and horizontal variants
  - Timeline items with date, title, description
  - Icons per event
  - Connector lines
  - Responsive layout
  - Optional highlighting of current/active item
- **Props**: `items`, `orientation`, `highlightIndex`, `icons`

#### **Pagination**
Pagination controls with page size selector.
- **Use Case**: Data table pagination, search results navigation
- **Features**:
  - Previous/next buttons
  - Page number links
  - Page size selector
  - Jump to page input
  - Mobile compact view
  - Ellipsis for large page counts
- **Props**: `currentPage`, `totalPages`, `onPageChange`, `pageSize`, `onPageSizeChange`

#### **ProgressBar**
Multi-step progress indicator.
- **Use Case**: Checkout flows, onboarding, form wizards
- **Features**:
  - Multi-step display
  - Completed/active/pending states
  - Labels per step
  - Configurable display (dots, bars, numbers)
  - Optional step descriptions
  - Mobile-responsive
- **Props**: `steps`, `current`, `labels`, `variant`

#### **Breadcrumbs**
Breadcrumb navigation with schema.org markup.
- **Use Case**: Navigation hierarchy, location indication
- **Features**:
  - Dynamic breadcrumb generation
  - Schema.org BreadcrumbList markup
  - Truncation for long paths
  - Auto-generation from router (optional)
  - Customisable separators
- **Props**: `items`, `auto`, `maxItems`

#### **Tabs**
Accessible tab interface with URL syncing.
- **Use Case**: Content organisation, settings pages
- **Features**:
  - Multiple open/single open modes
  - Controlled/uncontrolled modes
  - URL hash syncing (tab state persists on refresh)
  - Lazy loading of tab content
  - Responsive mobile drawer variant
  - Keyboard navigation (arrow keys, home/end)
- **Props**: `tabs`, `active`, `onChange`, `lazy`, `urlSync`

#### **Accordion**
Expandable/collapsible accordion sections.
- **Use Case**: FAQs, content organisation, filters
- **Features**:
  - Single/multiple open sections
  - Controlled/uncontrolled modes
  - Animation on expand/collapse
  - Keyboard navigation
  - Optional count badge per section
- **Props**: `sections`, `allowMultiple`, `animated`

---

### UI Patterns

#### **Modal**
Accessible modal/dialog with focus trap and scroll lock.
- **Use Case**: Confirmations, forms, alerts
- **Features**:
  - Focus trap (keyboard navigation stays within modal)
  - Body scroll lock with position restoration
  - Nested modal support
  - Backdrop click dismissal (optional)
  - Animation variants (fade, scale, etc.)
  - Close button
  - Header, body, footer sections
- **Props**: `isOpen`, `onClose`, `title`, `children`, `size`, `animated`

#### **Toast/Notification**
Toast notification system with queue management.
- **Use Case**: Feedback messages, confirmations, errors
- **Features**:
  - Toast queue (max 3 visible)
  - Position variants (top-left, top-right, bottom-left, bottom-right)
  - Duration auto-dismiss
  - Manual dismiss button
  - Success/error/warning/info variants
  - Optional action button
  - Animation on enter/exit
- **Props**: `message`, `type`, `duration`, `action`, `position`

#### **Newsletter**
Email signup form with validation and service integration.
- **Use Case**: Email capture, newsletter signups
- **Features**:
  - Email input with validation
  - Mailchimp, ConvertKit, email service integration
  - Success/error messaging
  - Loading state
  - GDPR compliance checkbox (optional)
  - Double opt-in support
  - Honeypot field for spam prevention
- **Props**: `service`, `onSubscribe`, `gdpr`

---

### E-commerce Specific

#### **ProductCard**
Product card with image, price, badges, and quick view.
- **Use Case**: Product listings, grid displays
- **Features**:
  - Product image with lazy loading
  - Price display (including sale/discount)
  - Badges (New, Sale, Limited)
  - Quick view button
  - Add to cart button with loading state
  - Rating/review count
  - Stock status indicator
- **Props**: `product`, `onQuickView`, `onAddToCart`

#### **PriceDisplay**
Price formatter handling multiple currencies and taxes.
- **Use Case**: Price display across app
- **Features**:
  - Multi-currency support with exchange rates
  - Tax inclusive/exclusive display
  - Discount/original price display
  - Locale-aware formatting (£, $, €, etc.)
  - Subscriptions pricing (per month, etc.)
  - Sale price highlighting
- **Props**: `amount`, `currency`, `tax`, `discount`, `locale`

#### **QuantitySelector**
Quantity input with +/- buttons and validation.
- **Use Case**: Product pages, shopping cart
- **Features**:
  - Plus/minus buttons
  - Direct text input
  - Min/max validation
  - Out of stock handling
  - Loading state
  - Keyboard support
- **Props**: `value`, `onChange`, `min`, `max`, `disabled`

#### **CartSummary**
Order summary displaying line items, totals, and taxes.
- **Use Case**: Cart page, checkout summary
- **Features**:
  - Line item listing with images
  - Subtotal calculation
  - Discount code display
  - Shipping costs
  - Tax breakdown
  - Total amount
  - Editable quantity per item
  - Remove item action
- **Props**: `items`, `subtotal`, `discount`, `shipping`, `tax`, `total`

---

## Frontend Hooks (@pragmatic/hooks)

Reusable React hooks for common patterns and API integration.

### Data Fetching & State

#### **useApi**
Wrapper around http-client with loading/error states and request deduplication.
- **Use Case**: Fetching data from APIs
- **Features**:
  - Loading, error, and success states
  - Request deduplication (prevents duplicate requests)
  - Automatic retry on failure
  - Cache invalidation patterns
  - Typed responses with TypeScript
  - Abort on unmount
- **Usage**: `const { data, loading, error, refetch } = useApi('/api/users')`

#### **useInfiniteQuery**
Infinite scroll data fetching with cursor/offset pagination.
- **Use Case**: Infinite scrolling lists, feeds
- **Features**:
  - Cursor-based or offset-based pagination
  - Automatic load more triggering
  - Refetch and reset logic
  - Optimistic updates
  - Error handling
- **Usage**: `const { items, hasMore, loadMore } = useInfiniteQuery('/api/posts')`

#### **useDebouncedValue**
Debounced value with configurable delay.
- **Use Case**: Search inputs, real-time filtering
- **Features**:
  - Configurable debounce delay (default 300ms)
  - Leading/trailing edge options
  - Immediate value for UI, debounced for effects
- **Usage**: `const debouncedSearch = useDebouncedValue(search, 500)`

#### **useLocalStorage/useSessionStorage**
Persisted state with SSR handling and cross-tab sync.
- **Use Case**: Persisting preferences, saved state
- **Features**:
  - Automatic serialisation/deserialisation
  - SSR-safe (no hydration errors)
  - Cross-tab synchronisation
  - Optional encryption for sensitive data
  - Initial value support
- **Usage**: `const [theme, setTheme] = useLocalStorage('theme', 'light')`

#### **useForm**
Form state management with validation and dirty tracking.
- **Use Case**: Form handling
- **Features**:
  - Field value tracking
  - Validation with error messages
  - Dirty flag (has form changed?)
  - Reset to initial state
  - Submission handling
  - Async validation support
- **Usage**: `const { values, errors, submit } = useForm({ onSubmit })`

---

### UI & Interaction

#### **useMediaQuery**
Responsive breakpoint detection with SSR support.
- **Use Case**: Responsive behaviour, responsive rendering
- **Features**:
  - Media query matching
  - SSR-safe (matches on server and client)
  - Configurable breakpoints matching design system
  - Re-render on breakpoint change
- **Usage**: `const isMobile = useMediaQuery('(max-width: 768px)')`

#### **useIntersectionObserver**
Intersection observer for lazy loading and scroll animations.
- **Use Case**: Lazy loading, scroll-triggered animations
- **Features**:
  - Configurable visibility threshold
  - Once or repeated intersection
  - Margin/offset configuration
  - Cleanup on unmount
- **Usage**: `const { isVisible, ref } = useIntersectionObserver()`

#### **useClickOutside**
Detect clicks outside an element.
- **Use Case**: Dropdowns, modals, popovers
- **Features**:
  - Excludes nested elements from detection
  - Configurable event type (click, touch)
  - Ref-based element targeting
- **Usage**: `const { ref, isClickedOutside } = useClickOutside()`

#### **useKeyPress**
Keyboard event handling with modifier key support.
- **Use Case**: Keyboard shortcuts, accessibility
- **Features**:
  - Single key or key combinations (Cmd+K, Shift+Enter)
  - Configurable targets (window, input, document)
  - Handler function on key press
- **Usage**: `useKeyPress('Escape', handleClose)`

#### **useFocusTrap**
Focus trap for modals and dialogues.
- **Use Case**: Modal focus management, accessibility
- **Features**:
  - Traps focus within element
  - Return focus on unmount
  - Tab/Shift+Tab navigation
  - Escape key support
- **Usage**: `const ref = useFocusTrap()`

#### **useScrollLock**
Body scroll locking for modals with position restoration.
- **Use Case**: Modal backgrounds, preventing scroll
- **Features**:
  - Lock/unlock body scrolling
  - Restore scroll position on unlock
  - iOS Safari handling
  - Padding restoration for scrollbar gap
- **Usage**: `useScrollLock(isModalOpen)`

#### **usePrevious**
Track previous value of state/prop.
- **Use Case**: Comparing values, detecting changes
- **Features**:
  - Returns previous value on each render
  - Handles first render (returns undefined)
- **Usage**: `const prevValue = usePrevious(value)`

---

### Performance & Optimisation

#### **useImagePreload**
Preload images with priority and completion tracking.
- **Use Case**: Image galleries, carousels
- **Features**:
  - Batch image preloading
  - Priority-based loading
  - Progress tracking
  - Completion callback
- **Usage**: `const { loaded, progress } = useImagePreload(imageUrls)`

#### **useIdleCallback**
Execute non-critical tasks during browser idle time.
- **Use Case**: Analytics, prefetching, cleanup
- **Features**:
  - Runs during browser idle
  - Timeout if idle never occurs
  - Cleanup on unmount
- **Usage**: `useIdleCallback(() => trackAnalytics())`

#### **usePageVisibility**
Track when page is visible/hidden.
- **Use Case**: Pause videos/animations when tab hidden, background tasks
- **Features**:
  - Visibility state tracking
  - Change callback
- **Usage**: `const isVisible = usePageVisibility()`

#### **usePrefetch**
Prefetch data on hover/focus for optimistic navigation.
- **Use Case**: Link hover prefetching, menu expansion
- **Features**:
  - Prefetch on mouse enter/focus
  - Cancel on mouse leave
  - Optional request deduplication
- **Usage**: `usePrefetch('/api/user', { trigger: 'hover' })`

---

### CMS & Content

#### **useCMSPreview**
Handle CMS preview mode, draft content, and live refresh.
- **Use Case**: CMS editorial workflow, preview mode
- **Features**:
  - Preview token handling
  - Draft/published content switching
  - Live refresh on content save
  - Preview mode indicator
- **Usage**: `const { isPreview, content, refresh } = useCMSPreview()`

#### **useContentBlocks**
Map CMS matrix/flexible content fields to React components.
- **Use Case**: Rendering CMS flexible content
- **Features**:
  - Type-safe component mapping
  - Automatic layout handling
  - Preview mode support
- **Usage**: `const blocks = useContentBlocks(cmsField, componentMap)`

#### **useEntry**
Fetch and cache CMS entry with relationships and transforms.
- **Use Case**: Fetching single CMS entries
- **Features**:
  - Entry fetching with caching
  - Relationship loading
  - Asset transform support
  - Locale switching
- **Usage**: `const { entry, loading } = useEntry(id, { locale })`

---

### Forms & Validation

#### **useFieldValidation**
Single field validation with async support.
- **Use Case**: Real-time field validation
- **Features**:
  - Sync and async validation
  - Error message display
  - Validate on change/blur
  - Check availability (username, email)
- **Usage**: `const { error, validate } = useFieldValidation(value, validationFn)`

#### **useFileUpload**
File upload state management with progress.
- **Use Case**: File upload handling
- **Features**:
  - Upload progress tracking
  - Error handling
  - Direct-to-S3 patterns
  - File metadata extraction
- **Usage**: `const { upload, progress, error } = useFileUpload()`

#### **useFormPersistence**
Auto-save form state to localStorage with expiry.
- **Use Case**: Form recovery, unsaved work preservation
- **Features**:
  - Auto-save form state
  - Recovery on page reload
  - Expiry (default 24 hours)
  - Manual clear
- **Usage**: `useFormPersistence('formName', formState)`

---

### E-commerce

#### **useCart**
Shopping cart state with persistence and backend sync.
- **Use Case**: Shopping cart management
- **Features**:
  - Add/remove/update items
  - Persistence (localStorage)
  - Backend synchronisation
  - Quantity limits
  - Stock checking
- **Usage**: `const { items, addItem, removeItem } = useCart()`

#### **useCheckout**
Multi-step checkout state management with validation.
- **Use Case**: Checkout flow
- **Features**:
  - Step navigation (shipping, payment, etc.)
  - Form validation per step
  - Payment integration hooks
  - Order submission
- **Usage**: `const { step, nextStep, submitOrder } = useCheckout()`

#### **useProductVariants**
Product variant selection logic with stock checking.
- **Use Case**: Product variant selection
- **Features**:
  - Variant availability based on selections
  - Price updates
  - Stock checking
  - Image variation
- **Usage**: `const { selectedVariant, price } = useProductVariants(product)`

---

### Analytics & Tracking

#### **useAnalytics**
Track page views and events with provider abstraction.
- **Use Case**: Analytics integration
- **Features**:
  - Provider-agnostic (GA4, Plausible, Segment)
  - Track page views, events, user properties
  - Debug mode for development
- **Usage**: `const analytics = useAnalytics(); analytics.track('click', { id })`

#### **useScrollDepth**
Track scroll depth milestones for content engagement.
- **Use Case**: Content engagement tracking
- **Features**:
  - Track milestones (25%, 50%, 75%, 100%)
  - Automatic send to analytics
- **Usage**: `useScrollDepth({ provider: 'ga4' })`

#### **useTimeOnPage**
Track active time on page (excluding inactive tabs).
- **Use Case**: Engagement metrics
- **Features**:
  - Only count active time
  - Page visibility handling
  - Send to analytics on unload
- **Usage**: `useTimeOnPage({ provider: 'ga4' })`

---

### Utilities

#### **useCopyToClipboard**
Copy text with success feedback and fallback.
- **Use Case**: Copy buttons, code snippets
- **Features**:
  - Copy to clipboard
  - Success feedback
  - Fallback for older browsers
  - Timeout handling
- **Usage**: `const { copy, copied } = useCopyToClipboard(text)`

#### **useCountdown**
Countdown timer for flash sales, limited offers.
- **Use Case**: Time-limited offers, deadlines
- **Features**:
  - Configurable start time
  - Formatted time display
  - Completion callback
  - Pause/resume
- **Usage**: `const { timeLeft, isComplete } = useCountdown(endDate)`

#### **useGeolocation**
User location with permission handling.
- **Use Case**: Store locators, delivery area checking
- **Features**:
  - Request location permission
  - Get current coordinates
  - Watch position changes
  - Error handling
- **Usage**: `const { location, loading, error } = useGeolocation()`

#### **useCurrency**
Format currency values with locale and tax calculations.
- **Use Case**: Price display, formatting
- **Features**:
  - Locale-aware formatting
  - Multiple currencies
  - Tax calculations
  - Exchange rates
- **Usage**: `const formatted = useCurrency(1000, 'GBP')`

---

## Node.js Utilities

Backend utilities for API integration, logging, and data management.

### @pragmatic/logger

Structured logging with context propagation, performance tracking, and sensitive data redaction.

#### Core Features

- **Structured JSON Output** - Consistent schema: timestamp, level, message, context, trace_id
- **Log Levels** - debug, info, warn, error, fatal with environment-based defaults
- **Request Correlation** - Auto-generate and propagate trace_id through distributed systems
- **Context Propagation** - Request-scoped context (user_id, session_id, request_id) using AsyncLocalStorage
- **Child Loggers** - Create child loggers with inherited context

#### Advanced Capabilities

- **Sensitive Data Redaction** - Auto-redact passwords, tokens, credit card numbers with configurable patterns
- **Performance Logging** - Duration tracking for database queries, API calls, with slow query warnings
- **Error Context** - Capture stack traces, error causes, contextual data
- **Transport Abstraction** - Console, file, syslog, Datadog, Loggly, CloudWatch
- **Log Rotation** - File rotation by size/date with compression and retention
- **Sampling** - Sample high-volume debug logs to reduce noise
- **Development Mode** - Pretty-printed, colourised output with source maps

#### Use Cases

- **API Request Logging** - Standardised HTTP request/response logging with duration, status, size
- **Database Query Logging** - Log queries with execution time, rows affected, slow query threshold
- **Background Job Logging** - Job lifecycle (queued, started, completed, failed) with retry context
- **Audit Logging** - Compliance-focused logging for GDPR, data access, admin actions

#### Integration Examples

```typescript
// Request scoped logging
const logger = createLogger();
logger.setContext({ userId: user.id, requestId });

// Performance tracking
const { duration } = await logger.time('db-query', () => db.query(...));

// Sensitive data redaction
logger.info('User login', { password: '***', token: '***' });
```

---

### @pragmatic/http-client

HTTP client with retry logic, token management, rate limit handling, and API pattern support.

#### Core Functionality

- **Request/Response Interceptors** - Global auth, error handling, response transformation
- **Retry Logic** - Exponential backoff, jitter, idempotency key support
- **Timeout Handling** - Different limits for different endpoint types
- **Request Cancellation** - AbortController integration for cleanup
- **Request Deduplication** - Prevent duplicate in-flight requests

#### Authentication & Security

- **Token Management** - Auto token refresh, storage, retry failed requests after refresh
- **API Key Rotation** - Rotate API keys with graceful fallback
- **Request Signing** - HMAC request signing for webhook verification
- **Rate Limit Handling** - Auto-detect 429 responses with queuing and retry

#### Error Handling

- **Typed Errors** - NetworkError, ValidationError, AuthError classes
- **Error Recovery** - Retry, fallback, circuit breaker strategies
- **Error Context** - Request/response details, correlation IDs

#### Performance & Caching

- **Response Caching** - HTTP cache with ETag, Cache-Control support
- **Connection Pooling** - HTTP/2 with connection reuse
- **Compression** - Automatic gzip/brotli
- **Request Deduplication** - Prevent duplicate in-flight requests

#### API Patterns

- **GraphQL Client** - Query/mutation execution with fragments, cache
- **Webhook Receiver** - Webhook verification and processing (Stripe, Shopify patterns)
- **Multipart Upload** - Chunked file uploads with progress and resume
- **Server-Sent Events** - Real-time updates (CMS live preview, notifications)

#### Integration Helpers

- **CMS API Clients** - Preconfigured for Craft, WordPress REST API, Shopify
- **Payment Gateway Clients** - Stripe, PayPal with webhook handling
- **Email Service Clients** - SendGrid, Mailgun, Postmark
- **Media Service Clients** - Cloudinary, Imgix API integration

#### Usage Example

```typescript
const client = new HttpClient({
  baseURL: 'https://api.example.com',
  timeout: 30000,
  retryConfig: { maxRetries: 3, backoffMultiplier: 2 }
});

const { data } = await client.get('/users');
```

---

## PHP Utilities

Reusable PHP utilities across all frameworks and framework-specific helpers.

### pragmatic/php-support

Framework-agnostic PHP utilities for common business logic and data handling.

#### Data Handling

- **Money Value Object** - Currency-aware money handling with arithmetic, formatting (avoids float precision)
- **Percentage Calculator** - Tax, discount, markup calculations with rounding strategies
- **Address Value Object** - Structured address with regional formatting (UK, US, etc.)
- **Phone Number** - International phone parsing, validation, formatting
- **Email Value Object** - Email validation with DNS checks, disposable detection

#### String & Text

- **Slug Generator** - URL-friendly slugs with transliteration, uniqueness checking
- **Excerpt Generator** - Smart truncation preserving whole words, HTML stripping
- **Template Renderer** - String template engine for emails, notifications
- **String Utilities** - Spelling conversion (British/American), title case, name formatting

#### Date & Time

- **Business Days Calculator** - Business days excluding holidays (UK bank holidays)
- **Date Range** - Date range value object with overlap detection, iteration
- **Timezone Converter** - International timezone conversion with DST handling

#### File & Media

- **File Size Formatter** - Format bytes to KB/MB/GB with British formatting
- **MIME Type Detector** - Content-based MIME type detection
- **Image Analyser** - Extract dimensions, orientation, colour profile
- **CSV Reader/Writer** - Robust CSV handling with encoding detection, Excel compatibility

#### Validation & Sanitisation

- **VAT Number Validator** - UK/EU VAT validation with optional VIES integration
- **Postcode Validator** - UK postcode validation and formatting
- **Bank Account Validator** - UK sort code and account validation
- **HTML Sanitiser** - Clean user-generated HTML with allowlist configuration

#### Collections & Arrays

- **Array Utilities** - Dot notation access, recursive merge, pluck, group operations
- **Collection Helpers** - Filter, map, reduce patterns with type safety
- **Sorting Utilities** - Natural sort, multi-column sort, locale-aware sorting

#### Security

- **CSRF Token Generator** - Generate and verify CSRF tokens
- **Password Strength Validator** - Configurable password strength checking
- **Rate Limiter** - In-memory/Redis rate limiting for APIs, login attempts

---

### pragmatic/laravel-support

Laravel-specific traits, service providers, and helpers for common patterns.

#### Eloquent Traits

- **Publishable Trait** - Published/draft status with scheduled publishing, archive
- **Orderable Trait** - Drag-and-drop ordering with position management
- **Translatable Trait** - Multi-language content with fallback logic
- **Versionable Trait** - Model versioning with revision history, rollback
- **SoftCascade Trait** - Cascade soft deletes to relationships

#### Query Scopes

- **Date Range Scopes** - "published between", "active during" filters
- **Search Scopes** - Full-text search with relevance weighting
- **Filtering Scopes** - Dynamic filtering from request query strings

#### Service Providers & Middleware

- **ViewComposerServiceProvider** - Global view composers (nav, footer, settings)
- **MacroServiceProvider** - Eloquent/Collection macros
- **ForceHttps Middleware** - Force HTTPS in production with trusted proxy
- **LogRouteAccess Middleware** - Audit trail for protected routes
- **MaintenanceMode Middleware** - Maintenance mode with IP allowlist

#### Artisan Commands

- **CleanupCommand** - Clean temporary files, sessions, logs
- **CacheWarmCommand** - Warm application cache
- **ImportCommand Base** - Abstract command for CSV/Excel imports

#### Form Requests & Validation

- **BaseFormRequest** - Common rules (UK postcode, VAT, phone)
- **SanitisesInput Trait** - Auto-sanitise on validation

#### API & Response Helpers

- **API Response Helpers** - Consistent JSON responses with pagination
- **Export Responses** - CSV/Excel download with proper headers, encoding

#### Jobs & Queues

- **ChunkedJob** - Process large datasets in chunks with progress
- **RetryableJob Trait** - Sophisticated retry logic with exponential backoff

---

### pragmatic/wordpress-support

WordPress/Bedrock utilities for custom post types, fields, REST API, and theme development.

#### Custom Post Types & Taxonomies

- **CPT Builder** - Fluent API for post type registration with sensible defaults
- **Taxonomy Builder** - Taxonomy registration with common configurations
- **Meta Box Builder** - Meta box registration without requiring ACF

#### ACF Helpers

- **ACF Field Groups** - Reusable configurations (SEO, social sharing, settings)
- **ACF Block Templates** - Gutenberg blocks (hero, features grid, testimonials)
- **Flexible Content Layouts** - Layouts matching React components

#### REST API

- **Custom Endpoints** - Register endpoints with auth, validation
- **Field Serialisers** - Transform ACF fields, meta to clean responses
- **CORS Handler** - Configure CORS for headless setups

#### Theme Utilities

- **Asset Manager** - Enqueue scripts/styles with versioning, async/defer, critical CSS
- **Menu Walker** - Custom nav walker with BEM classes, mega menu support
- **Breadcrumbs Generator** - Yoast-style breadcrumbs with schema markup

#### Admin Customisation

- **Admin Columns** - Add custom columns to post lists
- **Bulk Actions** - Register custom bulk actions
- **Dashboard Widgets** - Custom widgets for instructions, status

#### Media & Images

- **Image Size Manager** - Register sizes with descriptive names, regeneration
- **Focal Point** - Store and apply focal points for responsive images
- **SVG Support** - Safe SVG upload with sanitisation

#### Performance & Security

- **Query Monitor Integration** - Track custom queries, external API calls
- **Object Cache Helpers** - Redis/Memcached wrapper with fallback
- **Login Protection** - Rate limiting, IP blocking for failed logins
- **Content Security Policy** - CSP header configuration

#### E-commerce (WooCommerce)

- **Product Helpers** - Get formatted prices, stock status, variant info
- **Cart Utilities** - Cart manipulation for custom checkout flows
- **Order Utilities** - Extract data for reports, exports

---

### pragmatic/craft-support

Craft CMS field types, modules, services, and helpers for headless and traditional setups.

#### Element Queries & Optimization

- **Query Builder** - Fluent API for element queries with caching
- **Eager Loading Helpers** - Optimised patterns for matrix fields, relations

#### Field Types & Validators

- **Colour Picker** - Enhanced picker with brand colour swatches
- **Icon Picker** - Integrated with project icon system
- **Unit Field** - Values with units (e.g., "100px", "2rem")
- **Block Templates** - Reusable matrix block configurations
- **Block Validation** - Custom validation rules

#### Twig Extensions

- **Custom Filters** - format_price, excerpt, obfuscate_email
- **Custom Functions** - get_setting, get_nav, asset_version
- **Global Variables** - site_settings, current_user_permissions

#### Modules & Events

- **API Module** - GraphQL/REST endpoints for headless
- **Cache Module** - Cache tag management, purging strategies
- **Asset Module** - Transform presets, focal points, responsive images
- **Entry Save Events** - Sync to Algolia, cache clear, webhooks
- **User Registration** - Custom workflows, CRM integration

#### GraphQL

- **Custom Resolvers** - Computed fields, aggregated data
- **Query Complexity** - Limit complexity for public endpoints

#### Console Commands

- **Sync Command** - Sync entries between environments
- **Asset Optimisation** - Optimise images, generate transforms in bulk

#### Services

- **Navigation Service** - Complex navigation with depth limits, active state
- **SEO Service** - Meta tags, OG tags, schema.org markup
- **Sitemap Service** - Dynamic sitemap generation with priority

---

## Implementation Priorities

### Phase 1 (Foundation)
Focus on components and hooks that appear in every project:
- Hero, ImageText, Carousel components
- useApi, useMediaQuery, useLocalStorage hooks
- Basic logger and http-client foundation

### Phase 2 (Content)
Add components for content-heavy projects:
- DataTable, InfiniteScroll, StatCard
- ProductCard, CartSummary
- useCMSPreview, useEntry hooks

### Phase 3 (Advanced)
Specialised utilities and integrations:
- Advanced CMS integrations
- E-commerce specific helpers
- Payment gateway clients

### Phase 4 (Polish)
Refinement and optimisation:
- Performance improvements
- Additional CMS integrations
- Extended platform support

---

## Design System Alignment

All components follow these principles:
- **Accessibility**: WCAG 2.1 AA compliance, semantic HTML, ARIA attributes
- **Responsive**: Mobile-first, matches design system breakpoints
- **Performance**: Lazy loading, code splitting, optimised renders
- **Type Safety**: Full TypeScript support with strict mode
- **Customisation**: Composable, unstyled variants, CSS-in-JS support
- **Documentation**: Storybook stories, usage examples, edge cases

---

## Version Strategy

- **Independent Versioning**: Each package versions independently with Changesets
- **Semantic Versioning**: MAJOR.MINOR.PATCH following standard conventions
- **Breaking Changes**: Documented in changelog, migration guides provided
- **Deprecation Period**: Features deprecated for at least one minor version

---

## Next Steps

1. **Review this catalogue** for component selection and prioritisation
2. **Define design tokens** (colours, spacing, typography) for UI components
3. **Create Storybook stories** for each component during implementation
4. **Write comprehensive tests** for each utility
5. **Build integration examples** for common patterns
6. **Document edge cases** and browser compatibility

This catalogue serves as a living document—update as new patterns are discovered across projects.
