import { Dispatch } from 'redux'

import { browseNFTs, BrowseNFTsAction } from '../../../modules/routing/actions'

export type Props = {
  vendor?: string
  onBrowse: typeof browseNFTs
  isMap: boolean
}

export type MapStateProps = Pick<Props, 'vendor'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseNFTsAction>
export type OwnProps = Pick<Props, 'isMap'>
