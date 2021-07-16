import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getId } from '../nft/parcel/utils'
import { NFT } from '../nft/types'
import { Proximity } from './types'

export const getDistanceText = (distance: number) =>
  distance === 0
    ? t('proximity.adjacent')
    : t('proximity.distance', { distance })

export const getParcelProximity = (
  parcel: NFT['data']['parcel'],
  proximities: Record<string, Proximity>
) => {
  const id = getId(parcel!.x, parcel!.y)
  return proximities[id]
}

export const getEstateProximity = (
  estate: NFT['data']['estate'],
  proximities: Record<string, Proximity>
) => {
  let estateProximity: Proximity | undefined
  for (const { x, y } of estate!.parcels) {
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
  return estateProximity
}
