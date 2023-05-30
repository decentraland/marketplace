import { Dispatch } from 'redux'

import { browse, BrowseAction } from '../../../modules/routing/actions'
import { Section } from '../../../modules/vendor/routing/types'

export type Props = {
  vendor?: string
  section: string
  sections?: Section[]
  onBrowse: typeof browse
  search: string
}

export type MapStateProps = Pick<Props, 'vendor' | 'section' | 'search'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
export type OwnProps = Partial<Pick<Props, 'section'>>
