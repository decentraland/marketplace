import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { clearBidError, ClearBidErrorAction, placeBidRequest, PlaceBidRequestAction } from '../../modules/bid/actions'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  authorizations: Authorization[]
  isPlacingBid: boolean
  onPlaceBid: typeof placeBidRequest
  onNavigate: (path: string) => void
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onClearBidError: typeof clearBidError
}

export type MapStateProps = Pick<Props, 'isPlacingBid' | 'getContract'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onPlaceBid' | 'onClearBidError'>
export type MapDispatch = Dispatch<CallHistoryMethodAction | PlaceBidRequestAction | ClearBidErrorAction>
