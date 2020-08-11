import { gql } from 'apollo-boost'

export const editionFragment = () => gql`
  fragment editionFragment on Edition {
    id
    createdTimestamp
    artistAccount
    priceInWei
    totalSupply
    metadata {
      name
      image
      description
    }
  }
`

export type EditionFragment = {
  id: string
  createdTimestamp: string
  artistAccount: string
  priceInWei: string
  totalSupply: string
  metadata: {
    name: string
    image: string
    description: string
  }
}
