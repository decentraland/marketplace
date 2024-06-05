import { Dispatch } from 'react'
import { Bid } from '@dcl/schemas'
import { CancelBidRequestAction } from '../../../modules/bid/actions'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND> | null
  address?: string
  onCancel: (bid: Bid) => void
}

export type MapStateProps = Pick<Props, 'address'>

export type MapDispatchProps = Pick<Props, 'onCancel'>

export type MapDispatch = Dispatch<CancelBidRequestAction>
