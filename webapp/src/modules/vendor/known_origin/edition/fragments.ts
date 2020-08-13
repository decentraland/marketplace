import { gql } from 'apollo-boost'
import { AssetType } from '../types'

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
  type: AssetType.EDITION
  artistAccount: string
  priceInWei: string
  totalSupply: string
  createdTimestamp: string
  metadata: {
    name: string
    image: string
    description: string
  }
}
