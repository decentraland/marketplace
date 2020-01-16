import { Dispatch } from 'redux'
import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'

export type Props = {
  nft: NFT
  order?: Order
}

export type MapStateProps = Pick<Props, 'order'>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'nft' | 'order'>
export type MapDispatch = Dispatch
