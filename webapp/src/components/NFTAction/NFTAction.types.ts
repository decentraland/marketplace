import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NFT } from '../../modules/nft/types'

export type Props = {
  nft: NFT
  children: React.ReactNode
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
