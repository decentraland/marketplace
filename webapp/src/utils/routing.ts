import { matchPath } from 'react-router-dom'
import { locations } from '../modules/routing/locations'

export function matchAppRoute<T extends Record<string, string>>(path: string, route: string) {
  return matchPath<T>(path, { path: route, strict: true, exact: true })
}

export const getAccountUrlParams = () => matchAppRoute<{ address: string }>(window.location.pathname, locations.account())?.params
export const getAccountAddressFromUrl = () => getAccountUrlParams()?.address.toLowerCase()

export const getCollectionDetailUrlParams = () =>
  matchAppRoute<{ contractAddress: string }>(window.location.pathname, locations.collection())?.params
export const getCollectionContractAddressFromUrl = () => getCollectionDetailUrlParams()?.contractAddress.toLowerCase() || null

export const getItemUrlParams = () =>
  matchAppRoute<{ contractAddress: string; tokenId: string }>(window.location.pathname, locations.item())?.params
export const getItemContractAddressFromUrl = () => getItemUrlParams()?.contractAddress.toLowerCase() || null
export const getItemTokenIdFromUrl = () => getItemUrlParams()?.tokenId || null

export const getNFTUrlParams = () =>
  matchAppRoute<{ contractAddress: string; tokenId: string }>(window.location.pathname, locations.nft())?.params
export const getNFTContractAddressFromUrl = () => getNFTUrlParams()?.contractAddress.toLowerCase() || null
export const getNFTTokenIdFromUrl = () => getNFTUrlParams()?.tokenId || null
