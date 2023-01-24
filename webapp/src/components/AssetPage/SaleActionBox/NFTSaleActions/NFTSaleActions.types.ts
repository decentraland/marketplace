import { Bid, Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../../../../modules/nft/types'

export type Props = {
  nft: NFT
  wallet: Wallet | null
  order: Order | null
  bids: Bid[]
}

export type OwnProps = Pick<Props, 'nft'>
export type MapStateProps = Pick<Props, 'wallet' | 'order' | 'bids'>
