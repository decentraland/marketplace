import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { RootState } from '../../../modules/reducer'
import { browse } from '../../../modules/routing/actions'
import { isLandSection } from '../../../modules/ui/utils'
import { getCurrentBrowseOptions, getSection } from '../../../modules/routing/selectors'
import { MapStateProps, MapDispatchProps } from './SelectedFilters.types'
import { SelectedFilters } from './SelectedFilters'
import { getCategoryFromSection } from '../../../modules/routing/search'

const mapState = (state: RootState): MapStateProps => {
  const section = getSection(state)
  const browseOptions = getCurrentBrowseOptions(state)

  return {
    category: section ? getCategoryFromSection(section) : undefined,
    browseOptions,
    isLandSection: isLandSection(getSection(state))
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onBrowse: options => dispatch(browse(options))
  }
}

export default connect(mapState, mapDispatch)(SelectedFilters)
