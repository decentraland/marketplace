import { AssetType } from '../../../modules/asset/types'

export type Props = {
  assetType: AssetType
  clickable?: boolean
}

export type OwnProps = Pick<Props, 'assetType'>
