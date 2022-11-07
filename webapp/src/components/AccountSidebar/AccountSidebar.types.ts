import { Dispatch } from 'redux'
import { browse, BrowseAction } from '../../modules/routing/actions'

export type Props = {
  section: string
  address: string
  isCurrentAccount?: boolean
  onBrowse: typeof browse
  isRentalsEnabled: boolean
}

export type MapStateProps = Pick<Props, 'section' | 'isRentalsEnabled'>
export type MapDispatchProps = Pick<Props, 'onBrowse'>
export type MapDispatch = Dispatch<BrowseAction>
