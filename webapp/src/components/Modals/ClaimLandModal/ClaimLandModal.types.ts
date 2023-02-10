import { RentalListing } from '@dcl/schemas'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { NFT } from '../../../modules/nft/types'

export type Metadata = {
  nft: NFT
  rental: RentalListing
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  isTransactionBeingConfirmed: boolean
  isSubmittingTransaction: boolean
  error: string | null
  onSubmitTransaction: () => void
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<Props, 'isTransactionBeingConfirmed' | 'isSubmittingTransaction' | 'error'>
export type MapDispatchProps = Pick<Props, 'onSubmitTransaction'>
