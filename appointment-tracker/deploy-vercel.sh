#!/bin/bash

# Deployment script for Vercel
# This script will build and deploy your app to Vercel

echo "🚀 Starting deployment process..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the appointment-tracker directory."
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

# Build the project
echo ""
echo "🔨 Building production version..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Please fix the errors and try again."
    exit 1
fi

echo ""
echo "✅ Build successful!"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📥 Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Deploy to Vercel
echo ""
echo "🌍 Deploying to Vercel..."
echo ""
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "Your app is now live and accessible worldwide!"
echo ""
