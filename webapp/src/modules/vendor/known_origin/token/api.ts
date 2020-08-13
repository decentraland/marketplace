import { gql } from 'apollo-boost'

import { NFTsFetchParams, NFTSortBy } from '../../../nft/types'
import { client } from '../api'
import { AssetType } from '../types'
import { tokenFragment, TokenFragment } from './fragments'

class TokenAPI {
  fetch = async (params: NFTsFetchParams) => {
    const query = getNFTsQuery(params)
    const variables = this.buildVariables(params)

    const { data } = await client.query<{ tokens: TokenFragment[] }>({
      query,
      variables
    })

    return this.addType(data.tokens)
  }

  async count(params: NFTsFetchParams) {
    const countQuery = getNFTsCountQuery(params)
    const variables = this.buildVariables(params)

    const { data } = await client.query<{ tokens: TokenFragment[] }>({
      query: countQuery,
      variables
    })

    return data.tokens.length
  }

  async fetchOne(id: string) {
    const { data } = await client.query<{ tokens: TokenFragment[] }>({
      query: TOKEN_BY_ID_QUERY,
      variables: {
        id
      }
    })
    return this.addType(data.tokens)[0]
  }

  private addType(tokens: TokenFragment[]): TokenFragment[] {
    return tokens.map(token => ({ ...token, type: AssetType.TOKEN }))
  }

  private buildVariables(params: NFTsFetchParams) {
    return {
      ...params,
      address: params.address,
      orderBy: this.getSort(params.orderBy)
    }
  }

  private getSort(sortBy?: NFTSortBy) {
    switch (sortBy) {
      case NFTSortBy.CREATED_AT:
        return 'birthTimestamp'
      default:
        return undefined
    }
  }
}

const TOKENS_FILTERS = `
  $first: Int
  $skip: Int
  $orderBy: String
  $orderDirection: String

  $address: String
`

const TOKENS_ARGUMENTS = `
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
    extraWhere.push('currentOwner: $address')
  }

  // TODO: Search?
  // TODO: onlyOnSale?

  return gql`
    query Tokens(
      ${TOKENS_FILTERS}
    ) {
      tokens(
        where: {
          ${extraWhere.join('\n')}
        }
        ${TOKENS_ARGUMENTS}
      ) {
        ${isCount ? 'id' : '...tokenFragment'}
      }
    }
    ${isCount ? '' : tokenFragment()}
  `
}

const TOKEN_BY_ID_QUERY = gql`
  query TokenById($id: String) {
    tokens(where: { id: $id }, first: 1) {
      ...tokenFragment
    }
  }
  ${tokenFragment()}
`

export const tokenAPI = new TokenAPI()
