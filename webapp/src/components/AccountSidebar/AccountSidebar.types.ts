import { Dispatch } from 'redux'
import { browse, BrowseAction } from '../../modules/routing/actions'

export type Props = {
  section: string
  address: string
  onBrowse: typeof browse
}

export type MapStateProps = Pick<Props, 'section'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
