import { useMemo } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { NFT } from '../nft/types'
import { VendorName } from '../vendor/types'
import { Proximity } from './types'
import { getParcelProximity, getEstateProximity } from './utils'

export const useProximity = (nft: NFT<VendorName.DECENTRALAND>, proximities: Record<string, Proximity>) =>
  useMemo(() => {
    switch (nft.category) {
      case NFTCategory.PARCEL:
        return getParcelProximity(nft.data.parcel, proximities)
      case NFTCategory.ESTATE:
        return getEstateProximity(nft.data.estate, proximities)
      default:
        return
    }
  }, [nft, proximities])
