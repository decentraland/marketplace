import { Contract, RentalListing } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { NFT } from '../../../modules/nft/types'
import { WithAuthorizedActionProps } from 'decentraland-dapps/dist/containers/withAuthorizedAction'
import { getContract } from '../../../modules/contract/selectors'
import { clearRentalErrors } from '../../../modules/rental/actions'

export type Metadata = {
  nft: NFT
  rental: RentalListing
  selectedPeriodIndex: number
}

export type Props = Omit<ModalProps, 'metadata'> & {
  wallet: Wallet | null
  metadata: Metadata
  onSubmitTransaction: (addressOperator: string) => void
  isTransactionBeingConfirmed: boolean
  isSubmittingTransaction: boolean
  error: string | null
  getContract: (query: Partial<Contract>) => ReturnType<typeof getContract>
  onClearRentalErrors: typeof clearRentalErrors
} & WithAuthorizedActionProps

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<
  Props,
  | 'wallet'
  | 'isTransactionBeingConfirmed'
  | 'isSubmittingTransaction'
  | 'error'
  | 'getContract'
>
export type MapDispatchProps = Pick<Props, 'onSubmitTransaction' | 'onClearRentalErrors'>
