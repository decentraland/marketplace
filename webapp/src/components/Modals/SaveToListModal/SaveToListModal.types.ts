import { Item } from '@dcl/schemas'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { ListOfLists } from '../../../modules/vendor/decentraland/favorites'
import { OverrideCreateListTypes } from '../CreateOrEditListModal/CreateOrEditListModal.types'

type Metadata = {
  item: Item
}

export enum PickType {
  PICK_FOR = 'pickFor',
  UNPICK_FROM = 'unpickFrom'
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  isSavingPicks: boolean
  wallet: Wallet | null
  onSavePicks: (picksFor: ListOfLists[], picksFrom: ListOfLists[]) => void
  onCreateList: (params: OverrideCreateListTypes) => void
  onFinishListCreation: () => void
}

export type MapStateProps = Pick<Props, 'isSavingPicks' | 'wallet'>
export type OwnProps = Pick<Props, 'metadata' | 'onClose'>
export type MapDispatchProps = Pick<
  Props,
  'onSavePicks' | 'onCreateList' | 'onFinishListCreation'
>
