# Deployment Guide - Appointment & Test Tracker

This guide will help you deploy your application so anyone in the world can access it.

## 🚀 Quick Deployment Options

### Option 1: Vercel (Recommended - Easiest & Free)

**Why Vercel?**
- ✅ Free tier available
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Zero configuration for Vite/React
- ✅ Automatic deployments from Git

**Steps:**

1. **Install Vercel CLI** (optional, or use web interface)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI:**
   ```bash
   cd appointment-tracker
   vercel
   ```
   
   Or **Deploy via Web:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub/GitLab/Bitbucket
   - Click "New Project"
   - Import your repository
   - Vercel auto-detects Vite settings
   - Click "Deploy"

3. **Your app will be live at:** `https://your-app-name.vercel.app`

---

### Option 2: Netlify (Also Great & Free)

**Why Netlify?**
- ✅ Free tier available
- ✅ Drag-and-drop deployment
- ✅ Automatic HTTPS
- ✅ Form handling built-in

**Steps:**

1. **Build your app:**
   ```bash
   cd appointment-tracker
   npm run build
   ```

2. **Deploy via Web:**
   - Go to [netlify.com](https://netlify.com)
   - Sign up
   - Drag the `dist` folder to Netlify
   - Your site is live!

   Or **Deploy via CLI:**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

3. **Your app will be live at:** `https://your-app-name.netlify.app`

---

### Option 3: GitHub Pages (Free)

**Why GitHub Pages?**
- ✅ Completely free
- ✅ Integrated with GitHub
- ✅ Good for static sites

**Steps:**

1. **Install gh-pages package:**
   ```bash
   cd appointment-tracker
   npm install --save-dev gh-pages
   ```

2. **Update `package.json`:**
   ```json
   {
     "homepage": "https://yourusername.github.io/appointment-tracker",
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Update `vite.config.ts`:**
   ```typescript
   export default defineConfig({
     base: '/appointment-tracker/',
     // ... rest of config
   })
   ```

4. **Deploy:**
   ```bash
   npm run deploy
   ```

5. **Your app will be live at:** `https://yourusername.github.io/appointment-tracker`

---

### Option 4: Render (Free Tier Available)

**Why Render?**
- ✅ Free tier for static sites
- ✅ Automatic HTTPS
- ✅ Easy setup

**Steps:**

1. Go to [render.com](https://render.com)
2. Sign up and create a "Static Site"
3. Connect your Git repository
4. Set build command: `npm run build`
5. Set publish directory: `dist`
6. Deploy!

---

## 📦 Pre-Deployment Checklist

Before deploying, make sure to:

### 1. Build the Production Version
```bash
cd appointment-tracker
npm run build
```

This creates an optimized `dist` folder.

### 2. Test the Production Build Locally
```bash
npm run preview
```

This runs the production build locally to test it.

### 3. Update Environment Variables (if needed)

If you're using Google Calendar API, you'll need to:

1. Create a `.env.production` file:
   ```env
   VITE_GOOGLE_CLIENT_ID=your_production_client_id
   VITE_GOOGLE_API_KEY=your_production_api_key
   ```

2. Add these to your deployment platform's environment variables section

### 4. Update Google OAuth Settings

For Google Calendar integration to work in production:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to "APIs & Services" > "Credentials"
3. Edit your OAuth 2.0 Client ID
4. Add your production URL to "Authorized JavaScript origins":
   - `https://your-app-name.vercel.app`
   - `https://your-app-name.netlify.app`
   - etc.
5. Add redirect URIs if needed

---

## 🎯 Recommended: Vercel Deployment (Step-by-Step)

Here's the complete process for Vercel:

### Method 1: Using Vercel Website (No CLI needed)

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/appointment-tracker.git
   git push -u origin main
   ```

2. **Deploy on Vercel:**
   - Visit [vercel.com/new](https://vercel.com/new)
   - Sign in with GitHub
   - Click "Import Project"
   - Select your repository
   - Vercel auto-detects settings:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Click "Deploy"

3. **Done!** Your app is live at `https://your-project.vercel.app`

### Method 2: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd appointment-tracker
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy? Yes
   - Which scope? (select your account)
   - Link to existing project? No
   - Project name? (press enter for default)
   - Directory? `./` (press enter)
   - Override settings? No

5. **Your app is deployed!** You'll get a URL like:
   - Preview: `https://appointment-tracker-abc123.vercel.app`
   - Production: `https://appointment-tracker.vercel.app`

---

## 🔧 Post-Deployment

### Custom Domain (Optional)

All platforms support custom domains:

1. **Buy a domain** (from Namecheap, GoDaddy, Google Domains, etc.)
2. **Add domain in your platform:**
   - Vercel: Project Settings > Domains
   - Netlify: Site Settings > Domain Management
3. **Update DNS records** as instructed by the platform
4. **Wait for DNS propagation** (can take up to 48 hours)

### Continuous Deployment

Once connected to Git:
- Every push to `main` branch = automatic deployment
- Pull requests get preview URLs
- Rollback to previous versions anytime

---

## 📊 Monitoring & Analytics

Consider adding:

1. **Google Analytics** - Track visitors
2. **Sentry** - Error monitoring
3. **Vercel Analytics** - Performance monitoring (built-in)

---

## 💰 Cost Comparison

| Platform | Free Tier | Bandwidth | Build Minutes | Custom Domain |
|----------|-----------|-----------|---------------|---------------|
| **Vercel** | ✅ Yes | 100GB/month | 6000 min/month | ✅ Free |
| **Netlify** | ✅ Yes | 100GB/month | 300 min/month | ✅ Free |
| **GitHub Pages** | ✅ Yes | 100GB/month | Unlimited | ✅ Free |
| **Render** | ✅ Yes | 100GB/month | 500 min/month | ✅ Free |

All free tiers are more than enough for most personal projects!

---

## 🚨 Common Issues & Solutions

### Issue: Build fails with "command not found"
**Solution:** Make sure `package.json` has the correct build script:
```json
"scripts": {
  "build": "tsc && vite build"
}
```

### Issue: App loads but shows blank page
**Solution:** Check the browser console for errors. Usually a routing issue.
- For Vercel/Netlify: Add a `vercel.json` or `netlify.toml` for SPA routing

### Issue: Environment variables not working
**Solution:** 
- Prefix with `VITE_` (e.g., `VITE_API_KEY`)
- Add them in the platform's dashboard under "Environment Variables"

### Issue: Google Calendar not working in production
**Solution:** 
- Update OAuth authorized origins in Google Cloud Console
- Add your production URL

---

## 🎉 You're Ready to Deploy!

**Recommended Quick Start:**
```bash
# 1. Build and test locally
cd appointment-tracker
npm run build
npm run preview

# 2. Deploy to Vercel (easiest)
npx vercel

# That's it! Your app is live! 🚀
```

Your app will be accessible worldwide at the provided URL!
