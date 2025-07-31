import { matchPath, useLocation } from 'react-router-dom'
import { locations } from './locations'

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
