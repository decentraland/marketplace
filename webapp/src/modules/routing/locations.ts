import { getSearchParams } from './search'
import { NFTBrowseOptions } from './types'

export const locations = {
  root: () => '/',
  signIn: () => '/sign-in',
  settings: () => '/settings',
  partners: () => '/partners',
  bids: () => '/bids',
  browse: (options?: NFTBrowseOptions) => {
    const params = getSearchParams(options)
    return params ? `/browse?${params.toString()}` : '/browse'
  },
  currentAccount: (options?: NFTBrowseOptions) => {
    const params = getSearchParams(options)
    return params ? `/account?${params.toString()}` : '/account'
  },
  account: (address: string = ':address', options?: NFTBrowseOptions) => {
    const params = getSearchParams(options)
    return params
      ? `/accounts/${address}?${params.toString()}`
      : `/accounts/${address}`
  },
  nft: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}`,
  item: (
    contractAddress: string = ':contractAddress',
    itemId: string = ':itemId'
  ) => `/contracts/${contractAddress}/items/${itemId}`,
  parcel: (x: string = ':x', y: string = ':y') => `/parcels/${x}/${y}/detail`,
  estate: (estateId: string = ':estateId') => `/estates/${estateId}/detail`,
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
  bid: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}/bid`,
  activity: () => `/activity`
}
