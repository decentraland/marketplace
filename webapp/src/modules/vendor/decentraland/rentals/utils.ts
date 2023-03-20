export function objectToURLSearchParams(params: Record<string, any> = {}) {
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach((key) => {
    if (Array.isArray(params[key])) {
      params[key].forEach((arrayParam: string) => {
        queryParams.append(key, arrayParam.toString())
      })
    } else if (params[key] !== undefined) {
      queryParams.append(key, params[key])
    }
  })

  return queryParams
}
