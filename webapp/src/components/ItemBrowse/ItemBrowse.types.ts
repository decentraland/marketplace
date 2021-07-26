import { Dispatch } from 'redux'

import { View } from '../../modules/ui/types'
import { setView, SetViewAction } from '../../modules/ui/actions'
import {
  fetchItemsFromRoute,
  FetchItemsFromRouteAction
} from '../../modules/routing/actions'

export type Props = {
  view: View
  viewInState?: View // This is used to know when the view prop has been set in the app state
  address?: string
  isLoading: boolean
  onSetView: typeof setView
  onFetchItemsFromRoute: typeof fetchItemsFromRoute
  isOnSale?: boolean
}

export type MapStateProps = Pick<
  Props,
  'isLoading' | 'isOnSale' | 'viewInState'
>
export type MapDispatchProps = Pick<
  Props,
  'onSetView' | 'onFetchItemsFromRoute'
>
export type MapDispatch = Dispatch<SetViewAction | FetchItemsFromRouteAction>
export type OwnProps = Pick<Props, 'address'>
