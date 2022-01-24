export const environment = process.env.REACT_APP_ENVIRONMENT
export const isDevelopment =
  window.location.hostname === 'localhost' || environment === 'development'
export const peerUrl = process.env.REACT_APP_PEER_URL!
export const builderUrl = process.env.REACT_APP_BUILDER_URL
