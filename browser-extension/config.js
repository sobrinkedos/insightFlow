// Configuration for InsightShare Extension

// Change this to your deployed URL or use localhost for development
const INSIGHTSHARE_URL = 'http://localhost:5174';

// For production, uncomment the line below and comment the line above:
// const INSIGHTSHARE_URL = 'https://your-deployed-site.vercel.app';

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INSIGHTSHARE_URL };
}
