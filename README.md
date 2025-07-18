# Svelte Expert Profiles Library

A Svelte component library and demo app for building expert profile pages with advanced timeline and property portfolio features. Powered by [`sv`](https://npmjs.com/package/sv), SvelteKit, and Tailwind CSS.

## Features

- **Expert Profiles**: Rich consultant/expert profiles with bio, contact info, testimonials, case studies, and more.
- **Timeline**: Chronological feed of posts (property updates, insights, deal announcements) with support for post types, sentiment, property attachments, media, reactions, and comments.
- **Properties Portfolio**: Visual property cards, portfolio metrics, advanced filtering, search, and sorting.
- **Tabbed Interface**: Switch between Timeline and Properties views.
- **Authentication**: Login and registration flows (with Strapi backend integration).
- **Mock Data**: Realistic mock data for development and testing.
- **Responsive Design**: Mobile and desktop friendly, dark mode support.
- **Demo App**: Showcase and preview the library’s features.

## Getting Started

### 1. Create a Project

If you haven’t already:

```bash
npx sv create my-app
cd my-app
npm install
```

### 2. Development

Start the development server:

```bash
npm run dev
# or
npm run dev -- --open
```

### 3. Building

To build your library:

```bash
npm run package
```

To build the demo app:

```bash
npm run build
npm run preview
```

### 4. Publishing

Edit `package.json` to set your package name and license. Then:

```bash
npm publish
```

## Directory Structure

```
src/
  lib/           # Library code (types, stores, mock data, auth, server endpoints)
    stores/      # Svelte stores (auth, etc.)
    server/      # Server-side endpoints (consultants, properties, timeline)
  components/    # Reusable Svelte components (Timeline, Properties, ProfileTabs, etc.)
  routes/        # Demo/showcase app routes
    timeline-demo/  # Timeline & Properties demo page
    experts/        # Expert profile pages
    signup/         # Signup page
    login/          # Login page
static/         # Static assets (images, etc.)
```

## Key Components

- `Timeline.svelte` / `TimelinePost.svelte`: Timeline feed and post display.
- `Properties.svelte`: Property portfolio grid with metrics, filters, and search.
- `ProfileTabs.svelte`: Tab navigation between Timeline and Properties.
- `ExpertProfile.svelte`: Full expert profile with all sections.
- `GeneralTimeline.svelte`: Infinite scrolling timeline demo.

## Data Models

See [`src/lib/types.ts`](src/lib/types.ts) for full TypeScript interfaces.

### TimelinePost

```typescript
interface TimelinePost {
  post_id: string;
  person_id: string;
  created_at: string;
  body_md: string;
  media_urls: string[];
  property_uid?: string;
  post_type: 'NewListing' | 'ProgressUpdate' | 'Closing' | 'Insight' | 'Generic';
  sentiment: 'Bull' | 'Bear' | 'Neutral';
  visibility: 'Public' | 'Connections' | 'Private';
  reactions?: TimelineReaction[];
  comments?: TimelineComment[];
}
```

### Property

```typescript
interface Property {
  property_uid: string;
  title: string;
  address: string;
  property_type: string;
  status: 'Under Construction' | 'Stabilised' | 'Exited' | 'Planning';
  headline_metric?: string;
  images: string[];
  roles: string[];
  deal_size?: number;
  irr?: number;
  completion_percentage?: number;
}
```

## Demo

Visit [`/timeline-demo`](src/routes/timeline-demo/+page.svelte) in the running app to see a working example of the Timeline and Properties features.

## Authentication

- Auth logic is in [`src/lib/auth.ts`](src/lib/auth.ts) and [`src/lib/stores/authStore.ts`](src/lib/stores/authStore.ts).
- Integrates with a Strapi backend (see `VITE_STRAPI_URL`).
- Includes login, registration, and persistent auth state.

## Testing

- Unit tests: `npm run test:unit`
- E2E tests: `npm run test:e2e`
- Uses Vitest and Playwright.

## Styling

- Tailwind CSS for utility-first styling.
- Dark mode and responsive layouts.

## Further Reading

- [Timeline & Properties Implementation Details](TIMELINE_IMPLEMENTATION.md)
- [SvelteKit Packaging Docs](https://svelte.dev/docs/kit/packaging)

## Contributing

1. Fork the repo and create your branch.
2. Make your changes and add tests.
3. Run `npm run lint` and `npm run test`.
4. Submit a pull request!
