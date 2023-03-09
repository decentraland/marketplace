import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  sort_by?: OwnersSortBy
}

export type OwnersFilters = {
  contractAddress: string
  itemId: string
  first: number
  skip: number
  sort_by?: OwnersSortBy
  orderDirection?: string
}

export type MapStateProps = {}
export type MapDispatchProps = {}

export type OwnersResponse = {
  issuedId: number
  ownerId: string
  orderStatus: string | null
  orderExpiresAt: string | null
}

export enum OwnersSortBy {
  ISSUED_ID = 'issuedId'
}
