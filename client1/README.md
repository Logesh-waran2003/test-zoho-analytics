# Client 1 - Business Application

This is a client business application that embeds analytics from `app.stigmatatech.com`.

## Iframe Structure

```
client1.stigmatatech.com (This app)
└── iframe → app.stigmatatech.com
    └── iframe → analytics.stigmatatech.com (Zoho)
```

## Why This Works

- **Zoho only trusts app.stigmatatech.com** (configured in Zoho allowed domains)
- **Client1 embeds app.stigmatatech.com** in an iframe
- **app.stigmatatech.com embeds Zoho** in its own iframe
- **Zoho sees its parent as app.stigmatatech.com** ✅ (trusted)
- **Zoho doesn't care about client1** (it's the grandparent, not parent)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Access at: http://localhost:5174

## Production Build

```bash
npm run build
```

## Routes

- `/` - Home page with explanation
- `/analytics` - Embedded analytics dashboard

## Environment

The app embeds: `https://app.stigmatatech.com/analytics/embed?tenant=tenant1`

This URL needs to be created in the main app (app.stigmatatech.com).
