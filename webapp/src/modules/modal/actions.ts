import { getModalActions } from 'decentraland-dapps/dist/modules/modal/actions'
import { ModalName } from './types'

const { openModal, closeModal, toggleModal } = getModalActions<ModalName>()

export * from 'decentraland-dapps/dist/modules/modal/actions'
export { openModal, closeModal, toggleModal }
