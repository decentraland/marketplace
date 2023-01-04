import { GenderFilterOption, WearableGender } from '@dcl/schemas'
import { collectionAPI } from '../../../../../modules/vendor/decentraland'

export async function getCollectionByAddress(
  address: string,
) {
  const { data } = await collectionAPI.fetch({
    contractAddress: address,
  })

  return data[0]
}

export function getGenderFilterLabel(bodyShapes: (WearableGender | GenderFilterOption)[] | undefined): string {
  const hasUnisex = bodyShapes?.includes(GenderFilterOption.UNISEX)
  const hasMale = bodyShapes?.includes(GenderFilterOption.MALE)
  const hasFemale = bodyShapes?.includes(GenderFilterOption.FEMALE)

  if (hasUnisex && hasMale) {
    return 'nft_filters.body_shapes.available_for_male'
  }

  if (hasUnisex && hasFemale) {
    return 'nft_filters.body_shapes.available_for_female'
  }

  return 'nft_filters.body_shapes.all_items'
}
