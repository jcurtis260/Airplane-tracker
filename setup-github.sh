#!/bin/bash

# Airplane Tracker - GitHub Setup Script
# This script will help you create the GitHub repository and push your code

echo "🚀 Airplane Tracker - GitHub Setup"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Step 1: Create GitHub Repository${NC}"
echo "Please create a new repository on GitHub:"
echo ""
echo "1. Go to: https://github.com/new"
echo "2. Repository name: airplane-tracker"
echo "3. Description: Real-time airplane tracking app with 2D/3D interactive maps"
echo "4. Visibility: Public"
echo "5. ⚠️  DO NOT initialize with README, .gitignore, or license"
echo "6. Click 'Create repository'"
echo ""
echo -e "${BLUE}Press Enter after you've created the repository...${NC}"
read

echo ""
echo -e "${YELLOW}Step 2: Enter your GitHub username${NC}"
read -p "GitHub username: " GITHUB_USER

echo ""
echo -e "${YELLOW}Step 3: Setting up remote and pushing...${NC}"

# Remove any existing origin
git remote remove origin 2>/dev/null

# Add new origin
REPO_URL="https://github.com/${GITHUB_USER}/airplane-tracker.git"
git remote add origin "$REPO_URL"

echo ""
echo "Remote added: $REPO_URL"
echo ""

# Push to main branch
echo "Pushing to main branch..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}✅ Success! Your code is now on GitHub!${NC}"
    echo ""
    echo "📍 Repository: https://github.com/${GITHUB_USER}/airplane-tracker"
    echo ""
    echo -e "${YELLOW}Next Steps:${NC}"
    echo "1. Deploy to Vercel: https://vercel.com/new"
    echo "2. Import your GitHub repository"
    echo "3. Click Deploy (no configuration needed!)"
    echo ""
    echo "Or create a pull request from the feature branch:"
    echo "git push -u origin cursor/airplane-tracker-complete-3f5d"
    echo "Then visit: https://github.com/${GITHUB_USER}/airplane-tracker/compare/cursor/airplane-tracker-complete-3f5d"
else
    echo ""
    echo -e "${YELLOW}⚠️  Push failed. You may need to authenticate.${NC}"
    echo "Try running: gh auth login"
    echo "Then run this script again."
fi
