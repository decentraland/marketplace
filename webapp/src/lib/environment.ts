export const environment = process.env.REACT_APP_ENVIRONMENT
export const isDevelopment =
  window.location.hostname === 'localhost' || environment === 'development'
