import { Dispatch } from 'redux'
import { fetchRankingsRequest, FetchRankingsRequestAction } from '../../modules/analytics/actions'
import { RankingEntity } from '../../modules/analytics/types'

export type Props = {
  data: RankingEntity[] | null
  isLoading: boolean
  isExoticRarityEnabled: boolean
  onFetchRankings: typeof fetchRankingsRequest
}

export type MapStateProps = Pick<Props, 'data' | 'isLoading' | 'isExoticRarityEnabled'>
export type MapDispatchProps = Pick<Props, 'onFetchRankings'>
export type MapDispatch = Dispatch<FetchRankingsRequestAction>
