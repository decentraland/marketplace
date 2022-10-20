import { RentalListing } from '@dcl/schemas'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

export type Metadata = {
  rental: RentalListing
  periodIndexChosen: number
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapStateProps = Props
