import { NFTCategory } from '@dcl/schemas'
import { browse } from '../../../modules/routing/actions'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  category?: NFTCategory
  browseOptions: BrowseOptions
  isLandSection: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<
  Props,
  'browseOptions' | 'isLandSection' | 'category'
>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
