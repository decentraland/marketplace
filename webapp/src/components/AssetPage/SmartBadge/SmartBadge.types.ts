import { AssetType } from '../../../modules/asset/types'

export type Props = {
  assetType: AssetType
}

export type OwnProps = Pick<Props, 'assetType'>
