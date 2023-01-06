import { collectionAPI } from '../../../modules/vendor/decentraland'
import { GenderFilterOption, WearableGender } from '@dcl/schemas'
import {
  AVAILABLE_FOR_FEMALE,
  AVAILABLE_FOR_MALE,
  getBodyShapeValue
} from '../../AssetFilters/BodyShapeFilter/utils'

export async function getCollectionByAddress(address: string) {
  const { data } = await collectionAPI.fetch({
    contractAddress: address
  })

  return data[0]
}

export function getGenderFilterLabel(
  bodyShapes: (WearableGender | GenderFilterOption)[] | undefined
): string {
  const bodyShape = getBodyShapeValue(bodyShapes)

  if (!bodyShape) {
    return 'nft_filters.body_shapes.all_items'
  }

  const labels: Record<string, string> = {
    [AVAILABLE_FOR_FEMALE]: 'nft_filters.body_shapes.available_for_female',
    [AVAILABLE_FOR_MALE]: 'nft_filters.body_shapes.available_for_male'
  }

  return labels[bodyShape]
}
