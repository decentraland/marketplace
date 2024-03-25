import { Order } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND> | null
  order: Order | null
  address?: string
  wallet: Wallet | null
}

export type OwnProps = Pick<Props, 'nft'>
export type MapStateProps = Pick<Props, 'address' | 'order' | 'wallet'>
