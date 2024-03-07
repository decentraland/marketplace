import { Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { VendorName } from '../../../modules/vendor'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND> | null
  order: Order | null
  address?: string
  wallet: Wallet | null
}

export type OwnProps = Pick<Props, 'nft'>
export type MapStateProps = Pick<Props, 'address' | 'order' | 'wallet'>
