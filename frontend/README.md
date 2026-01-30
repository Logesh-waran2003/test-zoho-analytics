# Frontend - Zoho Analytics Dashboard Embed

React + TypeScript frontend for displaying embedded Zoho Analytics dashboards.

## Setup

```bash
npm install
```

## Run

```bash
# Development
npm run dev

# Build for production
npm run build
```

## Configuration

Backend API URL is configured via `VITE_API_URL` environment variable.
Defaults to `http://localhost:3001` if not set.

## Features

- Fetches embed URL from backend on load
- Displays dashboard in fullscreen iframe
- Error handling and loading states
- Responsive layout
