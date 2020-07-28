import { Dispatch } from 'redux'
import { NFT } from '../../modules/nft/types'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  fetchNFTsFromRoute,
  FetchNFTsFromRouteAction
} from '../../modules/routing/actions'

export type Props = {
  wearables: NFT[]
  land: NFT[]
  ens: NFT[]
  isWearablesLoading: boolean
  isENSLoading: boolean
  isLandLoading: boolean
  onNavigate: (path: string) => void
  onFetchNFTsFromRoute: typeof fetchNFTsFromRoute
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
export type MapDispatchProps = Pick<
  Props,
  'onFetchNFTsFromRoute' | 'onNavigate'
>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | FetchNFTsFromRouteAction
>
