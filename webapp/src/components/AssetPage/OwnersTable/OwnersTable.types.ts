import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  orderDirection?: OrderDirection
}

export type MapStateProps = {}
export type MapDispatchProps = {}

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}
