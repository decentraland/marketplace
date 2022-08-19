import { Dispatch } from 'redux'
import { browse, BrowseAction } from '../../../../modules/routing/actions'

export enum LandFilter {
  SALE = 'sale',
  RENT = 'rent',
  ALL = 'all'
}

export type Props = {
  selectedFilter?: LandFilter
  onLandFilterChange: typeof browse
}

export type MapStateProps = Pick<Props, 'selectedFilter'>
export type MapDispatchProps = Pick<Props, 'onLandFilterChange'>
export type MapDispatch = Dispatch<BrowseAction>
