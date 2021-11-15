import { Collection } from '@dcl/schemas'
import { Dispatch } from 'redux'
import { browse, BrowseAction } from '../../modules/routing/actions'
import { SortBy } from '../../modules/routing/types'

export type Props = {
  collections: Collection[]
  count: number
  isLoading: boolean
  search: string
  page: number
  sortBy?: SortBy
  onBrowse: (...params: Parameters<typeof browse>) => void
}

export type MapStateProps = Pick<
  Props,
  'collections' | 'count' | 'isLoading' | 'search' | 'sortBy' | 'page'
>

export type MapDispatchProps = Pick<Props, 'onBrowse'>

export type MapDispatch = Dispatch<BrowseAction>
