import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../../modules/reducer'
import { fetchCreatorsAccountRequest, FETCH_CREATORS_ACCOUNT_REQUEST } from '../../../modules/account/actions'
import { getCreators, getLoading } from '../../../modules/account/selectors'
import { MapDispatch, MapDispatchProps, MapStateProps } from './SearchBarDropdown.types'
import { SearchBarDropdown } from './SearchBarDropdown'

const mapState = (state: RootState): MapStateProps => ({
  fetchedCreators: getCreators(state),
  isLoadingCreators: isLoadingType(getLoading(state), FETCH_CREATORS_ACCOUNT_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchCreators: (search: string, searchUUID?: string) => dispatch(fetchCreatorsAccountRequest(search, searchUUID))
})

export default connect(mapState, mapDispatch)(SearchBarDropdown)
