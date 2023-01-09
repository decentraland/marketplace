import { NFTCategory } from '@dcl/schemas'
import { browse } from '../../../modules/routing/actions'
import { BrowseOptions } from '../../../modules/routing/types'
import { LANDFilters } from '../../Vendor/decentraland/types'

export type Props = {
  category?: NFTCategory
  landStatus: LANDFilters
  browseOptions: BrowseOptions
  isLandSection: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<
  Props,
  'browseOptions' | 'isLandSection' | 'category' | 'landStatus'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
