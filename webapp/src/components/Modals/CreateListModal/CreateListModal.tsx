import React, { useCallback, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Button,
  Checkbox,
  Field,
  Modal,
  ModalNavigation
} from 'decentraland-ui'
import styles from './CreateListModal.module.css'
import { Props } from './CreateListModal.types'

const CreateListModal = ({
  onClose,
  isLoading,
  onCreateList
}: // error
Props) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)

  const handleCreateList = useCallback(
    () => onCreateList({ name, description, isPrivate }),
    [onCreateList, name, description, isPrivate]
  )
  const handleNameChange = useCallback(
    (_event, props) => setName(props.value),
    [setName]
  )
  const handleDescriptionChange = useCallback(
    (_event, props) => setDescription(props.value),
    [setDescription]
  )
  const handleIsOPrivateChange = useCallback(
    (_event, props) => setIsPrivate(props.checked),
    [setIsPrivate]
  )

  return (
    <Modal
      size="small"
      className={styles.modal}
      onClose={!isLoading ? onClose : undefined}
    >
      <ModalNavigation
        title={t('create_list_modal.title')}
        onClose={!isLoading ? onClose : undefined}
        data-testid="favorites-modal"
      />
      <Modal.Content className={styles.content}>
        <Field
          label={t('create_list_modal.name')}
          message="Some warning"
          error
          value={name}
          disabled={isLoading}
          maxlength={32}
          onChange={handleNameChange}
        />
        <Field
          label={t('create_list_modal.description')}
          message="Some warning"
          error
          value={description}
          maxlength={100}
          disabled={isLoading}
          onChange={handleDescriptionChange}
        />
        <Checkbox
          checked={isPrivate}
          label={t('create_list_modal.private')}
          disabled={isLoading}
          onChange={handleIsOPrivateChange}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose} disabled={isLoading}>
          {t('global.cancel')}
        </Button>
        <Button primary disabled={isLoading} onClick={handleCreateList}>
          {t('global.create')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(CreateListModal)
