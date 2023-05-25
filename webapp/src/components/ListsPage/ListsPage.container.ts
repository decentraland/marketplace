import { connect } from 'react-redux'
import { replace } from 'connected-react-router'
import { RootState } from '../../modules/reducer'
import { getBrowseLists, getCount } from '../../modules/ui/browse/selectors'
import { isLoadingLists } from '../../modules/favorites/selectors'
import { MapStateProps, MapDispatch, MapDispatchProps } from './ListsPage.types'
import ListsPage from './ListsPage'

const mapState = (state: RootState): MapStateProps => {
  return {
    isLoading: isLoadingLists(state),
    lists: getBrowseLists(state),
    count: getCount(state)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onRedirect: path => dispatch(replace(path))
})

export default connect(mapState, mapDispatch)(ListsPage)
