import { NFT } from '../../modules/nft/types'
import { Order } from '../../modules/order/types'

export type Props = {
  children: (nft: NFT, order: Order | null) => React.ReactNode | null
}
