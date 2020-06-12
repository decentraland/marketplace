import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { NFT } from '../../modules/nft/types'
import {
  fetchNFTsRequest,
  FetchNFTsRequestAction
} from '../../modules/nft/actions'

export type Props = {
  nfts: NFT[]
  isLoading: boolean
  onNavigate: (path: string) => void
  onFetchNFTs: typeof fetchNFTsRequest
}

export type MapStateProps = Pick<Props, 'nfts' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onNavigate' | 'onFetchNFTs'>
export type MapDispatch = Dispatch<
  CallHistoryMethodAction | FetchNFTsRequestAction
>
