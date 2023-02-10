import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { NFT } from '../../../modules/nft/types'

export type Metadata = {
  nft: NFT
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  onSubmitTransaction: () => void
  isTransactionBeingConfirmed: boolean
  isSubmittingTransaction: boolean
  error: string | null
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<Props, 'isTransactionBeingConfirmed' | 'isSubmittingTransaction' | 'error'>
export type MapDispatchProps = Pick<Props, 'onSubmitTransaction'>
