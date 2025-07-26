#!/bin/bash

echo "🔨 Testing Build Process"
echo "======================="

echo "1. Cleaning previous build..."
rm -rf dist/

echo "2. Installing dependencies..."
npm ci

echo "3. Generating Prisma client..."
npx prisma generate

echo "4. Building the application..."
npm run build

echo "5. Checking build output..."
ls -la dist/
ls -la dist/src/

echo "6. Testing the built application..."
if [ -f "dist/src/main.js" ]; then
    echo "✅ Main file exists!"
    echo "File size: $(ls -lh dist/src/main.js | awk '{print $5}')"
else
    echo "❌ Main file not found!"
    echo "Available files in dist/src/:"
    ls -la dist/src/ || echo "dist/src directory not found"
fi 