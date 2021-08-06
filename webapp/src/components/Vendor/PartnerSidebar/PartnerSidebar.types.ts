import { Dispatch } from 'redux'
import { CallHistoryMethodAction } from 'connected-react-router'

import { VendorName } from '../../../modules/vendor/types'

export type Props = {
  vendor: VendorName
  section: string
  onNavigate: (path: string) => void
  onMenuItemClick: (string: string) => void
}

export type MapStateProps = {}
export type MapDispatchProps = Pick<Props, 'onNavigate'>
export type MapDispatch = Dispatch<CallHistoryMethodAction>
