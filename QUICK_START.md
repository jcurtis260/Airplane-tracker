# 🚀 Quick Start - Airplane Tracker

## Push to GitHub (Choose One Method)

### Method 1: Interactive Script (Easiest)

```bash
cd /workspace/airplane-tracker
./setup-github.sh
```

This will guide you through creating the GitHub repository and pushing the code.

---

### Method 2: Manual Setup

1. **Create GitHub Repository**
   - Go to https://github.com/new
   - Name: `airplane-tracker`
   - Description: `Real-time airplane tracking app with 2D/3D interactive maps`
   - Public repository
   - **DO NOT** initialize with README
   - Click "Create repository"

2. **Push Your Code**

   Replace `YOUR_USERNAME` with your GitHub username:

   ```bash
   cd /workspace/airplane-tracker
   git remote add origin https://github.com/YOUR_USERNAME/airplane-tracker.git
   git push -u origin main
   ```

3. **Push Feature Branch (Optional)**

   If you want to create a pull request:

   ```bash
   git push -u origin cursor/airplane-tracker-complete-3f5d
   ```

   Then create a PR at:
   `https://github.com/YOUR_USERNAME/airplane-tracker/compare/cursor/airplane-tracker-complete-3f5d`

---

## Deploy to Vercel

Once pushed to GitHub:

1. Go to https://vercel.com/new
2. Click "Import" next to your `airplane-tracker` repository
3. Click "Deploy" (no configuration needed!)
4. Wait 2-3 minutes for deployment
5. Your app is live! 🎉

---

## Test Locally First

```bash
cd /workspace/airplane-tracker

# Install dependencies (if not already done)
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

---

## What's Included

✅ Complete Next.js 15 app (1,741 lines of code)
✅ 2D and 3D map views
✅ Real-time airplane tracking
✅ GPS geolocation support
✅ Manual location entry
✅ Responsive design
✅ Dark mode support
✅ Production-ready build
✅ Comprehensive documentation

---

## Need Help?

- **README.md** - Full documentation
- **DEPLOYMENT.md** - Detailed deployment guide
- **GitHub Issues** - Report problems or ask questions

---

## Repository Structure

```
/workspace/airplane-tracker/
├── app/              # Next.js app directory
├── components/       # React components
├── lib/             # Utilities and API client
├── public/          # Static assets
├── README.md        # Full documentation
├── DEPLOYMENT.md    # Deployment guide
└── setup-github.sh  # GitHub setup script
```

---

**Ready to fly?** Run `./setup-github.sh` or follow the manual steps above! ✈️
