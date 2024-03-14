import { AssetType } from '../../../modules/asset/types'
import { BrowseOptions } from '../../../modules/routing/types'
import { Section } from '../../../modules/vendor/decentraland'

export type Props = {
  section: Section
  address: string
  assetType: AssetType
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<Props, 'assetType'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
