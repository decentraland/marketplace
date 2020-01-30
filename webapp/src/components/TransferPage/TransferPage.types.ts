import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  transferNFTRequest,
  TransferNFTRequestAction
} from '../../modules/nft/actions'

export type Props = {
  onTransfer: typeof transferNFTRequest
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onTransfer'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | TransferNFTRequestAction
>
