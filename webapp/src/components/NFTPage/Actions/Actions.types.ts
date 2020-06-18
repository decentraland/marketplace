import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Wallet } from 'decentraland-dapps/dist/modules//wallet/types'
import { NFT } from '../../../modules/nft/types'
import { Order } from '../../../modules/order/types'

export type Props = {
  wallet: Wallet | null
  nft: NFT
  order: Order | null
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'wallet' | 'order'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
export type OwnProps = Pick<Props, 'nft'>
