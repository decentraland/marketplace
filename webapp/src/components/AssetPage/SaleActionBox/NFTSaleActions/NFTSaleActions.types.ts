import { Dispatch } from 'redux'
import { Bid, Order } from '@dcl/schemas'
import {
  openModal,
  OpenModalAction
} from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../../../../modules/nft/types'

export type Props = {
  nft: NFT
  wallet: Wallet | null
  order: Order | null
  bids: Bid[]
  onLeavingSite: (nft: NFT) => ReturnType<typeof openModal>
}

export type OwnProps = Pick<Props, 'nft'>
export type MapStateProps = Pick<Props, 'wallet' | 'order' | 'bids'>

export type MapDispatchProps = Pick<Props, 'onLeavingSite'>
export type MapDispatch = Dispatch<OpenModalAction>
