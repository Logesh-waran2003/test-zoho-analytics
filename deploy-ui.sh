#!/bin/bash

# Quick deployment script for EC2
echo "🚀 Deploying UI updates to EC2..."

# Pull latest changes
git pull

# Rebuild and restart frontend
docker-compose up -d --build frontend

echo "✅ Deployment complete!"
echo "🌐 Visit: http://13.251.60.208"
