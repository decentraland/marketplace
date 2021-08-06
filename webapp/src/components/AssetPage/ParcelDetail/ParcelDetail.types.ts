import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NFT } from '../../../modules/nft/types'
import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  nft: NFT<VendorName.DECENTRALAND>
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
