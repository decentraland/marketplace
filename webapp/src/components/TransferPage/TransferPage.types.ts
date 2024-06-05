import { Dispatch } from 'redux'
import { transferNFTRequest, TransferNFTRequestAction } from '../../modules/nft/actions'

export type Props = {
  onTransfer: typeof transferNFTRequest
  isTransferring: boolean
}

export type MapStateProps = Pick<Props, 'isTransferring'>
export type MapDispatchProps = Pick<Props, 'onTransfer'>
export type MapDispatch = Dispatch<TransferNFTRequestAction>
