import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'

import { Section } from '../../../../modules/routing/search'

export type Props = {
  section: Section
  onNavigate: (path: string) => void
  onMenuItemClick: (section: Section) => void
}

export type MapStateProps = Pick<Props, 'section'>
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
