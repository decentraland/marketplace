import { Dispatch } from 'redux'

import { browse, BrowseAction } from '../../../modules/routing/actions'

export type Props = {
  vendor?: string
  onBrowse: typeof browse
}

export type MapStateProps = Pick<Props, 'vendor'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
