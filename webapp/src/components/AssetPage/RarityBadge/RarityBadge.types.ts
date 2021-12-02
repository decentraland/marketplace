import { Rarity } from '@dcl/schemas'
import { AssetType } from '../../../modules/asset/types'

export type Props = {
  rarity: Rarity
  assetType: AssetType
  onClick: () => void
}

export type MapDispatchProps = Pick<Props, 'onClick'>
export type OwnProps = Pick<Props, 'rarity' | 'assetType'>
