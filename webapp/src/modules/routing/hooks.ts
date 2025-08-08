import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { matchPath, useLocation } from 'react-router-dom'
import { AssetType } from '../asset/types'
import { getView } from '../ui/browse/selectors'
import { locations } from './locations'
import { PageName } from './types'
import {
  getCurrentBrowseOptions,
  getIsMapFromSearchParameters,
  getPaginationParamsFromUrl,
  getSortByOptionsFromUrl,
  getWithCardFromSearchParameters
} from './url-parser'

export const useGetNFTAddressAndTokenIdFromCurrentUrl = (): { contractAddress: string | null; tokenId: string | null } => {
  const location = useLocation()
  return getNFTAddressAndTokenIdFromCurrentUrlPath(location.pathname)
}

export const getNFTAddressAndTokenIdFromCurrentUrlPath = (
  currentPathname: string
): { contractAddress: string | null; tokenId: string | null } => {
  const match = matchPath<{ contractAddress: string; tokenId: string }>(currentPathname, {
    path: locations.nft(':contractAddress', ':tokenId')
  })
  return { contractAddress: match?.params.contractAddress || null, tokenId: match?.params.tokenId || null }
}

export const useGetItemAddressAndTokenIdFromCurrentUrl = (): { contractAddress: string | null; tokenId: string | null } => {
  const location = useLocation()
  const match = matchPath<{ contractAddress: string; tokenId: string }>(location.pathname, {
    path: locations.item(':contractAddress', ':tokenId')
  })

  return { contractAddress: match?.params.contractAddress || null, tokenId: match?.params.tokenId || null }
}

export const getListIdFromCurrentUrlPath = (currentPathname: string): string | null => {
  const match = matchPath<{ listId: string }>(currentPathname, {
    path: locations.list(':listId')
  })
  return match?.params.listId || null
}

export const useGetCollectionAddressFromCurrentUrl = (): string | null => {
  const location = useLocation()
  const match = matchPath<{ contractAddress: string }>(location.pathname, {
    path: locations.collection(':contractAddress')
  })
  return match?.params.contractAddress || null
}

export const getUserAddressFromUrlPath = (currentPathname: string): string | null => {
  const match = matchPath<{ address: string }>(currentPathname, {
    path: locations.account(':address')
  })
  return match?.params.address || null
}

export const useGetUserAddressFromCurrentUrl = (): string | null => {
  const location = useLocation()
  return getUserAddressFromUrlPath(location.pathname)
}

export const useGetBrowseOptions = () => {
  const { search, pathname } = useLocation()
  const view = useSelector(getView)
  return useMemo(() => getCurrentBrowseOptions(search, pathname, view), [search, pathname, view])
}

export const useGetSortByOptionsFromCurrentUrl = () => {
  const { search, pathname } = useLocation()
  const view = useSelector(getView)
  return useMemo(() => getSortByOptionsFromUrl(search, pathname, view), [search, pathname, view])
}

const buildExactMatchProps = (path: string) => {
  return { path, exact: true }
}

export const useGetPageName = () => {
  const { pathname } = useLocation()
  return useMemo(() => {
    if (pathname === '/') {
      return PageName.HOME
    } else if (matchPath(pathname, buildExactMatchProps(locations.manage('anAddress', 'anId')))) {
      return PageName.MANAGE_NFT
    } else if (matchPath(pathname, buildExactMatchProps(locations.buyStatusPage(AssetType.NFT)))) {
      return PageName.BUY_NFT_STATUS
    } else if (matchPath(pathname, locations.buyStatusPage(AssetType.ITEM))) {
      return PageName.BUY_ITEM_STATUS
    } else if (matchPath(pathname, locations.cancel())) {
      return PageName.CANCEL_NFT_SALE
    } else if (matchPath(pathname, locations.transfer())) {
      return PageName.TRANSFER_NFT
    } else if (matchPath(pathname, locations.bid())) {
      return PageName.BID_NFT
    } else if (matchPath(pathname, locations.signIn())) {
      return PageName.SIGN_IN
    } else if (matchPath(pathname, locations.settings())) {
      return PageName.SETTINGS
    } else if (matchPath(pathname, locations.lands())) {
      return PageName.LANDS
    } else if (matchPath(pathname, locations.names())) {
      return PageName.NAMES
    } else if (matchPath(pathname, locations.collection())) {
      return PageName.COLLECTION
    } else if (matchPath(pathname, locations.browse())) {
      return PageName.BROWSE
    } else if (matchPath(pathname, locations.campaign())) {
      return PageName.CAMPAIGN
    } else if (matchPath(pathname, locations.currentAccount())) {
      return PageName.ACCOUNT
    } else if (matchPath(pathname, locations.list())) {
      return PageName.LIST
    } else if (matchPath(pathname, locations.lists())) {
      return PageName.LISTS
    } else if (matchPath(pathname, locations.account())) {
      return PageName.ACCOUNTS
    } else if (matchPath(pathname, locations.nft())) {
      return PageName.NFT_DETAIL
    } else if (matchPath(pathname, locations.item())) {
      return PageName.ITEM_DETAIL
    } else if (matchPath(pathname, locations.parcel())) {
      return PageName.PARCEL_DETAIL
    } else if (matchPath(pathname, locations.estate())) {
      return PageName.ESTATE_DETAIL
    } else if (matchPath(pathname, locations.activity())) {
      return PageName.ACTIVITY
    }
    throw new Error('Unknown page')
  }, [pathname])
}

export const useGetIsMapFromSearchParameters = () => {
  const { search } = useLocation()
  return getIsMapFromSearchParameters(search)
}

export const useGetIsBuyWithCardPageFromCurrentUrl = () => {
  const { search } = useLocation()
  return getWithCardFromSearchParameters(search)
}

export const useGetPaginationParamsFromCurrentUrl = () => {
  const { search, pathname } = useLocation()
  const view = useSelector(getView)
  return useMemo(() => getPaginationParamsFromUrl(search, pathname, view), [search, pathname, view])
}
