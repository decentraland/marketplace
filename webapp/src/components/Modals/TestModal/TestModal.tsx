import React from 'react'
import { Button, ModalNavigation } from 'decentraland-ui'
import { Modal } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './TestModal.types'

const TestModal = ({ name, metadata, address, onConfirm, onClose }: Props) => {
  const { title, subtitle } = metadata

  return (
    <Modal name={name} onClose={onClose}>
      <ModalNavigation title={'Test Modal :)'} onClose={onClose} />
      <Modal.Content>
        <p>
          This modal is just for checking that the modals module was implemented
          correctly, it should be deleted on the future or just kept to copy
          paste new modals.
        </p>
        <p>Address of the connected user: {address}</p>
        <p>Metadata title: {title}</p>
        <p>Metadata subtitle: {subtitle}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button secondary onClick={onClose}>
          {t('global.cancel')}
        </Button>
        <Button primary onClick={onConfirm}>
          {t('global.confirm')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(TestModal)
