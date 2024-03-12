import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  orderDirection?: OrderDirection
}

export enum OrderDirection {
  ASC = 'asc',
  DESC = 'desc'
}
