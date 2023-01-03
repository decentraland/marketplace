import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../../../modules/reducer'
import { browse } from '../../../../../modules/routing/actions'
import {
  getCurrentBrowseOptions,
  getSection
} from '../../../../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps } from './SelectedFilters.types'
import { SelectedFilters } from './SelectedFilters'
import { isLandSection } from '../../../../../modules/ui/utils'

const mapState = (state: RootState): MapStateProps => {
  return {
    browseOptions: getCurrentBrowseOptions(state),
    isLandSection: isLandSection(getSection(state))
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(SelectedFilters)
