import { AssetType } from '../../../modules/asset/types'

export type Props =
  | {
      assetType?: AssetType
      clickable?: false
    }
  | {
      assetType: AssetType
      clickable: true
    }

export type OwnProps = Pick<Props, 'assetType'>
