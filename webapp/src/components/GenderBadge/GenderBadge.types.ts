import { BodyShape } from '@dcl/schemas'
import { AssetType } from '../../modules/asset/types'

export type Props = {
  bodyShapes: BodyShape[]
  withText: boolean
  assetType: AssetType
  onClick: () => void
}

export type MapDispatchProps = Pick<Props, 'onClick'>
export type OwnProps = Pick<Props, 'bodyShapes' | 'assetType'>
