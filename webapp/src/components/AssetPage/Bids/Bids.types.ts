import { Dispatch } from 'redux'
import { Bid } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'
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
