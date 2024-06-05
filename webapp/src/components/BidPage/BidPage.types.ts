import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { clearBidError, ClearBidErrorAction, placeBidRequest, PlaceBidRequestAction } from '../../modules/bid/actions'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  authorizations: Authorization[]
  isPlacingBid: boolean
  onPlaceBid: typeof placeBidRequest
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onClearBidError: typeof clearBidError
}

export type MapStateProps = Pick<Props, 'isPlacingBid' | 'getContract'>
export type MapDispatchProps = Pick<Props, 'onPlaceBid' | 'onClearBidError'>
export type MapDispatch = Dispatch<PlaceBidRequestAction | ClearBidErrorAction>
