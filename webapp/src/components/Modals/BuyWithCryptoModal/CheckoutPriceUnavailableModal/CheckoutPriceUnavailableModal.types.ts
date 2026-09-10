import { ModalProps } from 'decentraland-dapps/dist/providers/ModalProvider/ModalProvider.types'

export type Props = Pick<ModalProps, 'name' | 'onClose'> & {
  /** True while what the modal stands in for is still being resolved, false once it is known to be unresolvable. */
  isLoading: boolean
  /** Overrides the wording for a checkout that something other than the price is holding up. */
  title?: string
  description?: string
}
