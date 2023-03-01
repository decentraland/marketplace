import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../../modules/reducer'
import {
  fetchCreatorsAccountRequest,
  FETCH_CREATORS_ACCOUNT_REQUEST
} from '../../../modules/account/actions'
import { getCreators, getLoading } from '../../../modules/account/selectors'
import {
  MapDispatch,
  MapDispatchProps,
  MapStateProps
} from './CreatorsFilter.types'
import { CreatorsFilter } from './CreatorsFilter'

const mapState = (state: RootState): MapStateProps => ({
  fetchedCreators: getCreators(state),
  isLoading: isLoadingType(getLoading(state), FETCH_CREATORS_ACCOUNT_REQUEST)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchCreators: (search: string) =>
    dispatch(fetchCreatorsAccountRequest(search))
})

export default connect(mapState, mapDispatch)(CreatorsFilter)
