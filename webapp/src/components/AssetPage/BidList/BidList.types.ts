import { Dispatch } from 'redux'
import { Bid } from '@dcl/schemas'
import { fetchBidsByNFTRequest, FetchBidsByNFTRequestAction } from '../../../modules/bid/actions'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT
  bids: Bid[]
  onFetchBids: typeof fetchBidsByNFTRequest
}

export type MapStateProps = Pick<Props, 'bids'>
export type MapDispatchProps = Pick<Props, 'onFetchBids'>
export type MapDispatch = Dispatch<FetchBidsByNFTRequestAction>
export type OwnProps = Pick<Props, 'nft'>
