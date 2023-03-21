import { Dispatch } from 'redux'
import { browse, BrowseAction } from '../../../modules/routing/actions'

export type Props = {
  onlyOnSale?: boolean
  onlyOnRent?: boolean
  isMapViewFiltersEnabled?: boolean
  showOwned?: boolean
  onBrowse: typeof browse
}

export type MapStateProps = Pick<
  Props,
  'onlyOnSale' | 'onlyOnRent' | 'isMapViewFiltersEnabled'
>

export type MapDispatchProps = Pick<Props, 'onBrowse'>

export type MapDispatch = Dispatch<BrowseAction>
