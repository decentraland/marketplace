import { getSearchParams, SearchOptions } from './search'

export const locations = {
  root: () => '/',
  signIn: () => '/sign-in',
  atlas: () => '/atlas',
  settings: () => '/settings',
  browse: (options?: SearchOptions) => {
    const params = getSearchParams(options)
    return params ? `/browse?${params.toString()}` : '/browse'
  },
  currentAccount: (options?: SearchOptions) => {
    const params = getSearchParams(options)
    return params ? `/account?${params.toString()}` : '/account'
  },
  account: (address: string = ':address', options?: SearchOptions) => {
    const params = getSearchParams(options)
    return params
      ? `/accounts/${address}?${params.toString()}`
      : `/accounts/${address}`
  },
  ntf: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}`,
  sell: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}/sell`,
  buy: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}/buy`,
  cancel: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}/cancel`,
  transfer: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}/transfer`,
  activity: () => `/activity`
}
