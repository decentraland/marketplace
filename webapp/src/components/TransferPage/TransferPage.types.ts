import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  transferNFTRequest,
  TransferNFTRequestAction
} from '../../modules/nft/actions'

export type Props = {
  onTransfer: typeof transferNFTRequest
  isTransfering: boolean
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'isTransfering'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onTransfer'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | TransferNFTRequestAction
>
