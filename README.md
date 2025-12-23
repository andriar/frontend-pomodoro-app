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

### Notes

- The base path is automatically configured based on your repository name
- If you want to deploy to a custom domain, update the `base` path in `vite.config.ts`
