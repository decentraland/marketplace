import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'
import { Section } from '../../modules/routing/search'

export type Params = {
  address: string
}

export type Props = {
  address: string
  section: Section
  onNavigate: (path: string) => void
}

export type MapStateProps = Pick<Props, 'address' | 'section'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
