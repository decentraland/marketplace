import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'

export type Props = {
  open: boolean
  authorization: Authorization
  authorizations: Authorization[]
  isAuthorizing: boolean
  isLoading?: boolean
  onCancel: () => void
  onProceed: () => void
}

export type MapStateProps = Pick<Props, 'authorizations' | 'isAuthorizing'>
export type MapDispatchProps = {}
export type MapDispatch = Dispatch
export type OwnProps = Pick<
  Props,
  'open' | 'authorization' | 'onProceed' | 'isLoading'
>
