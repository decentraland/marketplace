import { Collection } from '@dcl/schemas'
import { Dispatch } from 'redux'
import {
  fetchCollectionTotalRequest,
  FetchCollectionTotalRequestAction
} from '../../modules/collection/actions'
import { browse, BrowseAction } from '../../modules/routing/actions'
import { SortBy } from '../../modules/routing/types'

export type Props = {
  address: string
  collections: Collection[]
  count: number
  total: number
  isLoading: boolean
  search: string
  page: number
  sortBy?: SortBy
  onBrowse: (...params: Parameters<typeof browse>) => void
  onFetchCollectionTotal: (
    ...params: Parameters<typeof fetchCollectionTotalRequest>
  ) => void
}

export type MapStateProps = Pick<
  Props,
  | 'address'
  | 'collections'
  | 'count'
  | 'total'
  | 'isLoading'
  | 'search'
  | 'sortBy'
  | 'page'
>

export type MapDispatchProps = Pick<
  Props,
  'onBrowse' | 'onFetchCollectionTotal'
>

export type MapDispatch = Dispatch<
  BrowseAction | FetchCollectionTotalRequestAction
>
