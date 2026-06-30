# Deployment Instructions

## GitHub Repository Setup

The code is ready and committed locally. To push to GitHub:

1. **Create a new GitHub repository** at https://github.com/new
   - Name: `airplane-tracker`
   - Description: "Real-time airplane tracking app with 2D/3D interactive maps"
   - Visibility: Public
   - **Do not** initialize with README (we already have one)

2. **Add the remote and push:**
   ```bash
   cd /workspace/airplane-tracker
   git remote add origin https://github.com/YOUR_USERNAME/airplane-tracker.git
   git push -u origin main
   ```

## Vercel Deployment

### Option 1: Automatic (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will automatically detect Next.js
4. Click **Deploy** (no environment variables needed!)

### Option 2: Vercel CLI

```bash
cd /workspace/airplane-tracker
npm install -g vercel
vercel login
vercel --prod
```

## Post-Deployment

After deployment:
- Your app will be live at `https://airplane-tracker.vercel.app` (or your custom domain)
- Every push to `main` branch will auto-deploy
- Preview deployments are created for pull requests

## No Configuration Needed!

✅ The app uses free, public APIs:
- airplanes.live (no API key)
- MapLibre GL JS (open source)
- Free CartoDB map tiles

✅ Vercel automatically configures:
- Serverless API routes
- Edge caching
- Image optimization
- HTTPS certificates

## Testing Locally

Before deploying, test locally:

```bash
npm run dev
# Open http://localhost:3000
```

Build for production:

```bash
npm run build
npm start
```

## Troubleshooting

If you encounter issues:

1. **Build fails**: Check Node.js version (requires 18+)
2. **Map not loading**: Check browser console for CORS errors
3. **No airplanes showing**: The API might be rate-limited (wait 30 seconds)
4. **Location denied**: Use manual location entry

## Custom Domain

To add a custom domain in Vercel:

1. Go to your project settings
2. Click **Domains**
3. Add your domain and follow DNS instructions

---

Your airplane tracker is now ready to fly! ✈️
