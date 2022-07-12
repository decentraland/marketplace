import { Dispatch } from 'redux'
import { RankingEntity } from '../../modules/analytics/types'
import {
  fetchRankingsRequest,
  FetchRankingsRequestAction
} from '../../modules/analytics/actions'

export type Props = {
  data: RankingEntity[] | null        
  isLoading: boolean    
  onFetchRankings: typeof fetchRankingsRequest
}

export type MapStateProps = Pick<Props, 'data' | 'isLoading'>
export type MapDispatchProps = Pick<Props, 'onFetchRankings'>
export type MapDispatch = Dispatch<FetchRankingsRequestAction>
