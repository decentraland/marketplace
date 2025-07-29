import { matchPath, useLocation } from 'react-router-dom'
import { locations } from './locations'

export const useGetCurrentNFTAddressAndTokenId = (): { contractAddress: string | null; tokenId: string | null } => {
  const location = useLocation()
  return getCurrentNFTAddressAndTokenId(location.pathname)
}

export const getCurrentNFTAddressAndTokenId = (currentPathname: string): { contractAddress: string | null; tokenId: string | null } => {
  const match = matchPath<{ contractAddress: string; tokenId: string }>(currentPathname, {
    path: locations.nft(':contractAddress', ':tokenId'),
    exact: true,
    strict: true
  })
  return { contractAddress: match?.params.contractAddress || null, tokenId: match?.params.tokenId || null }
}

export const useGetCurrentItemAddressAndTokenId = (): { contractAddress: string | null; tokenId: string | null } => {
  const location = useLocation()
  const match = matchPath<{ contractAddress: string; tokenId: string }>(location.pathname, {
    path: locations.item(':contractAddress', ':tokenId'),
    exact: true,
    strict: true
  })

  return { contractAddress: match?.params.contractAddress || null, tokenId: match?.params.tokenId || null }
}
