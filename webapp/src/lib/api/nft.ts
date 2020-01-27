import { gql } from 'apollo-boost'

import { NFT } from '../../modules/nft/types'
import { client } from './client'
import { nftFragment, NFTFragment } from '../../modules/nft/fragments'
import { Order } from '../../modules/order/types'

export const NFT_BY_ADDRESS_AND_ID = gql`
  query NFTByTokenId($contractAddress: String, $tokenId: String) {
    nfts(
      where: { contractAddress: $contractAddress, tokenId: $tokenId }
      first: 1
    ) {
      ...nftFragment
    }
  }
  ${nftFragment()}
`

export const PARCEL_TOKEN_ID = gql`
  query ParcelTokenId($x: BigInt, $y: BigInt) {
    parcels(where: { x: $x, y: $y }) {
      tokenId
    }
  }
`

class NFTAPI {
  async fetch(contractAddress: string, tokenId: string) {
    const { data } = await client.query({
      query: NFT_BY_ADDRESS_AND_ID,
      variables: {
        contractAddress,
        tokenId
      }
    })
    const { activeOrder, ...rest } = data.nfts[0] as NFTFragment
    const nft: NFT = {
      ...rest,
      activeOrderId: activeOrder ? activeOrder.id : null
    }
    const order: Order | null = activeOrder
      ? { ...activeOrder, nftId: nft.id }
      : null
    return [nft, order] as const
  }

  async fetchTokenId(x: number, y: number) {
    const { data } = await client.query({
      query: PARCEL_TOKEN_ID,
      variables: {
        x,
        y
      }
    })
    const { tokenId } = data.parcels[0]
    return tokenId as string
  }
}

export const nftAPI = new NFTAPI()
