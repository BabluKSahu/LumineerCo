#!/bin/bash

# LumineerCo Deployment Script
# Usage: ./deploy.sh [vercel|docker|railway]

set -e

DEPLOY_TARGET=${1:-vercel}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "🚀 LumineerCo Deployment Script"
echo "================================"
echo "Target: $DEPLOY_TARGET"
echo ""

# Check required files
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local not found. Copy .env.example and fill in values."
    exit 1
fi

# Load environment
source .env.local

# Validate required vars
REQUIRED_VARS=(
    "TELEGRAM_BOT_TOKEN"
    "TELEGRAM_ADMIN_CHAT_ID"
    "TELEGRAM_STORAGE_CHANNEL_ID"
    "ENCRYPTION_KEY"
    "NEXTAUTH_SECRET"
    "NEXTAUTH_URL"
)

MISSING=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING+=("$var")
    fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
    echo "❌ Missing required environment variables:"
    for var in "${MISSING[@]}"; do
        echo "   - $var"
    done
    exit 1
fi

# Check AI provider
if [ -z "$OPENAI_API_KEY" ] && [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  Warning: No AI provider configured (OPENAI_API_KEY or ANTHROPIC_API_KEY)"
    echo "   Agents will not work without at least one provider."
fi

case $DEPLOY_TARGET in
    vercel)
        echo "📦 Deploying to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            echo "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        # Deploy
        vercel --prod
        
        # Setup webhook after deploy
        echo ""
        echo "🔧 Setting up Telegram webhook..."
        sleep 5
        DEPLOY_URL=$(vercel ls --scope=personal 2>/dev/null | grep lumineerco | head -1 | awk '{print $2}')
        if [ -n "$DEPLOY_URL" ]; then
            curl -X GET "https://$DEPLOY_URL/api/telegram/webhook"
            echo ""
            echo "✅ Webhook configured for $DEPLOY_URL"
        else
            echo "⚠️  Could not auto-detect deploy URL. Run manually:"
            echo "   curl -X GET https://your-app.vercel.app/api/telegram/webhook"
        fi
        ;;
        
    docker)
        echo "🐳 Building and starting Docker containers..."
        
        # Build images
        docker-compose build
        
        # Start services
        docker-compose up -d
        
        # Wait for health check
        echo "⏳ Waiting for services to be healthy..."
        sleep 10
        
        # Check health
        if curl -f http://localhost:3000/api/health > /dev/null 2>&1; then
            echo "✅ Web service is healthy"
        else
            echo "❌ Web service health check failed"
            docker-compose logs web
            exit 1
        fi
        
        # Setup webhook
        echo "🔧 Setting up Telegram webhook..."
        curl -X GET "http://localhost:3000/api/telegram/webhook"
        echo ""
        echo "✅ Deployment complete!"
        echo "   Web: http://localhost:3000"
        echo "   Admin: http://localhost:3000/admin"
        ;;
        
    railway)
        echo "🚂 Deploying to Railway..."
        
        if ! command -v railway &> /dev/null; then
            echo "Installing Railway CLI..."
            npm install -g @railway/cli
        fi
        
        railway login
        railway up
        
        echo "✅ Deployed to Railway"
        echo "   Run: railway variables set NEXTAUTH_URL=https://your-app.railway.app"
        echo "   Then: curl -X GET https://your-app.railway.app/api/telegram/webhook"
        ;;
        
    *)
        echo "❌ Unknown deploy target: $DEPLOY_TARGET"
        echo "Usage: ./deploy.sh [vercel|docker|railway]"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "📋 Next steps:"
echo "   1. Test the website at your deploy URL"
echo "   2. Test admin panel at /admin"
echo "   3. Test Telegram bot with /start command"
echo "   4. Submit a test project via contact form"
echo "   5. Check Telegram for notifications"