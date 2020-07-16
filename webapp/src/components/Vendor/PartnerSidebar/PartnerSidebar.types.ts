import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'

import { Vendors } from '../../../modules/vendor/types'
import { Section } from '../../../modules/routing/types'

export type Props = {
  vendor: Vendors
  section: Section
  onNavigate: (path: string) => void
  onMenuItemClick: (section: Section) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
