# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a minimal design blog site built with:
- **React** and **Next.js 13** - Server-side rendered React application
- **TypeScript** - For type safety (partially adopted)
- **Tailwind CSS** - Utility-first CSS framework for styling
- **Chakra UI** - Component library for UI elements
- **GraphQL** with **GraphCMS (Hygraph)** - Headless CMS for content management
- **Google Analytics** integration via gtag

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
- **pages/** - Next.js page components and API routes
  - `_app.tsx` - Main app wrapper with Layout, Chakra UI provider, and Google Analytics
  - `index.tsx` - Homepage
  - `post/[slug].js` - Dynamic post detail pages
  - `category/[slug].js` - Category filtered posts
  - `work/index.js` - Work/portfolio page

- **components/** - Reusable React components
  - Mix of `.jsx` and TypeScript files
  - Main layout components: `Layout.jsx`, `Header.jsx`, `Footer.jsx`
  - Post-related: `PostCard.jsx`, `PostDetail.jsx`, `Categories.jsx`
  - UI elements: `ToggleSwitch/`, `ColorTheme/`, `TypingAnimation.jsx`

- **services/** - GraphQL API integration
  - `index.jsx` - All GraphCMS queries (getPosts, getCategories, getPostDetails, getCategoryPost)

- **styles/** - Global CSS and Tailwind configuration
  - `global.css` - Global styles and Tailwind imports
  - `colors.css` - Custom color definitions

### Key Patterns

1. **Data Fetching**: GraphQL queries via `graphql-request` to GraphCMS endpoint
2. **Styling**: Combination of Tailwind CSS utilities and Chakra UI components
3. **Environment Variables**: Requires `NEXT_PUBLIC_GRAPHCMS_ENDPOINT` for CMS connection
4. **Mixed TypeScript**: Gradual TypeScript adoption (`.tsx` for some pages, `.jsx` for components)

## Environment Setup

Create a `.env.local` file with:
```
NEXT_PUBLIC_GRAPHCMS_ENDPOINT=your_graphcms_endpoint_url
```

## Important Notes

- No linting or testing scripts configured in package.json
- Uses both Chakra UI and Tailwind CSS for styling (potential for consolidation)
- GraphCMS schema must be configured separately in the Hygraph dashboard
- Google Analytics tracking ID is configured in `lib/gtag.js`