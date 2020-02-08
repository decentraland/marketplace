import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  placeBidRequest,
  PlaceBidRequestAction
} from '../../modules/bid/actions'

export type Props = {
  onPlaceBid: typeof placeBidRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onPlaceBid'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | PlaceBidRequestAction
>
