import { Dispatch } from 'redux'
import { clearTransactions, ClearTransactionsAction } from 'decentraland-dapps/dist/modules/transaction/actions'
import { FetchUserActivityRequestAction } from '../../modules/activity/actions'
import { MergedActivityItem } from '../../modules/activity/selectors'

export type Props = {
  address?: string
  mergedActivity: MergedActivityItem[]
  loading: boolean
  error: string | null
  onClearHistory: typeof clearTransactions
  onLoadActivity: () => void
}

export type MapStateProps = Pick<Props, 'address' | 'mergedActivity' | 'loading' | 'error'>
export type MapDispatchProps = Pick<Props, 'onClearHistory' | 'onLoadActivity'>
export type MapDispatch = Dispatch<ClearTransactionsAction | FetchUserActivityRequestAction>
