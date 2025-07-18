# Project Review: Svelte Expert Profiles Platform

## Overview

A SvelteKit-based platform for showcasing real estate experts, their profiles, timelines of activity, and property portfolios. Designed as both a reusable component library and a demo application, with a focus on modularity, mock data, and extensibility for real-world API integration.

---

## Architecture Diagram (Textual)

```
[Frontend (SvelteKit)]
   |
   |---> [Server Endpoints (src/lib/server/*.ts)]
   |         |-- fetches/mocks data from
   |         |
   |         v
   |    [Strapi Backend API] (optional, can use mock data)
   |
   |---> [Static Assets (public/static)]
   |
   |---> [Mock Data (src/lib/mockData.ts)]
```

---

## Component Map

| Component                  | Purpose/Props                                 | Parent(s)                    |
| -------------------------- | --------------------------------------------- | ---------------------------- |
| ExpertProfile.svelte       | Full expert profile, tabs, bio, contact, etc. | [documentId]/+page.svelte    |
| ProfileTabs.svelte         | Tab navigation (Timeline, Properties)         | ExpertProfile, timeline-demo |
| Timeline.svelte            | Timeline feed, post composer                  | ProfileTabs                  |
| TimelinePost.svelte        | Individual timeline post display              | Timeline, GeneralTimeline    |
| Properties.svelte          | Property portfolio grid, metrics, filters     | ProfileTabs                  |
| GeneralTimeline.svelte     | Infinite scrolling timeline demo              | timeline-demo                |
| ExpertSearchForm/Results   | Search/filter experts, display results        | experts/+page.svelte         |
| WorldMap, TagExplorer      | Visual exploration by geography/tags          | +page.svelte                 |
| KnowledgeCenter.svelte     | Article/insight display                       | +page.svelte                 |
| Header, Footer, Hero, etc. | Layout and navigation                         | App shell                    |

---

## API Contract Examples

### Consultant (GET /api/consultants)

```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Smith",
  "location": "New York, USA",
  "company": "Smith & Associates",
  "currentRole": "Senior Real Estate Consultant",
  ...
}
```

### TimelinePost (GET /api/timeline-items)

```json
{
  "post_id": "post_1",
  "person_id": "p_123",
  "created_at": "2024-01-15T10:30:00Z",
  "body_md": "Excited to bring **Dockside Industrial Park**...",
  "media_urls": ["https://..."],
  "property_uid": "pr_DE.ZH6XWP83",
  "post_type": "NewListing",
  "sentiment": "Bull",
  ...
}
```

### Property (GET /api/properties)

```json
{
  "property_uid": "pr_DE.ZH6XWP83",
  "title": "Dockside Industrial Park",
  "address": "45 Fenchurch St, London EC3",
  ...
}
```

---

## Known Limitations / Technical Debt

- All data is mock by default; real API integration is optional and not fully tested.
- Error handling is minimal in some UI flows.
- No pagination on expert search results.
- No real-time updates (WebSocket planned).
- No video or advanced media support in timeline.
- No notifications or analytics implemented.
- Accessibility and i18n are not fully audited.

---

## Deployment/Environment Notes

- Requires environment variables for Strapi integration:
  - `VITE_STRAPI_URL`
  - `VITE_STRAPI_TOKEN`
- Can run fully in mock/demo mode without backend.
- For production, ensure secure storage of tokens and HTTPS.

---

## Design/UX Principles

- Utility-first styling with Tailwind CSS.
- Consistent dark mode and responsive layouts.
- Accessible color contrasts and font sizes.
- Modular, reusable Svelte components.
- Focus on clarity, discoverability, and expert credibility.

---

## Testing Strategy

- Unit tests: Vitest (see `test:unit` script).
- E2E tests: Playwright (see `test:e2e` script).
- Mock data used for most tests.
- Manual testing for UI/UX and responsiveness.

---

## Release/Versioning Process

- No formal release process; versioning is manual in `package.json`.
- No changelog yet; recommend adding one for future releases.

---

## Contribution Guidelines

- Use Prettier and ESLint for code style.
- Write/extend unit and E2E tests for new features.
- Use TypeScript for all new code.
- Open PRs with clear descriptions; code review required.
- Document new components and API changes.

---

## Glossary

- **GFA:** Gross Floor Area
- **AUM:** Assets Under Management
- **IRR:** Internal Rate of Return
- **Cap Rate:** Capitalization Rate
- **Expert/Consultant:** Real estate professional with a public profile
- **Timeline:** Chronological feed of posts/updates
- **Portfolio:** Collection of properties managed or owned by an expert

---

## User/Persona Stories

- **Real Estate Expert:** Wants to showcase their experience, deals, and insights to attract clients.
- **Property Manager:** Wants to display managed properties and track updates.
- **End User/Client:** Wants to find and vet experts by specialty, region, or track record.
- **Admin:** (future) May want to manage experts, approve posts, or moderate content.

---

## Feature Matrix

| Feature                         | Status   | User Roles |
| ------------------------------- | -------- | ---------- |
| Expert Profile Page             | Complete | All        |
| Timeline (Posts, Comments)      | Complete | All        |
| Properties Portfolio            | Complete | All        |
| Expert Search & Filter          | Complete | All        |
| World Map/Tag Explorer          | Complete | All        |
| Authentication (Login/Register) | Partial  | All        |
| Real API Integration            | Partial  | All        |
| Real-time Updates               | Planned  | All        |
| Notifications                   | Planned  | All        |
| Analytics                       | Planned  | Admin      |
| Export/Download                 | Planned  | All        |

---

## Error Handling & Edge Cases

- Most fetches display a generic error message on failure.
- Empty states are handled in timeline/properties grids.
- No global error boundary; recommend adding for production.
- Auth errors clear state and show error messages.

---

## Performance Considerations

- Timeline and properties use local filtering/sorting for mock data.
- Infinite scroll in timeline demo (GeneralTimeline.svelte).
- Images are loaded via URLs; no lazy loading or optimization yet.
- No code splitting or SSR optimizations yet.

---

## Security Considerations

- Auth tokens stored in localStorage (improve for production).
- No XSS/CSRF protection on mock/demo endpoints.
- All API calls require secure HTTPS in production.
- No RBAC or permissions beyond basic login.

---

## Accessibility (a11y)

- Uses semantic HTML and ARIA roles where possible.
- Color contrast and font size generally accessible.
- No formal a11y audit; some components may need improvements (e.g., keyboard navigation, focus states).

---

## Internationalization (i18n)

- All text is in English; no i18n framework in place.
- To add i18n: externalize strings, use a library like `svelte-i18n`.

---

## Analytics & Monitoring

- No analytics or error monitoring implemented.
- Recommend adding Sentry (errors) and Plausible/GA (usage) for production.

---

## Integration Points

- Strapi backend for consultants, timeline, and properties (optional).
- Lucide icons for UI.
- Tailwind CSS for styling.
- date-fns for date formatting.

---

## Migration/Upgrade Notes

- SvelteKit, Tailwind, and dependencies are up-to-date as of June 2024.
- If upgrading SvelteKit or Tailwind, check for breaking changes in config and scripts.
- If switching backend, update server endpoints and data mapping functions.

---

## Contact & Support

- Maintainer: [Your Name/Team Here]
- For issues, open a GitHub issue or contact via [email/Slack/other].

---

## Screenshots / Visuals

_(Add screenshots or GIFs of the main UI features here for visual reference.)_

---

## Roadmap

- Complete real API integration for all data.
- Add real-time updates and notifications.
- Expand analytics and admin features.
- Improve accessibility and add i18n support.
- Add export/download and advanced filtering.

---
