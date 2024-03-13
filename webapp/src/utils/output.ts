export const convertToOutputString = (input: unknown): string => {
  return typeof input === 'string' || typeof input === 'number' ? input.toString() : 'Unknown'
}
