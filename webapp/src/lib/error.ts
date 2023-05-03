export function isErrorWithMessage(error: unknown): error is Error {
  return (
    error !== undefined &&
    error !== null &&
    typeof error === 'object' &&
    'message' in error
  )
}

export function isAPIError(
  error: unknown
): error is Error & { status: number } {
  return isErrorWithMessage(error) && 'status' in error
}
