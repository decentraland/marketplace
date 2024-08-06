import { Dispatch } from 'react'
import { Bid } from '@dcl/schemas'
import { Asset } from '../../../modules/asset/types'
import { CancelBidRequestAction, FetchBidsByAssetRequestAction } from '../../../modules/bid/actions'

export type Props = {
  asset: Asset | null
  address?: string
  bids: Bid[]
  isBidsOffchainEnabled: boolean
  onCancel: (bid: Bid) => void
  onFetchBids: (asset: Asset) => void
}

export type MapStateProps = Pick<Props, 'address' | 'isBidsOffchainEnabled' | 'bids'>

export type MapDispatchProps = Pick<Props, 'onCancel' | 'onFetchBids'>

export type MapDispatch = Dispatch<CancelBidRequestAction | FetchBidsByAssetRequestAction>
