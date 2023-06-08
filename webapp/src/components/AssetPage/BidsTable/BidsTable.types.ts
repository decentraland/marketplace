import { Dispatch } from 'redux'
import { Bid } from '@dcl/schemas'
import { VendorName } from '../../../modules/vendor'
import { NFT } from '../../../modules/nft/types'
import { AcceptBidRequestAction } from '../../../modules/bid/actions'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND> | null
  address?: string
  onAccept: (bid: Bid) => void
  isAcceptingBid: boolean
}

export type MapStateProps = Pick<Props, 'address' | 'isAcceptingBid'>

export type MapDispatchProps = Pick<Props, 'onAccept'>
export type MapDispatch = Dispatch<AcceptBidRequestAction>
