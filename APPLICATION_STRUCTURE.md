# Zoho Analytics Multi-Tenant Application - Technical Structure

## 🏗️ Architecture Overview

```
┌─────────────┐      HTTP      ┌──────────────┐      SQL       ┌────────────┐
│   Browser   │ ◄──────────────► │   Backend    │ ◄─────────────► │ PostgreSQL │
│  (React)    │                 │  (Node.js)   │                 │  Database  │
└─────────────┘                 └──────────────┘                 └────────────┘
                                       │
                                       │ OAuth + API
                                       ▼
                                ┌──────────────┐
                                │    Zoho      │
                                │  Analytics   │
                                └──────────────┘
```

## 📁 Project Structure

```
test-app/
├── frontend/                    # React Application
│   ├── src/
│   │   ├── App.tsx             # Main app component with routing
│   │   ├── api.ts              # API calls to backend
│   │   ├── pages/
│   │   │   ├── Login.tsx       # Mock login page
│   │   │   ├── Form.tsx        # 10-field data entry form
│   │   │   └── Dashboard.tsx   # Embedded Zoho dashboard
│   │   └── vite-env.d.ts       # TypeScript environment types
│   ├── Dockerfile              # Multi-stage build (Node + Nginx)
│   ├── nginx.conf              # Reverse proxy config
│   └── package.json
│
├── backend/                     # Node.js Express API
│   ├── index.js                # Main server entry point
│   ├── db/
│   │   └── index.js            # PostgreSQL connection pool
│   ├── routes/
│   │   ├── auth.js             # POST /auth/login (mock)
│   │   ├── form.js             # POST /form/submit
│   │   └── dashboard.js        # GET /dashboard/embed-url
│   ├── services/
│   │   └── zoho.js             # Zoho OAuth + API integration
│   ├── Dockerfile              # Node.js container
│   ├── init.sql                # Database schema
│   └── package.json
│
├── docker-compose.yml           # Orchestrates all services
├── .env                         # Environment variables (secrets)
└── README.md
```

## 🔄 Application Flow

### 1. User Login (Mock)
```
Browser → POST /auth/login
Backend → Returns { user_id, tenant_id, token }
Frontend → Stores in state, redirects to /form
```

### 2. Form Submission
```
Browser → POST /form/submit
        { tenant_id, field_1, field_2, ..., field_10 }
Backend → INSERT INTO form_data (tenant_id, field_1, ...)
        → Returns success
Frontend → Redirects to /dashboard
```

### 3. Dashboard Embed (THE ISSUE)
```
Browser → GET /dashboard/embed-url?tenant_id=X
Backend → zoho.js: getAccessToken()
        → Uses refresh_token to get access_token from Zoho
        → zoho.js: getEmbedUrl(tenant_id)
        → POST to Zoho Analytics API to generate embed URL
        → Returns { embedUrl: "https://..." }
Frontend → Renders iframe with embedUrl
```

## 🔐 Zoho OAuth Flow

### Initial Setup (DONE ✅)
1. Created OAuth app in Zoho
2. Got authorization code from browser redirect
3. Exchanged code for refresh_token
4. Stored refresh_token in .env

### Runtime Token Refresh (HAPPENING NOW)
```javascript
// backend/services/zoho.js
getAccessToken() {
  1. Check if cached token is still valid
  2. If expired:
     POST https://accounts.zoho.in/oauth/v2/token
     Body: {
       refresh_token: "1000.d3744dba...",
       client_id: "1000.2XHAU17VY5L2FHNVXPLIH8WORHKTBJ",
       client_secret: "b03bee6fb02897ce1aab772106f0461b6f88a87bdf",
       grant_type: "refresh_token"
     }
  3. Cache new access_token for 1 hour
  4. Return access_token
}
```

### Generate Embed URL (FAILING ❌)
```javascript
getEmbedUrl(tenant_id) {
  1. Get access_token
  2. POST https://analyticsapi.zoho.in/restapi/v2/workspaces/{WORKSPACE_ID}/views/{VIEW_ID}/embed
     Headers: {
       Authorization: "Zoho-oauthtoken {access_token}"
     }
     Body: {
       workspace_id: "460548000000012082",
       view_id: "460548000000012002",
       user_info: { tenant_id: "..." },
       embed_type: "iframe",
       expiry_time: 300000
     }
  3. Return embed_url from response
}
```

## 🐛 Current Error: "Invalid URL"

**Error Location:** `backend/services/zoho.js` line 19
```javascript
const response = await axios.post(
  `${process.env.ZOHO_ACCOUNT_SERVER_URL}/oauth/v2/token`,  // ← This is undefined
  params
);
```

**Root Cause:** Environment variables not loaded in Docker container

## 🔍 Environment Variables Required

```bash
# .env file (on EC2)
DB_PASSWORD=postgres123

# Zoho OAuth
ZOHO_CLIENT_ID=1000.2XHAU17VY5L2FHNVXPLIH8WORHKTBJ
ZOHO_CLIENT_SECRET=b03bee6fb02897ce1aab772106f0461b6f88a87bdf
ZOHO_REFRESH_TOKEN=1000.d3744dba117b0923009daab4ab2a6e1a.eab7e19eb791ad9c5229a31885149236

# Zoho IDs
ZOHO_ORG_ID=60045849193
ZOHO_WORKSPACE_ID=460548000000012082
ZOHO_VIEW_ID=460548000000012002

# Zoho API URLs (CRITICAL - MISSING IN CONTAINER)
ZOHO_ACCOUNT_SERVER_URL=https://accounts.zoho.in
ZOHO_ANALYTICS_SERVER_URL=https://analyticsapi.zoho.in

# App URLs
FRONTEND_URL=http://13.251.60.208
VITE_API_URL=http://13.251.60.208/api
```

## 🐳 Docker Setup

### docker-compose.yml
```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: zoho_embed
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    
  backend:
    build: ./backend
    environment:
      # All ZOHO_* variables must be passed here
      ZOHO_CLIENT_ID: ${ZOHO_CLIENT_ID}
      ZOHO_CLIENT_SECRET: ${ZOHO_CLIENT_SECRET}
      ZOHO_REFRESH_TOKEN: ${ZOHO_REFRESH_TOKEN}
      ZOHO_ACCOUNT_SERVER_URL: ${ZOHO_ACCOUNT_SERVER_URL}  # ← CHECK THIS
      ZOHO_ANALYTICS_SERVER_URL: ${ZOHO_ANALYTICS_SERVER_URL}  # ← CHECK THIS
    depends_on:
      - postgres
    
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🔧 Debugging Steps

### 1. Verify Environment Variables in Container
```bash
docker exec zoho_backend env | grep ZOHO
```

**Expected Output:**
```
ZOHO_CLIENT_ID=1000.2XHAU17VY5L2FHNVXPLIH8WORHKTBJ
ZOHO_CLIENT_SECRET=b03bee6fb02897ce1aab772106f0461b6f88a87bdf
ZOHO_REFRESH_TOKEN=1000.d3744dba117b0923009daab4ab2a6e1a.eab7e19eb791ad9c5229a31885149236
ZOHO_ORG_ID=60045849193
ZOHO_WORKSPACE_ID=460548000000012082
ZOHO_VIEW_ID=460548000000012002
ZOHO_ACCOUNT_SERVER_URL=https://accounts.zoho.in
ZOHO_ANALYTICS_SERVER_URL=https://analyticsapi.zoho.in
```

### 2. Test Token Refresh Manually
```bash
docker exec zoho_backend curl -X POST https://accounts.zoho.in/oauth/v2/token \
  -d "refresh_token=1000.d3744dba117b0923009daab4ab2a6e1a.eab7e19eb791ad9c5229a31885149236" \
  -d "client_id=1000.2XHAU17VY5L2FHNVXPLIH8WORHKTBJ" \
  -d "client_secret=b03bee6fb02897ce1aab772106f0461b6f88a87bdf" \
  -d "grant_type=refresh_token"
```

**Expected:** JSON with `access_token`

### 3. Check Backend Logs
```bash
docker-compose logs backend -f
```

### 4. Test Embed API Directly
```bash
# Get access token first, then:
curl -X POST https://analyticsapi.zoho.in/restapi/v2/workspaces/460548000000012082/views/460548000000012002/embed \
  -H "Authorization: Zoho-oauthtoken {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d '{
    "workspace_id": "460548000000012082",
    "view_id": "460548000000012002",
    "user_info": {"tenant_id": "test"},
    "embed_type": "iframe",
    "expiry_time": 300000
  }'
```

## 📊 Database Schema

```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) UNIQUE NOT NULL,
  tenant_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- form_data table (multi-tenant)
CREATE TABLE form_data (
  id SERIAL PRIMARY KEY,
  tenant_id VARCHAR(255) NOT NULL,  -- Isolates data per tenant
  field_1 TEXT,
  field_2 TEXT,
  field_3 TEXT,
  field_4 TEXT,
  field_5 TEXT,
  field_6 TEXT,
  field_7 TEXT,
  field_8 TEXT,
  field_9 TEXT,
  field_10 TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_form_data_tenant_id ON form_data(tenant_id);
```

## 🚀 Deployment Info

**EC2 Instance:** 13.251.60.208
**Services Running:**
- Frontend: Port 80 (Nginx)
- Backend: Port 3001 (Node.js)
- PostgreSQL: Port 5432

**Access:**
- Application: http://13.251.60.208
- API Health: http://13.251.60.208/api/health

## ❓ Questions for Your Friend

1. **Are environment variables being passed to Docker container?**
   - Run: `docker exec zoho_backend env | grep ZOHO`
   - Should see all ZOHO_* variables

2. **Is the Zoho Analytics API endpoint correct for India region?**
   - Using: `https://analyticsapi.zoho.in`
   - Alternative: `https://www.zohoapis.in/analyticsapi`

3. **Does the refresh token work?**
   - Test manually with curl (see debugging steps above)

4. **Are there any CORS or domain restrictions in Zoho?**
   - Check Zoho OAuth app settings
   - Verify `13.251.60.208` is in allowed domains

5. **What's the exact error from Zoho API?**
   - Need full error response, not just "Invalid URL"
   - Add better error logging in `backend/services/zoho.js`

## 🔗 Useful Links

- Zoho Analytics API Docs: https://www.zoho.com/analytics/api/
- Zoho OAuth Docs: https://www.zoho.com/accounts/protocol/oauth.html
- Your Workspace: https://analytics.zoho.in/workspace/460548000000012082
- Your Dashboard: https://analytics.zoho.in/workspace/460548000000012082/view/460548000000012002
