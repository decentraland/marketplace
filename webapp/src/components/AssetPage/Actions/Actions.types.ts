import { Dispatch } from 'redux'
import { Bid, Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules//wallet/types'
import { OpenModalAction, openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  wallet: Wallet | null
  nft: NFT
  order: Order | null
  bids: Bid[]
  onLeavingSite: (nft: NFT) => ReturnType<typeof openModal>
}

export type MapStateProps = Pick<Props, 'wallet' | 'order' | 'bids'>
export type MapDispatchProps = Pick<Props, 'onLeavingSite'>
export type MapDispatch = Dispatch<OpenModalAction>
export type OwnProps = Pick<Props, 'nft'>
