import { gql } from 'apollo-boost'
import { AssetType } from '../types'

export const tokenFragment = () => gql`
  fragment tokenFragment on Token {
    id
    tokenId
    editionNumber
    currentOwner {
      id
    }
    metadata {
      name
      image
      description
    }
  }
`

export type TokenFragment = {
  id: string
  type: AssetType.TOKEN
  editionNumber: string
  tokenId: string
  currentOwner: {
    id: string
  }
  metadata: {
    name: string
    image: string
    description: string
  }
}
