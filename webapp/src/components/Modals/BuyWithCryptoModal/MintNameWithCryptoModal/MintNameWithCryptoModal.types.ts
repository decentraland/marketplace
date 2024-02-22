import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import type { Route } from 'decentraland-transactions/crossChain'
import { Contract } from '../../../../modules/vendor/services'
import { getContract } from '../../../../modules/contract/selectors'
import { claimNameRequest } from '../../../../modules/ens/actions'

export type Props = WithAuthorizedActionProps & Omit<ModalProps, 'metadata'> & {
  metadata: { name: string }
  isMintingName: boolean
  isMintingNameCrossChain: boolean
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onClaimName: typeof claimNameRequest
  onOpenFatFingerModal: () => unknown
  onClaimNameCrossChain: (route: Route) => unknown
}

export type MapStateProps = Pick<Props, 'getContract' | 'isMintingName' | 'isMintingNameCrossChain'>
export type MapDispatchProps = Pick<
  Props,
  'onClaimName' | 'onClaimNameCrossChain' | 'onOpenFatFingerModal'
>
export type OwnProps = Pick<Props, 'metadata'>
