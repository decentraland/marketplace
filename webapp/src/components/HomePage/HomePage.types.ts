import { Dispatch } from 'redux'
import { NFT } from '../../modules/nft/types'
import { CallHistoryMethodAction } from 'connected-react-router'
import {
  fetchNFTsRequest,
  FetchNFTsRequestAction
} from '../../modules/nft/actions'

export type Props = {
  wearables: NFT[]
  land: NFT[]
  ens: NFT[]
  isWearablesLoading: boolean
  isENSLoading: boolean
  isLandLoading: boolean
  onFetchNFTs: typeof fetchNFTsRequest
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
export type MapDispatchProps = Pick<Props, 'onFetchNFTs' | 'onNavigate'>
export type MapDispatch = Dispatch<
  FetchNFTsRequestAction | CallHistoryMethodAction
>
