import { Item } from '@dcl/schemas'
import { AuthIdentity } from 'decentraland-crypto-fetch'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { ListOfLists } from '../../../modules/vendor/decentraland/favorites'

type Metadata = {
  item: Item
}

export enum PickType {
  PICK_FOR = 'pickFor',
  UNPICK_FROM = 'unpickFrom'
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  identity: AuthIdentity | undefined
  isSavingPicks: boolean
  onSavePicks: (picksFor: ListOfLists[], picksFrom: ListOfLists[]) => void
  onCreateList: () => void
}

export type MapStateProps = Pick<Props, 'identity' | 'isSavingPicks'>
export type OwnProps = Pick<Props, 'metadata' | 'onClose'>
export type MapDispatchProps = Pick<Props, 'onSavePicks' | 'onCreateList'>
