import { Dispatch } from 'redux'
import { NFT } from '../../../modules/nft/types'
import { Bid } from '../../../modules/bid/types'
import {
  fetchBidsByNFTRequest,
  FetchBidsByNFTRequestAction
} from '../../../modules/bid/actions'

export type Props = {
  nft: NFT
  bids: Bid[]
  onFetchBids: typeof fetchBidsByNFTRequest
}

export type MapStateProps = Pick<Props, 'bids'>
export type MapDispatchProps = Pick<Props, 'onFetchBids'>
export type MapDispatch = Dispatch<FetchBidsByNFTRequestAction>
export type OwnProps = Pick<Props, 'nft'>
