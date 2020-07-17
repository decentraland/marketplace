import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Proximity } from './types'
import { NFT } from '../nft/types'
import { getId } from '../nft/parcel/utils'

export const getDistanceText = (distance: number) =>
  distance === 0
    ? t('proximity.adjacent')
    : t('proximity.distance', { distance })

export const getParcelProximity = (
  nft: NFT,
  proximities: Record<string, Proximity>
) => {
  if (!nft.parcel) return
  const id = getId(nft.parcel.x, nft.parcel.y)
  return proximities[id]
}

export const getEstateProximity = (
  nft: NFT,
  proximities: Record<string, Proximity>
) => {
  let estateProximity: Proximity | undefined
  if (nft.estate) {
    for (const { x, y } of nft.estate.parcels) {
      const id = getId(x, y)
      const parcelProximity = proximities[id]
      if (parcelProximity) {
        if (estateProximity === undefined) {
          estateProximity = {}
        }
        if (
          parcelProximity.district !== undefined &&
          (estateProximity.district === undefined ||
            parcelProximity.district < estateProximity.district)
        ) {
          estateProximity.district = parcelProximity.district
        }
        if (
          parcelProximity.plaza !== undefined &&
          (estateProximity.plaza === undefined ||
            parcelProximity.plaza < estateProximity.plaza)
        ) {
          estateProximity.plaza = parcelProximity.plaza
        }
        if (
          parcelProximity.road !== undefined &&
          (estateProximity.road === undefined ||
            parcelProximity.road < estateProximity.road)
        ) {
          estateProximity.road = parcelProximity.road
        }
      }
    }
  }
  return estateProximity
}
