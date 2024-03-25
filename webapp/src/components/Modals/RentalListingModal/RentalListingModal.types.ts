import { Dispatch } from 'redux'
import { RentalListing } from '@dcl/schemas'
import { Authorization } from 'decentraland-dapps/dist/modules/authorization/types'
import { openModal } from 'decentraland-dapps/dist/modules/modal/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
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
  wallet: Wallet | null
}

export type MapStateProps = Pick<Props, 'address' | 'authorizations' | 'wallet'>
export type MapDispatchProps = Pick<Props, 'onRemove'>
export type MapDispatch = Dispatch
export type OwnProps = Pick<Props, 'metadata'>
