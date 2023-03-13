import { Asset } from '../../../modules/asset/types'

export type Props = {
  asset: Asset | null
  sortBy?: SortByOptions
}

export type MapStateProps = {}
export type MapDispatchProps = {}

export enum SortByOptions {
  CHEAPEST = 'Cheapest',
  NEWEST = 'Newest',
  OLDEST = 'Oldest',
  ISSUE_NUMBER_ASC = 'Issue number asc',
  ISSUE_NUMBER_DESC = 'Issue number desc'
}
