import { useMemo } from 'react'
import { NFTCategory } from '../vendor/decentraland/nft/types'
import { NFT } from '../nft/types'
import { getParcelProximity, getEstateProximity } from './utils'
import { Proximity } from './types'

export const useProximity = (
  nft: NFT,
  proximities: Record<string, Proximity>
) =>
  useMemo(() => {
    switch (nft.category) {
      case NFTCategory.PARCEL:
        return getParcelProximity(nft, proximities)
      case NFTCategory.ESTATE:
        return getEstateProximity(nft, proximities)
      default:
        return
    }
  }, [nft, proximities])
