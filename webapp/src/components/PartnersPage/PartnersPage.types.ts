import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NFT } from '../../modules/nft/types'
import {
  fetchNFTsFromRoute,
  FetchNFTsFromRouteAction
} from '../../modules/routing/actions'

export type Props = {
  superRare: NFT[]
  isSuperRareLoading: boolean
  makersPlace: NFT[]
  isMakersPlaceLoading: boolean
  onNavigate: (path: string) => void
  onFetchNFTsFromRoute: typeof fetchNFTsFromRoute
}

export type MapStateProps = Pick<
  Props,
  'superRare' | 'isSuperRareLoading' | 'makersPlace' | 'isMakersPlaceLoading'
>
export type MapDispatchProps = Pick<
  Props,
  'onNavigate' | 'onFetchNFTsFromRoute'
>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | FetchNFTsFromRouteAction
>
