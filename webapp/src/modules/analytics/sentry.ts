import { init, BrowserTracing, Replay } from '@sentry/react'

init({
  dsn: '<your_DSN_key>',
  integrations: [new BrowserTracing(), new Replay()],

  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  tracesSampleRate: 1.0,

  // Capture Replay for 10% of all sessions,
  // plus for 100% of sessions with an error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
})
