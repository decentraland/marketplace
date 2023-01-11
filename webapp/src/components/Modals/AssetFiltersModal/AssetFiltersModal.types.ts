import { Dispatch } from 'redux'
import { ModalProps } from 'decentraland-ui/dist/components/Modal/Modal'
import {
  BrowseAction,
  clearFilters,
  ClearFiltersAction
} from '../../../modules/routing/actions'
import { BrowseOptions } from '../../../modules/routing/types'

export type Props = ModalProps & {
  hasFiltersEnabled: boolean
  onClearFilters: typeof clearFilters
  onBrowse: (options: BrowseOptions) => void
}

export type MapStateProps = Pick<
  Props,
  | 'hasFiltersEnabled'
>

export type MapDispatchProps = Pick<Props, 'onClearFilters' | 'onBrowse'>
export type MapDispatch = Dispatch<ClearFiltersAction | BrowseAction>
