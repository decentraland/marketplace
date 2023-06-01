export function getParameter<T>(
  values: T[],
  parameterValue: string | null | undefined,
  defaultValue: T
): T {
  if (
    parameterValue === undefined ||
    parameterValue === null ||
    !values.includes(parameterValue as T)
  ) {
    return defaultValue
  }

  return parameterValue as T
}
