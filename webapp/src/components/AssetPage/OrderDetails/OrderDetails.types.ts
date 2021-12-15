import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Order } from '@dcl/schemas'
import { NFT } from '../../../modules/nft/types'

export type Props = {
  nft: NFT
  order: Order | null
}

export type MapStateProps = Pick<Props, 'order'>
export type MapDispatchProps = {}
export type MapDispatch = Dispatch<CallHistoryMethodAction>
export type OwnProps = Pick<Props, 'nft'>
