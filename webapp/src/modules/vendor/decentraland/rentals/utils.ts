export function objectToURLSearchParams(params: Record<string, string | number | boolean | string[] | number[] | boolean[]> = {}) {
  const queryParams = new URLSearchParams()
  Object.entries(params)
    .filter(([_key, value]) => Array.isArray(value) || typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number')
    .forEach(([key, value]) => {
      if (Array.isArray(value)) {
        const arrayValues = value.filter(nestedValue => nestedValue !== undefined && nestedValue !== null && !Array.isArray(nestedValue))
        arrayValues.forEach(arrayParam => {
          queryParams.append(key, arrayParam.toString())
        })
      } else if (value !== undefined || value !== null) {
        queryParams.append(key, value.toString())
      }
    })

  return queryParams
}
