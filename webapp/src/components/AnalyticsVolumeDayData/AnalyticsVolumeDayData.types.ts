import { Dispatch } from 'redux'
import { AnalyticsVolumeData } from '../../modules/analytics/types'
import {
  fetchAnalyticsVolumeDataRequest,
  FetchAnalyticsDayDataRequestAction
} from '../../modules/analytics/actions'

export type Props = {
  data: AnalyticsVolumeData | null
  isLoading: boolean
  onFetchVolumeData: typeof fetchAnalyticsVolumeDataRequest
}

export type MapStateProps = Pick<Props, 'data' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onFetchVolumeData'>
export type MapDispatch = Dispatch<FetchAnalyticsDayDataRequestAction>
