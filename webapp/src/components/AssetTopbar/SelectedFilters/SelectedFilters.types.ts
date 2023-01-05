import { browse } from '../../../modules/routing/actions'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = {
  browseOptions: BrowseOptions
  isLandSection: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<Props, 'browseOptions' | 'isLandSection'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
