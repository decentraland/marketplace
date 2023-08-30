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
  replaysSessionSampleRate: 0.01, // This sets the sample rate at 1%.
  replaysOnErrorSampleRate: 0.01
})
