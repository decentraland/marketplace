import { Dispatch } from 'redux'
import { RentalListing } from '@dcl/schemas'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { NFT } from '../../../modules/nft/types'

export type RentalModalMetadata = {
  nft: NFT
  rental: RentalListing | null
}

export type Props = Omit<ModalProps, 'metadata'> & {
  address: string | undefined
  authorizations: Authorization[]
  metadata: RentalModalMetadata
  onRemove: (nft: NFT) => ReturnType<typeof openModal>
}

export type MapStateProps = Pick<Props, 'address' | 'authorizations'>
export type MapDispatchProps = Pick<Props, 'onRemove'>
export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'metadata'>
