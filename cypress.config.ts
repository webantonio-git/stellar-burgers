import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4000',
    video: false,
    chromeWebSecurity: false,              
    env: {
      BURGER_API_URL: 'https://norma.nomoreparties.space/api'
    },
    setupNodeEvents(on, config) {
      return config;
    }
  }
});
