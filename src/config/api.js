// Configuration for API endpoints
// This allows the API base URL to be set via environment variables

// Determine if we're running in a GitHub Codespace by checking the hostname
// GitHub Codespace hostnames follow the pattern: <codespace-name>-<port>.app.github.dev
const API_BASE_URL = (() => {
  const hostname = window.location.hostname;
  
  // Check if we're in a GitHub Codespace environment
  if (hostname.includes('.app.github.dev')) {
    // We're in a Codespace, construct the API URL using the same hostname but port 5000
    return `https://${hostname.replace(/(-\d+)\.app\.github\.dev$/, '-5000.app.github.dev')}/api`;
  }
  
  // Default to localhost for local development
  return 'http://localhost:5000/api';
})();

export { API_BASE_URL };