export const environment = process.env.REACT_APP_ENVIRONMENT
export const isDevelopment =
  window.location.hostname === 'localhost' || environment === 'development'
export const isStaging = environment === 'staging'
export const isProduction = environment === 'production'
