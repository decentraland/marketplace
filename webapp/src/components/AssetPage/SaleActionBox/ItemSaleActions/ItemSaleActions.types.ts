import { Dispatch } from 'redux'
import { Bid, Item } from '@dcl/schemas'
import { OpenModalAction } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { Asset } from '../../../../modules/asset/types'
import { FetchBidsByAssetRequestAction } from '../../../../modules/bid/actions'

export type Props = {
  item: Item
  wallet?: Wallet | null
  bids: Bid[]
  onUseCredits: (value: boolean) => void
  onFetchBids: (asset: Asset) => void
  customClassnames?: { [key: string]: string } | undefined
}

export type OwnProps = Pick<Props, 'item' | 'customClassnames'>
export type MapStateProps = Pick<Props, 'wallet' | 'bids'>

export type MapDispatchProps = Pick<Props, 'onFetchBids'>
export type MapDispatch = Dispatch<OpenModalAction | FetchBidsByAssetRequestAction>
