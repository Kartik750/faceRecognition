#!/bin/bash

# Face Tracking App - Automated Deployment Script for Vercel
# Run this script to deploy your application to Vercel

echo "🚀 Starting Face Tracking App Deployment to Vercel..."
echo "================================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root directory."
    exit 1
fi

# Check if project name is face-recognition
if ! grep -q '"name": "face-recognition"' package.json; then
    echo "❌ Error: This doesn't appear to be the face-recognition project."
    exit 1
fi

echo "✅ Project validation passed"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies"
        exit 1
    fi
    echo "✅ Dependencies installed successfully"
else
    echo "✅ Dependencies already installed"
fi

# Run build to test everything works
echo "🔨 Testing production build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed. Please fix errors before deploying."
    exit 1
fi
echo "✅ Build successful"

# Check if git repository is initialized
if [ ! -d ".git" ]; then
    echo "📝 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit: Face tracking application ready for deployment"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

# Check if vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install Vercel CLI"
        echo "Please install manually: npm install -g vercel"
        exit 1
    fi
    echo "✅ Vercel CLI installed"
else
    echo "✅ Vercel CLI already installed"
fi

# Login to Vercel (if not already logged in)
echo "🔐 Checking Vercel authentication..."
vercel whoami > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Please login to Vercel:"
    vercel login
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to login to Vercel"
        exit 1
    fi
fi
echo "✅ Vercel authentication successful"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
echo "This will create a new project and deploy your application."
echo "Follow the prompts to configure your deployment."
echo ""

vercel
if [ $? -ne 0 ]; then
    echo "❌ Error: Deployment failed"
    exit 1
fi

echo ""
echo "🎉 Deployment completed successfully!"
echo "================================================"
echo "Your Face Tracking Application is now live!"
echo ""
echo "Next steps:"
echo "1. Test all features on the deployed URL"
echo "2. Set up custom domain (optional)"
echo "3. Enable Vercel Analytics for monitoring"
echo "4. Share your application with users"
echo ""
echo "For production deployment, run: vercel --prod"
echo ""
echo "Happy coding! 🎭📹"
