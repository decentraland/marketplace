import { RentalListing } from '@dcl/schemas'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { NFT } from '../../../modules/nft/types'

export type Metadata = {
  nft: NFT
  rental: RentalListing
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  onClaimLand: () => void
  isClaimingLand: boolean
  isSigningTransaction: boolean
  error: string | null
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Pick<
  Props,
  'isClaimingLand' | 'isSigningTransaction' | 'error'
>
export type MapDispatchProps = Pick<Props, 'onClaimLand'>
