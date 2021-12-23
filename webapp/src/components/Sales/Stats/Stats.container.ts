import { connect } from 'react-redux'
import { RootState } from '../../../modules/reducer'
import { MapStateProps } from './Stats.types'
import Stats from './Stats'
import { getMetricsByAddress } from '../../../modules/account/selectors'
import { getAddress } from '../../../modules/wallet/selectors'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getLoading } from '../../../modules/account/selectors'
import { FETCH_ACCOUNT_METRICS_REQUEST } from '../../../modules/account/actions'

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
    ethereumEarned: metrics?.ETHEREUM?.earned || emptyMetrics.earned,
    maticEarned: metrics?.MATIC?.earned || emptyMetrics.earned,
    totalSales: metrics?.aggregated?.sales || emptyMetrics.sales,
    isLoading
  }
}

export default connect(mapState)(Stats)
