#!/bin/bash

echo "🚀 Deploying to EC2..."

# Pull latest changes
echo "📥 Pulling latest code..."
git pull

# Update database schema
echo "🗄️ Updating database..."
docker exec zoho_postgres psql -U postgres -d zoho_embed -c "ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT, ADD COLUMN IF NOT EXISTS name VARCHAR(255);"

# Rebuild and restart containers
echo "🔨 Building and restarting containers..."
docker-compose up -d --build

echo "✅ Deployment complete!"
echo "🌐 Visit: http://13.251.60.208"
