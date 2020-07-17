import { Dispatch } from 'redux'
import { NFT } from '../../modules/nft/types'
import { CallHistoryMethodAction } from 'connected-react-router'
import { browse, BrowseAction } from '../../modules/routing/actions'

export type Props = {
  wearables: NFT[]
  land: NFT[]
  ens: NFT[]
  isWearablesLoading: boolean
  isENSLoading: boolean
  isLandLoading: boolean
  onBrowse: typeof browse
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<
  Props,
  | 'wearables'
  | 'land'
  | 'ens'
  | 'isWearablesLoading'
  | 'isENSLoading'
  | 'isLandLoading'
>
export type MapDispatchProps = Pick<Props, 'onBrowse' | 'onNavigate'>
export type MapDispatch = Dispatch<BrowseAction | CallHistoryMethodAction>
