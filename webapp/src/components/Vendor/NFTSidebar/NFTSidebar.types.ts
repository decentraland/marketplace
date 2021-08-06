import { Dispatch } from 'redux'

import { Section as DecentralandSection } from '../../../modules/vendor/decentraland/routing/types'
import { browse, BrowseAction } from '../../../modules/routing/actions'

export type Props = {
  vendor?: string
  section: string
  sections?: DecentralandSection[]
  onBrowse: typeof browse
}

export type MapStateProps = Pick<Props, 'vendor' | 'section'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
export type OwnProps = Partial<Pick<Props, 'section'>>
