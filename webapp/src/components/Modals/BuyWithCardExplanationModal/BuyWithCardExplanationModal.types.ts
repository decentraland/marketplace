import { Dispatch } from 'redux'
import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'
import { Asset } from '../../../modules/asset/types'
import { openTransak, OpenTransakAction } from '../../../modules/transak/actions'

export type Metadata = {
  asset: Asset
}

export type Props = Omit<ModalProps, 'metadata'> & {
  metadata: Metadata
  onContinue: typeof openTransak
}

export type OwnProps = Pick<Props, 'metadata'>
export type MapDispatchProps = Pick<Props, 'onContinue'>
export type MapDispatch = Dispatch<OpenTransakAction>
