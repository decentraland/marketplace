import { Dispatch } from 'redux'
import React from 'react'
import { NFT } from '../../modules/nft/types'
import {
  fetchNFTRequest,
  FetchNFTRequestAction
} from '../../modules/nft/actions'
import { Order } from '../../modules/order/types'

export type Props = {
  contractAddress: string | null
  tokenId: string | null
  nft: NFT | null
  order: Order | null
  isLoading: boolean
  onFetchNFT: typeof fetchNFTRequest
  children: (
    nft: NFT | null,
    order: Order | null,
    isLoading: boolean
  ) => React.ReactNode | null
}

export type MapStateProps = Pick<
  Props,
  'contractAddress' | 'tokenId' | 'nft' | 'order' | 'isLoading'
>
export type MapDispatchProps = Pick<Props, 'onFetchNFT'>
export type MapDispatch = Dispatch<FetchNFTRequestAction>
export type OwnProps = Partial<Pick<Props, 'contractAddress' | 'tokenId'>>
