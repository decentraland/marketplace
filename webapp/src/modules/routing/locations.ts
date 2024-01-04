import { CAMPAIGN_TAG } from '../../components/Campaign/config'
import { AssetType } from '../asset/types'
import { View } from '../ui/types'
import { Section } from '../vendor/decentraland'
import { DEFAULT_FAVORITES_LIST_ID } from '../vendor/decentraland/favorites'
import { getSearchParams } from './search'
import { BrowseOptions } from './types'

export const locations = {
  root: () => '/',
  signIn: (redirectTo?: string) => {
    return `/sign-in${
      redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''
    }`
  },
  settings: () => '/settings',
  lands: (options?: BrowseOptions) => {
    const params = getSearchParams(options)
    return params ? `/lands?${params.toString()}` : '/lands'
  },
  names: (options?: BrowseOptions) => {
    const params = getSearchParams(options)
    return params ? `/names/browse?${params.toString()}` : '/names/browse'
  },
  claimName: () => {
    return '/names/claim'
  },
  collection: (contractAddress: string = ':contractAddress') =>
    `/collections/${contractAddress}`,
  browse: (options?: BrowseOptions) => {
    const params = getSearchParams(options)
    return params ? `/browse?${params.toString()}` : '/browse'
  },
  campaign: (options?: BrowseOptions) => {
    const params = getSearchParams(options)
    const path = `/${CAMPAIGN_TAG}`
    return params ? `${path}?${params.toString()}` : path
  },
  currentAccount: (options?: BrowseOptions) => {
    const params = getSearchParams(options)
    return params ? `/account?${params.toString()}` : '/account'
  },
  defaultCurrentAccount: function() {
    return this.currentAccount({
      section: Section.COLLECTIONS
    })
  },
  lists: () => '/lists',
  list: (listId: string = ':listId', options?: BrowseOptions) => {
    const params = getSearchParams(options)
    return params ? `/lists/${listId}?${params.toString()}` : `/lists/${listId}`
  },
  defaultList: function() {
    return this.list(DEFAULT_FAVORITES_LIST_ID, {
      assetType: AssetType.ITEM,
      page: 1,
      section: Section.LISTS,
      view: View.LISTS
    })
  },
  account: (address: string = ':address', options?: BrowseOptions) => {
    const params = getSearchParams(options)
    return params
      ? `/accounts/${address}?${params.toString()}`
      : `/accounts/${address}`
  },
  nft: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}`,
  manage: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}/manage`,
  item: (
    contractAddress: string = ':contractAddress',
    itemId: string = ':itemId'
  ) => `/contracts/${contractAddress}/items/${itemId}`,
  parcel: (x: string = ':x', y: string = ':y') => `/parcels/${x}/${y}/detail`,
  estate: (estateId: string = ':estateId') => `/estates/${estateId}/detail`,
  buy: (
    type: AssetType,
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/${getResource(type)}/${tokenId}/buy`,
  buyWithCard: (
    type: AssetType,
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) =>
    `/contracts/${contractAddress}/${getResource(
      type
    )}/${tokenId}/buy?withCard=true`,
  buyStatusPage: (
    type: AssetType,
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) =>
    `/contracts/${contractAddress}/${getResource(type)}/${tokenId}/buy/status`,
  sell: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId',
    options?: {
      redirectTo?: string
    }
  ) =>
    `/contracts/${contractAddress}/tokens/${tokenId}/sell${
      options ? `?${new URLSearchParams(options).toString()}` : ''
    }`,
  cancel: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId',
    options?: {
      redirectTo?: string
    }
  ) =>
    `/contracts/${contractAddress}/tokens/${tokenId}/cancel${
      options ? `?${new URLSearchParams(options).toString()}` : ''
    }`,
  transfer: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}/transfer`,
  bid: (
    contractAddress: string = ':contractAddress',
    tokenId: string = ':tokenId'
  ) => `/contracts/${contractAddress}/tokens/${tokenId}/bid`,
  activity: () => `/activity`,
  success: (searchOptions?: {
    txHash: string
    tokenId: string
    assetType: string
    contractAddress: string
  }) =>
    `/success${
      searchOptions ? `?${new URLSearchParams(searchOptions).toString()}` : ''
    }`
}

function getResource(type: AssetType) {
  switch (type) {
    case AssetType.NFT:
      return 'tokens'
    case AssetType.ITEM:
      return 'items'
    default:
      throw new Error(`Invalid type ${type}`)
  }
}
