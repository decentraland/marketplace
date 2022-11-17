import { Dispatch } from 'redux'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { Contract } from '../../modules/vendor/services'
import { getContract } from '../../modules/contract/selectors'

export type Props = {
  open: boolean
  authorization: Authorization
  authorizations: Authorization[]
  isAuthorizing: boolean
  isLoading?: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onCancel: () => void
  onProceed: () => void
}

export type MapStateProps = Pick<
  Props,
  'authorizations' | 'isAuthorizing' | 'getContract'
>
export type MapDispatchProps = {}
export type MapDispatch = Dispatch
export type OwnProps = Pick<
  Props,
  'open' | 'authorization' | 'onProceed' | 'isLoading'
>
