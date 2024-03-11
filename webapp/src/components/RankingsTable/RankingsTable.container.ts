import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import { MapStateProps, MapDispatch, MapDispatchProps } from './RankingsTable.types'
import { getRankingsData, getLoading } from '../../modules/analytics/selectors'
import { fetchRankingsRequest, FETCH_RANKINGS_REQUEST } from '../../modules/analytics/actions'
import RankingsTable from './RankingsTable'

const mapState = (state: RootState): MapStateProps => {
  const data = getRankingsData(state)
  return {
    data,
    isLoading: isLoadingType(getLoading(state), FETCH_RANKINGS_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchRankings: (entity, timeframe, filters) => dispatch(fetchRankingsRequest(entity, timeframe, filters))
})

export default connect(mapState, mapDispatch)(RankingsTable)
