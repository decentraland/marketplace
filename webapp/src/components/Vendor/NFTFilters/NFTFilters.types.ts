import { Dispatch } from 'redux'

import {
  browseNFTs,
  BrowseActionNFTsAction
} from '../../../modules/routing/actions'

export type Props = {
  vendor?: string
  onBrowse: typeof browseNFTs
}

export type MapStateProps = Pick<Props, 'vendor'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseActionNFTsAction>
