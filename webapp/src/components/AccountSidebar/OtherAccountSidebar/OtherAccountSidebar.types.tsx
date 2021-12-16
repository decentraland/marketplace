import { AssetType } from '../../../modules/asset/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  section: string
  assetType: string
  onBrowse: (vendor: VendorName, section: string, assetType: AssetType) => void
}

export type MapStateProps = Pick<Props, 'assetType'>
