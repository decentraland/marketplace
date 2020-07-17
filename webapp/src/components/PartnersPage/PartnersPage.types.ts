import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NFT } from '../../modules/nft/types'
import {
  fetchNFTsRequest,
  FetchNFTsRequestAction
} from '../../modules/nft/actions'

export type Props = {
  superRare: NFT[]
  isSuperRareLoading: boolean
  makersPlace: NFT[]
  isMakersPlaceLoading: boolean
  onNavigate: (path: string) => void
  onFetchNFTs: typeof fetchNFTsRequest
}

export type MapStateProps = Pick<
  Props,
  'superRare' | 'isSuperRareLoading' | 'makersPlace' | 'isMakersPlaceLoading'
>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onFetchNFTs'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | FetchNFTsRequestAction
>
