import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { MarketSection } from '../../modules/routing/locations'

export type Props = {
  section: MarketSection
  onNavigate: (path: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
