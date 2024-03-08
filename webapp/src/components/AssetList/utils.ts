import { matchPath } from 'react-router-dom'
import { locations } from '../../modules/routing/locations'

function matchAppRoute<T extends Record<string, string>>(path: string, route: string) {
  return matchPath<T>(path, { path: route, strict: true, exact: true })
}

export function getLastVisitedElementId(currentLocation: string, lastVisitedLocation: string) {
  const matchLands = matchAppRoute(currentLocation, locations.lands())
  const matchCollectibles = matchAppRoute(currentLocation, locations.browse())
  const previousMatchNfts = matchAppRoute<{ contractAddress: string; tokenId: string }>(lastVisitedLocation, locations.nft())

  if ((matchLands && previousMatchNfts) || (matchCollectibles && previousMatchNfts)) {
    return `${previousMatchNfts.params.contractAddress}-${previousMatchNfts.params.tokenId}`
  }

  const previousMatchItems = matchAppRoute<{ contractAddress: string; itemId: string }>(lastVisitedLocation, locations.item())

  if (matchCollectibles && previousMatchItems) {
    return `${previousMatchItems.params.contractAddress}-${previousMatchItems.params.itemId}`
  }

  return null
}
