import { getSearchParams, SearchOptions } from './search'

export const locations = {
  signIn: () => '/sign-in',
  atlas: () => '/atlas',
  market: (options?: SearchOptions) => {
    const params = getSearchParams(options)
    return params ? `/market?${params.toString()}` : '/market'
  },
  currentAccount: (options?: SearchOptions) => {
    const params = getSearchParams(options)
    return params ? `/account?${params.toString()}` : '/account'
  },
  account: (address: string, options?: SearchOptions) => {
    const params = getSearchParams(options)
    return params
      ? `/accounts/${address}?${params.toString()}`
      : `/accounts/${address}`
  },
  ntf: (contract: string, id: string) => `/contracts/${contract}/id/${id}`
}
