import { Dispatch } from 'redux'
import { NFT } from '../../modules/nft/types'
import { Order } from '../../modules/order/types'
import {
  fetchNFTRequest,
  FetchNFTRequestAction
} from '../../modules/nft/actions'

export type Props = {
  contractAddress: string | null
  tokenId: string | null
  nft: NFT | null
  order: Order | null
  onFetchNFT: typeof fetchNFTRequest
  isLoading: boolean
}

export type MapStateProps = Pick<
  Props,
  'contractAddress' | 'tokenId' | 'nft' | 'order' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onFetchNFT'>
export type MapDispatch = Dispatch<FetchNFTRequestAction>
