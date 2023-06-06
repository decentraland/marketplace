import React, { useMemo } from 'react'
import { Button, Icon, ModalNavigation } from 'decentraland-ui'
import Modal from 'decentraland-dapps/dist/containers/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ConfirmDeleteListModal.types'

export const CANCEL_DATA_TEST_ID = 'confirm-delete-list-modal-cancel'
export const CONFIRM_DATA_TEST_ID = 'confirm-delete-list-modal-confirm'

const ConfirmDeleteListModal = (props: Props) => {
  const { isLoading, onConfirm, onClose, metadata } = props
  const { list } = metadata

  const handleClose = useMemo(() => (!isLoading ? onClose : undefined), [
    isLoading,
    onClose
  ])

  return (
    <Modal size="tiny" onClose={handleClose}>
      <ModalNavigation
        title={t('confirm_delete_list_modal.title', {
          name: list.name,
          b: (children: React.ReactChildren) => <b>{children}</b>
        })}
        onClose={handleClose}
      />
      <Modal.Content>{t('confirm_delete_list_modal.message')}</Modal.Content>
      <Modal.Actions>
        <Button
          data-testid={CANCEL_DATA_TEST_ID}
          disabled={isLoading}
          onClick={onClose}
        >
          {t('global.cancel')}
        </Button>
        <Button
          primary
          data-testid={CONFIRM_DATA_TEST_ID}
          loading={isLoading}
          disabled={isLoading}
          onClick={onConfirm}
        >
          <Icon name="trash alternate outline" />
          {t('confirm_delete_list_modal.confirm')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(ConfirmDeleteListModal)
