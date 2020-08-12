import { gql } from 'apollo-boost'

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
