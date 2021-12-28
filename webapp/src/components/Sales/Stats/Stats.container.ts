import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { MapStateProps, MapDispatchProps } from './Stats.types'
import Stats from './Stats'
import { getMetricsByAddress } from '../../../modules/account/selectors'
import { getAddress } from '../../../modules/wallet/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading } from '../../../modules/account/selectors'
import {
  fetchAccountMetricsRequest,
  FETCH_ACCOUNT_METRICS_REQUEST
} from '../../../modules/account/actions'
import { Dispatch } from 'redux'

const getEmptyMetrics = (address: string) => ({
  address,
  earned: '0',
  spent: '0',
  royalties: '0',
  purchases: 0,
  sales: 0
})

const mapState = (state: RootState): MapStateProps => {
  const address = getAddress(state)!
  const metrics = getMetricsByAddress(state)[address]
  const emptyMetrics = getEmptyMetrics(address)
  const isLoading = isLoadingType(
    getLoading(state),
    FETCH_ACCOUNT_METRICS_REQUEST
  )

  return {
    address,
    totalSales: metrics?.aggregated?.sales || emptyMetrics.sales,
    totalEarnings: metrics?.aggregated?.earned || emptyMetrics.earned,
    ethereumEarned: metrics?.ETHEREUM?.earned || emptyMetrics.earned,
    maticEarned: metrics?.MATIC?.earned || emptyMetrics.earned,
    royalties: metrics?.aggregated?.royalties || emptyMetrics.royalties,
    isLoading
  }
}

const mapDispatch = (dispatch: Dispatch): MapDispatchProps => {
  return {
    onFetchMetrics: address => dispatch(fetchAccountMetricsRequest({ address }))
  }
}

export default connect(mapState, mapDispatch)(Stats)
