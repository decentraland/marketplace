import { EmoteCategory, WearableCategory } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'

export type Props = {
  category: WearableCategory | EmoteCategory
  assetType: AssetType
}

export type OwnProps = Pick<Props, 'category' | 'assetType'>
