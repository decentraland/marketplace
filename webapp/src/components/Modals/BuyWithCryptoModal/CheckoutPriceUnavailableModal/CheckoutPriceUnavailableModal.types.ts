import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

export type Props = Pick<ModalProps, 'name' | 'onClose'> & {
  /** True while the listing's price is still being resolved, false once it is known to be unresolvable. */
  isLoading: boolean
}
