import { Dispatch } from 'redux'
import { browseNFTs, BrowseNFTsAction } from '../../modules/routing/actions'

export type Props = {
  section: string
  address: string
  onBrowse: typeof browseNFTs
}

export type MapStateProps = Pick<Props, 'section'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseNFTsAction>
