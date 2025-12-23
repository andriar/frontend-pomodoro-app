# Pomodoro App

A Pomodoro timer application built with Vue 3, TypeScript, and Vite.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

2. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions** (not "Deploy from a branch")
   - The workflow will automatically deploy when you push to the `main` branch

3. **Access your deployed app:**
   - Your app will be available at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
   - The deployment happens automatically on every push to the `main` branch

### Manual Deployment

You can also trigger a manual deployment by:
- Going to **Actions** tab in your GitHub repository
- Selecting the "Deploy to GitHub Pages" workflow
- Clicking **Run workflow**

### Troubleshooting

**If you see 404 errors for assets (like `/src/main.ts`):**

The base path might not be configured correctly. You can manually set it:

1. **Option 1: Set environment variable in GitHub Actions**
   - Edit `.github/workflows/deploy.yml`
   - In the "Build" step, add:
     ```yaml
     env:
       VITE_BASE_PATH: '/your-repo-name/'
     ```
   - Replace `your-repo-name` with your actual repository name
   - For user/organization pages (username.github.io), use: `VITE_BASE_PATH: '/'`

2. **Option 2: Update vite.config.ts directly**
   - Open `vite.config.ts`
   - Change the `base` return value in `getBasePath()` function to match your repository name
   - Example: `return '/pomodoro-app/'` or `return '/'` for user pages

### Notes

- The base path is automatically configured based on your repository name
- For project pages: `https://username.github.io/repo-name/` → base: `/repo-name/`
- For user/organization pages: `https://username.github.io/` → base: `/`
- If you want to deploy to a custom domain, update the `base` path in `vite.config.ts`
