import { CallHistoryMethodAction } from 'connected-react-router'
import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { placeBidRequest, PlaceBidRequestAction } from '../../modules/bid/actions'
import { getContract } from '../../modules/contract/selectors'
import { Contract } from '../../modules/vendor/services'

export type Props = {
  authorizations: Authorization[]
  isPlacingBid: boolean
  onPlaceBid: typeof placeBidRequest
  onNavigate: (path: string) => void
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
}

export type MapStateProps = Pick<Props, 'authorizations' | 'isPlacingBid' | 'getContract'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onPlaceBid'>
export type MapDispatch = Dispatch<CallHistoryMethodAction | PlaceBidRequestAction>
