import { Collection } from '@dcl/schemas'
import { Dispatch } from 'redux'
import { browse, BrowseAction } from '../../modules/routing/actions'
import { SortBy } from '../../modules/routing/types'

export type Props = {
  collections: Collection[]
  isLoading: boolean
  search: string
  sortBy?: SortBy
  onBrowse: (...params: Parameters<typeof browse>) => void
}

export type MapStateProps = Pick<
  Props,
  'collections' | 'isLoading' | 'search' | 'sortBy'
>

export type MapDispatchProps = Pick<Props, 'onBrowse'>

export type MapDispatch = Dispatch<BrowseAction>
