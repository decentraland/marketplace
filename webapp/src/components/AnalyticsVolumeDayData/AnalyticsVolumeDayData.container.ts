import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { fetchAnalyticsVolumeDataRequest, FETCH_ANALYTICS_VOLUME_DATA_REQUEST } from '../../modules/analytics/actions'
import { getVolumeData, getLoading } from '../../modules/analytics/selectors'
import { RootState } from '../../modules/reducer'
import AnalyticsVolumeDayData from './AnalyticsVolumeDayData'
import { MapStateProps, MapDispatch, MapDispatchProps } from './AnalyticsVolumeDayData.types'

const mapState = (state: RootState): MapStateProps => {
  const data = getVolumeData(state)
  return {
    data,
    isLoading: isLoadingType(getLoading(state), FETCH_ANALYTICS_VOLUME_DATA_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchVolumeData: options => dispatch(fetchAnalyticsVolumeDataRequest(options))
})

export default connect(mapState, mapDispatch)(AnalyticsVolumeDayData)
