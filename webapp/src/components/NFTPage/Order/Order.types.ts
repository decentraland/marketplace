import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NFT } from '../../../modules/nft/types'
import { Order } from '../../../modules/order/types'

export type Props = {
  address?: string
  nft: NFT
  order: Order | null
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'address' | 'order'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
export type OwnProps = Pick<Props, 'nft'>
