import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Get repository name from environment variable
// GITHUB_REPOSITORY format: "username/repo-name"
// For user/organization pages (username.github.io), use base: '/'
// For project pages (username.github.io/repo-name), use base: '/repo-name/'
function getBasePath() {
  // Allow manual override via VITE_BASE_PATH
  if (process.env.VITE_BASE_PATH) {
    return process.env.VITE_BASE_PATH
  }
  
  // In production (GitHub Pages deployment)
  if (process.env.NODE_ENV === 'production' || process.env.GITHUB_ACTIONS) {
    const repo = process.env.GITHUB_REPOSITORY
    if (repo) {
      // Extract repo name from "username/repo-name" format
      const repoName = repo.includes('/') ? repo.split('/')[1] : repo
      // If repo name is the same as username (user page), use root
      // Otherwise use repo name as base path
      const username = repo.includes('/') ? repo.split('/')[0] : ''
      if (repoName === `${username}.github.io`) {
        return '/'
      }
      return `/${repoName}/`
    }
  }
  return '/'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: getBasePath(),
})
