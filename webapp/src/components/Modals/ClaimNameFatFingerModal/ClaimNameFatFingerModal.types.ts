import { Dispatch } from 'redux'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { claimNameClear, claimNameRequest } from '../../../modules/ens/actions'
import { Contract } from '../../../modules/vendor/services'
import { getContract } from '../../../modules/contract/selectors'

export type Props = ModalProps & {
  isLoading: boolean
  address?: string
  metadata: {
    name: string
  }
  onClaim: typeof claimNameRequest
  onClaimNameClear: typeof claimNameClear
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
} & WithAuthorizedActionProps

export type MapState = Pick<Props, 'address' | 'getContract' | 'isLoading'>
export type MapDispatch = Dispatch
export type MapDispatchProps = Pick<Props, 'onClaim' | 'onClaimNameClear'>
