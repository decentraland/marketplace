import { gql } from 'apollo-boost'

import { NFT } from '../../../nft/types'
import { Wearable } from '../../../nft/wearable/types'
import { orderFields, OrderFields } from '../order/fragments'

export const nftFields = () => gql`
  fragment nftFields on NFT {
    id
    name
    image
    contractAddress
    tokenId
    itemBlockchainId
    owner {
      address
    }
    metadata {
      wearable {
        category
        rarity
        bodyShapes
      }
    }
  }
`

export const nftFragment = () => gql`
  fragment nftFragment on NFT {
    ...nftFields
    activeOrder(size_gt: 0) {
      ...orderFields
    }
  }
  ${nftFields()}
  ${orderFields()}
`

export type NFTFields = Omit<NFT, 'activeOrderId' | 'owner' | 'category'> & {
  owner: { address: string }
  itemBlockchainId: string
  metadata: {
    wearable?: Wearable
  }
}
export type NFTFragment = Omit<NFTFields, 'vendor'> & {
  activeOrder: OrderFields | null
}
