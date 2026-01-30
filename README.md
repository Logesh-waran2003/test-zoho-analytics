# Zoho Analytics SSO Embed Application

Production-ready fullstack application for embedding Zoho Analytics dashboards using SSO.

## Tech Stack

- **Backend**: Node.js 20, Express
- **Frontend**: React 18 + TypeScript (Vite)
- **Database**: PostgreSQL
- **Process Manager**: PM2
- **Deployment**: AWS EC2 (Linux)

## Prerequisites

- Node.js 20+
- PostgreSQL
- PM2 (for production)

## Setup

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb zoho_embed

# Or using psql
psql -U postgres
CREATE DATABASE zoho_embed;
\q
```

### 2. Backend Setup

```bash
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your Zoho credentials and DB config
```

**Required Zoho Configuration:**
- Create a Zoho Analytics OAuth app
- Get Client ID, Client Secret, and Refresh Token
- Add your domain to Zoho Allowed Domains
- Get Workspace ID and View ID from your dashboard

### 3. Frontend Setup

```bash
cd frontend
npm install
```

## Development

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

## Production Deployment

### Build Frontend
```bash
cd frontend
npm run build
# Serve dist/ folder with Nginx
```

### Start Backend with PM2
```bash
cd backend
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

### Nginx Configuration (Reverse Proxy)

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:3001/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## API Endpoints

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-30T10:11:19.348Z"
}
```

### POST /zoho/embed-url
Generate Zoho Analytics embed URL

**Request:**
```json
{
  "userId": "mock_user",
  "orgId": "mock_org"
}
```

**Response:**
```json
{
  "embedUrl": "https://analytics.zoho.com/..."
}
```

## Security Features

- CORS configured for specific frontend origin
- Environment variables for secrets
- Database validation for user context
- Short-lived embed URLs (5 minutes)
- OAuth token caching
- Trust proxy enabled for Nginx
- No Zoho credentials in frontend

## Database Schema

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  org_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Environment Variables

See `backend/.env.example` for all required variables.

## PM2 Commands

```bash
pm2 list                 # List all processes
pm2 logs                 # View logs
pm2 restart all          # Restart all processes
pm2 stop all             # Stop all processes
pm2 delete all           # Delete all processes
```

## Troubleshooting

1. **Database connection fails**: Check PostgreSQL is running and credentials are correct
2. **Zoho API errors**: Verify OAuth credentials and refresh token validity
3. **CORS errors**: Ensure FRONTEND_URL matches your frontend origin
4. **Embed URL fails**: Check domain is added to Zoho Allowed Domains

## License

MIT
