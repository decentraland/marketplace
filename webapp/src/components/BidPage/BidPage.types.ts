import { Dispatch } from 'redux'
import { AssetType } from '../../modules/asset/types'
import { clearBidError, ClearBidErrorAction, placeBidRequest, PlaceBidRequestAction } from '../../modules/bid/actions'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  type: AssetType
  isPlacingBid: boolean
  isBidsOffchainEnabled: boolean
  onPlaceBid: typeof placeBidRequest
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onClearBidError: typeof clearBidError
}

export type MapStateProps = Pick<Props, 'isPlacingBid' | 'getContract' | 'isBidsOffchainEnabled'>
export type MapDispatchProps = Pick<Props, 'onPlaceBid' | 'onClearBidError'>
export type MapDispatch = Dispatch<PlaceBidRequestAction | ClearBidErrorAction>
