#!/bin/bash

echo "Building frontend..."
cd frontend/vite-project && npm install && npm run build

echo "Building backend..."
cd .. && cd .. && cd backend && npm install 

echo "Build completed successfully!"
