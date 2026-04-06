# HomeVision Frontend Challenge

A house listing app built with React, TypeScript, and Vite. Browse houses with infinite scroll, favorite them, and view favorites on an interactive map.

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **TanStack Query** for data fetching with infinite pagination
- **TanStack Virtual** for virtualized grid rendering
- **Framer Motion** for animations
- **React Router v7** for routing
- **Leaflet** + **OpenStreetMap** for the favorites map
- **Axios** for HTTP requests
- **CSS Modules** with a custom neumorphic design system (light/dark themes)

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Setup

```bash
git clone git@github.com:FernetB/hv-frontend.git
cd hv-frontend
npm install
```

Create a `.env` file (see `.env.example`):

```
VITE_API_BASE_URL=https://staging.homevision.co/api_project
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
npm run preview
```

### Lint

```bash
npm run lint
```

## Features

- Infinite scroll house listing with virtualized grid
- Responsive layout (1-4 columns based on screen width)
- Neumorphic UI with light/dark theme toggle
- Favorite houses with localStorage persistence
- Interactive map showing favorited houses with geocoded pins
- House detail modal with slide-up animation
- Full-page house detail from map pin navigation
- Error boundary with reload fallback
- Retry with exponential backoff for API (503s)
- Skeleton loading states

## Project Structure

```
src/
  App.tsx                          # Router configuration
  main.tsx                         # App entry point with providers
  index.css                        # Global styles
  theme/                           # Theme provider + CSS variables
  providers/
    ApiProvider.tsx                 # Axios instance via context
    FavoritesProvider.tsx           # Favorites state + localStorage
  hooks/api/useGetHouses/          # TanStack Query infinite query + types
  components/
    Header/                        # Logo, theme toggle, map button
    HouseCard/                     # Card component + skeleton
    HouseDetail/                   # Reusable detail view
    VirtualHouseGrid/              # Virtualized responsive grid
    ErrorBoundary/                 # Error boundary + route fallback
    ErrorMessage/                  # API error display with retry
  pages/
    HouseListPage/                 # List layout with filter toggle + modal
    HouseDetailPage/               # Detail page + modal page variants
    FavoritesMapPage/              # Leaflet map with geocoded pins
  assets/icons/                    # SVG icons
```
