import { NFT } from '../../modules/nft/types'
import { Order } from '../../modules/order/types'

export type Props = {
  isConnecting: boolean
  children: (nft: NFT, order: Order | null) => React.ReactNode | null
}

export type MapStateProps = Pick<Props, 'isConnecting'>
export type MapDispatchProps = {}
export type MapDispatch = {}
