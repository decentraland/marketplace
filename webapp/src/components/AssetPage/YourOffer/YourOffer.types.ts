import { Dispatch } from 'react'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Bid } from '@dcl/schemas'
import { CancelBidRequestAction } from '../../../modules/bid/actions'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND> | null
  address?: string
  onUpdate: (bid: Bid) => void
  onCancel: (bid: Bid) => void
}

export type MapStateProps = Pick<Props, 'address'>

export type MapDispatchProps = Pick<Props, 'onUpdate' | 'onCancel'>

export type MapDispatch = Dispatch<CallHistoryMethodAction | CancelBidRequestAction>
