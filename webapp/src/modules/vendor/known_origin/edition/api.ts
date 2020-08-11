import { gql } from 'apollo-boost'

import { NFTsFetchParams, NFTSortBy } from '../../../nft/types'
import { client } from '../api'
import { editionFragment, EditionFragment } from './fragments'

class EditionAPI {
  fetch = async (params: NFTsFetchParams) => {
    const query = getNFTsQuery(params)
    const variables = this.buildVariables(params)

    const { data } = await client.query<{ editions: EditionFragment[] }>({
      query,
      variables
    })

    return data.editions
  }

  async count(params: NFTsFetchParams) {
    const countQuery = getNFTsCountQuery(params)
    const variables = this.buildVariables(params)

    const { data } = await client.query<{ editions: EditionFragment[] }>({
      query: countQuery,
      variables
    })

    return data.editions.length
  }

  async fetchOne(id: string) {
    const { data } = await client.query<{ editions: EditionFragment[] }>({
      query: EDITION_BY_ID_QUERY,
      variables: {
        id
      }
    })
    return data.editions[0]
  }

  private buildVariables(params: NFTsFetchParams) {
    return {
      ...params,
      orderBy: this.getSort(params.orderBy)
    }
  }

  private getSort(sortBy?: NFTSortBy) {
    switch (sortBy) {
      case NFTSortBy.PRICE:
        return 'priceInWei'
      case NFTSortBy.ORDER_CREATED_AT:
        return 'createdTimestamp'
      default:
        return undefined
    }
  }
}

const EDITIONS_FILTERS = `
  $first: Int
  $skip: Int
  $orderBy: String
  $orderDirection: String

  $address: String
`

const EDITIONS_ARGUMENTS = `
  first: $first
  skip: $skip
  orderBy: $orderBy
  orderDirection: $orderDirection
`

function getNFTsCountQuery(params: NFTsFetchParams) {
  return getNFTsQuery(params, true)
}

function getNFTsQuery(params: NFTsFetchParams, isCount = false) {
  let extraWhere: string[] = []

  if (params.address) {
    extraWhere.push('artistAccount: $address')
  }

  // TODO: Search?
  // TODO: onlyOnSale?

  return gql`
    query Editions(
      ${EDITIONS_FILTERS}
    ) {
      editions(
        where: {
          active: true,
          offersOnly: false,
          remainingSupply_gt: 0,
          ${extraWhere.join('\n')}
        }
        ${EDITIONS_ARGUMENTS}
      ) {
        ${isCount ? 'id' : '...editionFragment'}
      }
    }
    ${isCount ? '' : editionFragment()}
  `
}

const EDITION_BY_ID_QUERY = gql`
  query EditionByTokenId($id: String) {
    editions(where: { id: $id }, first: 1) {
      ...editionFragment
    }
  }
  ${editionFragment()}
`

export const editionAPI = new EditionAPI()
