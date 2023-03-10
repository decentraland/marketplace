import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  orderDirection?: OrderDirection
}

export type OwnersFilters = {
  contractAddress: string
  itemId: string
  first: number
  skip: number
  sortBy?: OwnersSortBy
  orderDirection?: string
}

export type MapStateProps = {}
export type MapDispatchProps = {}

export type OwnersResponse = {
  issuedId: number
  ownerId: string
  orderStatus: string | null
  orderExpiresAt: string | null
  tokenId: string
}

export enum OwnersSortBy {
  ISSUED_ID = 'issuedId'
}

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}
