import { Order } from '@dcl/schemas'
import { VendorName } from '../../../modules/vendor'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND> | null
  order: Order | null
  address?: string
}

export type MapStateProps = Pick<Props, 'address' | 'order'>
