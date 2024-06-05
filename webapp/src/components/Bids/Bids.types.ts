import { Dispatch } from 'redux'
import { Bid } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { fetchBidsByAddressRequest, FetchBidsByAddressRequestAction } from '../../modules/bid/actions'

export type Props = {
  wallet: Wallet | null
  sellerBids: Bid[]
  bidderBids: Bid[]
  archivedBidIds: string[]
  isConnecting: boolean
  isLoading: boolean
  onFetchBids: typeof fetchBidsByAddressRequest
}

export type MapStateProps = Pick<Props, 'wallet' | 'sellerBids' | 'bidderBids' | 'archivedBidIds' | 'isConnecting' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onFetchBids'>
export type MapDispatch = Dispatch<FetchBidsByAddressRequestAction>
