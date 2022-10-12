import { Dispatch } from 'redux'

import { browse, BrowseAction } from '../../../modules/routing/actions'

export type Props = {
  vendor?: string
  onBrowse: typeof browse
  isMap: boolean
  contracts?: string[]
}

export type MapStateProps = Pick<Props, 'vendor'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
export type OwnProps = Pick<Props, 'isMap' | 'contracts'>
