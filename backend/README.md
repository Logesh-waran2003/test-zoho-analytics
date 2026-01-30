# Backend - Zoho Analytics SSO Embed API

Express.js backend for generating Zoho Analytics embed URLs with SSO.

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your credentials
```

## Environment Variables

See `.env.example` for all required variables:
- PostgreSQL connection details
- Zoho OAuth credentials (Client ID, Secret, Refresh Token)
- Zoho Workspace ID and View ID
- CORS frontend URL

## Run

```bash
# Development
npm run dev

# Production with PM2
pm2 start ecosystem.config.cjs
```

## API Endpoints

- `GET /health` - Health check
- `POST /zoho/embed-url` - Generate embed URL (requires userId, orgId)
