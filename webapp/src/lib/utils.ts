/**
 * Return a copy of the object, filtered to omit the blacklisted array of valid keys
 * @param obj
 * @param keys
 */
export function omit(
  obj: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> {
  const newKeys = Object.keys(obj).filter(key => !keys.includes(key))
  return pick(obj, newKeys)
}

export function reset(
  obj: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> {
  return keys.reduce((newObj, key) => ({
    ...newObj,
    [key]: undefined
  }), obj)
}

/**
 * Return a copy of the object, filtered to only have values for the whitelisted array of valid keys
 * @param obj
 * @param keys
 */
export function pick(
  obj: Record<string, unknown>,
  keys: string[]
): Record<string, unknown> {
  const result = {} as Record<string, unknown>

  for (const key of keys) {
    if (obj.hasOwnProperty(key)) {
      result[key] = obj[key]
    }
  }

  return result
}
