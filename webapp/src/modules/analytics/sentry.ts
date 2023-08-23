import { init, BrowserTracing, Replay } from '@sentry/react'
import { config } from '../../config'

init({
  environment: config.get('ENVIRONMENT'),
  release: `${process.env.REACT_APP_WEBSITE_NAME}@${process.env.REACT_APP_WEBSITE_VERSION}`,
  dsn: config.get('SENTRY_DSN'),
  integrations: [
    new BrowserTracing(),
    new Replay()
  ],
  // Performance Monitoring
  tracesSampleRate: 0.001, // Capture 1% of the transactions
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0 // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
})
