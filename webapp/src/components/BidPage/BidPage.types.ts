import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Authorizations } from '../../modules/authorization/types'
import {
  placeBidRequest,
  PlaceBidRequestAction
} from '../../modules/bid/actions'

export type Props = {
  authorizations: Authorizations
  onPlaceBid: typeof placeBidRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'authorizations'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onPlaceBid'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | PlaceBidRequestAction
>
