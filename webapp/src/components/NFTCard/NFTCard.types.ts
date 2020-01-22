import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Order } from '../../modules/order/types'
import { NFT } from '../../modules/nft/types'

export type Props = {
  nft: NFT
  order?: Order
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'order'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type OwnProps = Pick<Props, 'nft' | 'order'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
