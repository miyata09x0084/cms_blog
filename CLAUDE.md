# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal design blog site built with:
- **React 18** and **Next.js 13** - Server-side rendered React application
- **TypeScript** - Partial adoption (`.tsx` for pages, `.jsx` for components)
- **Tailwind CSS** - Utility-first CSS framework
- **Chakra UI** - Component library with theme system
- **GraphQL** with **GraphCMS (Hygraph)** - Headless CMS for content management
- **Google Analytics** - Tracking via gtag
- **Animation Libraries** - Framer Motion, anime.js, react-spring for rich animations

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm run dev

# Build production version
npm run build

# Start production server
npm start
```

## Project Architecture

### Core Structure
- **pages/** - Next.js pages with SSR/SSG
  - `_app.tsx` - App wrapper with Chakra provider, Layout, and Google Analytics
  - `index.tsx` - Homepage with featured posts
  - `post/[slug].js` - Dynamic post detail pages with comments
  - `category/[slug].js` - Category filtered posts
  - `work/index.js` - Portfolio/work showcase
  - `api/` - API routes for comments and contact forms

- **components/** - Reusable React components (`.jsx`)
  - Layout: `Layout.jsx`, `Header.jsx`, `Footer.jsx`
  - Blog: `PostCard.jsx`, `PostDetail.jsx`, `PostWidget.jsx`, `Categories.jsx`
  - Comments: `Comments.jsx`, `CommentsForm.jsx`
  - UI: `TypingAnimation.jsx`, `ToggleSwitch/`, `ColorTheme/`
  - `Author.jsx`, `Loader.jsx`, `FeaturedPostCard.jsx`

- **services/** - Data layer
  - `index.jsx` - All GraphQL queries (getPosts, getCategories, getPostDetails, submitComment, etc.)
  - Direct GraphQL integration with GraphCMS via `graphql-request`

- **styles/** - Styling configuration
  - `global.css` - Global styles, Tailwind imports, custom animations
  - `colors.css` - CSS custom properties for theming

- **lib/** - Utilities
  - `gtag.js` - Google Analytics helper functions

### Key Architectural Patterns

1. **Data Fetching**:
   - Server-side rendering with `getServerSideProps()` for dynamic routes
   - Static generation with `getStaticProps()` and `getStaticPaths()` for posts
   - GraphQL queries to Hygraph CMS using `graphql-request`

2. **Styling Architecture**:
   - Dual approach: Chakra UI components + Tailwind utilities
   - CSS custom properties in `colors.css` for theme variables
   - Dark/light mode via Chakra's `useColorModeValue`
   - Custom keyframe animations in `global.css`

3. **Theme Management**:
   - Chakra UI theme configuration with custom colors and fonts
   - Color mode switching with animated toggle components
   - Noto Sans JP font integration via Chakra theme

4. **Content Management**:
   - Rich text content from GraphCMS rendered with `html-react-parser`
   - Featured posts carousel using `react-multi-carousel`
   - Comment system with moderation through GraphCMS

## Environment Setup

Create a `.env.local` file with:
```
NEXT_PUBLIC_GRAPHCMS_ENDPOINT=your_graphcms_endpoint_url
GRAPHCMS_TOKEN=your_graphcms_auth_token
```

Additional environment variables for features:
- Google Analytics ID (configured in code)
- SendGrid API key (for email features)

## Important Considerations

- **Mixed Language**: Gradual TypeScript migration - pages use `.tsx`, components use `.jsx`
- **No Testing/Linting**: No test framework or linting configuration
- **Dual Styling Systems**: Both Chakra UI and Tailwind CSS are used
- **GraphCMS Setup**: Schema must be configured in Hygraph dashboard before development
- **Rich Animations**: Multiple animation libraries included (consider performance impact)