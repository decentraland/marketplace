import { BodyShape } from '@dcl/schemas'
import { AssetType } from '../../modules/asset/types'
import { Section } from '../../modules/vendor/decentraland'

export type Props = {
  bodyShapes: BodyShape[]
  withText: boolean
  assetType: AssetType
  section: Section
}

export type OwnProps = Pick<Props, 'bodyShapes' | 'assetType' | 'section'>
