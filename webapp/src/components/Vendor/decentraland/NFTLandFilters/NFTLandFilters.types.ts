import { Dispatch } from 'redux'
import { browse, BrowseAction } from '../../../../modules/routing/actions'
import { LANDFilters } from '../types'

export type Props = {
  selectedFilter?: LANDFilters
  onLandFilterChange: typeof browse
}

export type MapStateProps = Pick<Props, 'selectedFilter'>
export type MapDispatchProps = Pick<Props, 'onLandFilterChange'>
export type MapDispatch = Dispatch<BrowseAction>
