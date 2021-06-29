import { Dispatch } from 'redux'
import { Section } from '../../modules/routing/types'
import {
  browseNFTs,
  BrowseActionNFTsAction
} from '../../modules/routing/actions'

export type Props = {
  section: Section
  address: string
  onBrowse: typeof browseNFTs
}

export type MapStateProps = Pick<Props, 'section'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseActionNFTsAction>
