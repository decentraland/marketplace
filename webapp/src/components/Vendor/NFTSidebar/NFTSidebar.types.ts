import { Dispatch } from 'redux'

import { Section as DecentralandSection } from '../../../modules/vendor/decentraland/routing/types'
import { browseNFTs, BrowseNFTsAction } from '../../../modules/routing/actions'

export type Props = {
  vendor?: string
  section: string
  sections?: DecentralandSection[]
  onBrowse: typeof browseNFTs
}

export type MapStateProps = Pick<Props, 'vendor' | 'section'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseNFTsAction>
export type OwnProps = Partial<Pick<Props, 'section'>>
