import { RentalListing } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { NFT } from '../../../modules/nft/types'

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
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<
  Props,
  'wallet' | 'isTransactionBeingConfirmed' | 'isSubmittingTransaction' | 'error'
>
export type MapDispatchProps = Pick<Props, 'onSubmitTransaction'>
