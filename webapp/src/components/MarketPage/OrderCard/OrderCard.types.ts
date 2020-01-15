import { Dispatch } from 'redux'
import { Order } from '../../../modules/order/types'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  order: Order
  nft: NFT
}

export type MapStateProps = Pick<Props, 'nft'>
export type MapDispatchProps = {}
export type OwnProps = Pick<Props, 'order'>
export type MapDispatch = Dispatch
