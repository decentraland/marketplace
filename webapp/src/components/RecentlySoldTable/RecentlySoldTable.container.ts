import { connect } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { RootState } from '../../modules/reducer'
import {
  MapStateProps,
  MapDispatch,
  MapDispatchProps
} from './RecentlySoldTable.types'
import { getLoading } from '../../modules/sale/selectors'
import { getSales } from '../../modules/sale/selectors'
import { FETCH_RANKINGS_REQUEST } from '../../modules/analytics/actions'
import AnalyticsVolumeDayData from './RecentlySoldTable'
import { fetchSalesRequest } from '../../modules/sale/actions'

const mapState = (state: RootState): MapStateProps => {
  const data = getSales(state)
  return {
    data,
    isLoading: isLoadingType(getLoading(state), FETCH_RANKINGS_REQUEST)
  }
}

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onFetchRecentSales: filters => dispatch(fetchSalesRequest(filters))
})

export default connect(mapState, mapDispatch)(AnalyticsVolumeDayData)
