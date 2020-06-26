import { useCallback } from 'react'
import { useSelector } from 'react-redux'

import {
  getSearchCategory,
  getSearchWearableCategory,
  Section
} from '../../modules/routing/search'
import {
  getUISection,
  getUIWearableRarities,
  getUIWearableGenders,
  getUIContracts
} from '../../modules/ui/selectors'
import { NFTCategory } from '../../modules/nft/types'
import { Vendors } from './types'

export const useFilters = (vendor: Vendors) => {
  const section = useSelector(getUISection)

  const wearableRarities = useSelector(getUIWearableRarities)
  const wearableGenders = useSelector(getUIWearableGenders)
  const contracts = useSelector(getUIContracts)

  return useCallback(() => {
    switch (vendor) {
      case Vendors.DECENTRALAND:
        const isLand = section === Section.LAND
        const isWearableHead = section === Section.WEARABLES_HEAD
        const isWearableAccessory = section === Section.WEARABLES_ACCESORIES

        const category = getSearchCategory(section)
        const wearableCategory =
          !isWearableAccessory && category === NFTCategory.WEARABLE
            ? getSearchWearableCategory(section)
            : undefined

        return {
          isLand,
          isWearableHead,
          isWearableAccessory,
          wearableCategory,
          wearableRarities,
          wearableGenders,
          contracts
        }
      case Vendors.SUPER_RARE:
      default:
        return {}
    }
  }, [vendor, section, wearableRarities, wearableGenders, contracts])
}
