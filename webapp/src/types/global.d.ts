export {}

declare global {
  var Rollbar: {
    error: (message: string) => void
  }
}
