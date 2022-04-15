import { BodyShape } from '@dcl/schemas'
import { Section } from '../../modules/vendor/decentraland'
import { AssetType } from '../../modules/asset/types'

export type Props = {
  bodyShapes: BodyShape[]
  withText: boolean
  assetType: AssetType
  section: Section
  onClick: () => void
}

export type MapDispatchProps = Pick<Props, 'onClick'>
export type OwnProps = Pick<Props, 'bodyShapes' | 'assetType' | 'section'>
