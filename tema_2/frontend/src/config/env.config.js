// src/config/env.config.js

// Environment-specific configuration
const config = {
  development: {
    API_URL: 'http://localhost:8080/api',
    AUTH_TOKEN_KEY: 'token',
    USER_DATA_KEY: 'user'
  },
  production: {
    API_URL: '/api', // This would be the relative path in production
    AUTH_TOKEN_KEY: 'token',
    USER_DATA_KEY: 'user'
  },
  test: {
    API_URL: 'http://localhost:8080/api',
    AUTH_TOKEN_KEY: 'token',
    USER_DATA_KEY: 'user'
  }
};

// Determine current environment
const env = process.env.NODE_ENV || 'development';

// Export configuration for the current environment
export default config[env];