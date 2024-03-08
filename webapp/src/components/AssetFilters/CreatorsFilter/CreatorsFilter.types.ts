import { Dispatch } from 'redux'
import { fetchCreatorsAccountRequest, FetchCreatorsAccountRequestAction } from '../../../modules/account/actions'
import { CreatorAccount } from '../../../modules/account/types'

export type Props = {
  creators?: string[]
  fetchedCreators: CreatorAccount[]
  isLoading: boolean
  onFetchCreators: typeof fetchCreatorsAccountRequest
  onChange: (creators?: string[]) => void
  defaultCollapsed?: boolean
}

export type MapStateProps = Pick<Props, 'fetchedCreators' | 'isLoading'>

export type OwnProps = Pick<Props, 'onChange' | 'defaultCollapsed'>

export type MapDispatchProps = Pick<Props, 'onFetchCreators'>
export type MapDispatch = Dispatch<FetchCreatorsAccountRequestAction>
