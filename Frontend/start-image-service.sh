#!/bin/bash

# Image Capture Service Setup and Start Script

echo "Setting up Image Capture Service..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm first."
    exit 1
fi

# Create a temporary package.json for the backend service
echo "Installing backend dependencies..."
cp backend-package.json package-backend.json

# Install dependencies in a separate directory to avoid conflicts
mkdir -p backend
cd backend
cp ../backend-package.json package.json
cp ../image-capture-service.js server.js

# Install backend dependencies
npm install

echo "Backend dependencies installed successfully!"
echo ""
echo "Starting Image Capture Service on port 3001..."
echo "Images will be saved to: $(pwd)/Data_image/"
echo ""
echo "To stop the service, press Ctrl+C"
echo "----------------------------------------"

# Start the backend service
node server.js
