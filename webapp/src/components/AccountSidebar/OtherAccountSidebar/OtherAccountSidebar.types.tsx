import { AssetType } from '../../../modules/asset/types'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  section: string
  address: string
  assetType: AssetType
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<Props, 'assetType'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
