import React, { useCallback, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import {
  Button,
  Checkbox,
  Field,
  Message,
  ModalNavigation,
  TextAreaField
} from 'decentraland-ui'
import styles from './CreateListModal.module.css'
import { Props } from './CreateListModal.types'

const MAX_NAME_LENGTH = 32
const MAX_DESCRIPTION_LENGTH = 100

const CreateListModal = ({
  onClose,
  isLoading,
  onCreateList,
  error
}: Props) => {
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

  const isNameDuplicatedError = error?.includes(
    'There is already a list with the same name'
  )

  return (
    <Modal
      size="tiny"
      className={styles.modal}
      onClose={!isLoading ? onClose : undefined}
    >
      <ModalNavigation
        title={t('create_list_modal.title')}
        onClose={!isLoading ? onClose : undefined}
      />
      <Modal.Content className={styles.content}>
        <Field
          label={t('create_list_modal.name')}
          data-testid="create-list-name"
          className={styles.name}
          value={name}
          message={
            isNameDuplicatedError
              ? t('create_list_modal.errors.name_duplicated', {
                  br: () => <br />
                })
              : undefined
          }
          error={isNameDuplicatedError}
          disabled={isLoading}
          maxLength={MAX_NAME_LENGTH}
          onChange={handleNameChange}
        />
        <TextAreaField
          label={t('create_list_modal.description')}
          data-testid="create-list-description"
          value={description}
          className={styles.description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          disabled={isLoading}
          onChange={handleDescriptionChange}
        />
        <Checkbox
          checked={isPrivate}
          label={t('create_list_modal.private')}
          data-testid="create-list-private"
          disabled={isLoading}
          className={styles.checkbox}
          onChange={handleIsOPrivateChange}
        />
        {error && !isNameDuplicatedError ? (
          <Message
            error
            size="tiny"
            visible
            content={error}
            header={t('global.error')}
          />
        ) : null}
      </Modal.Content>
      <Modal.Actions>
        <Button
          onClick={onClose}
          data-testid="create-list-cancel-button"
          disabled={isLoading}
        >
          {t('global.cancel')}
        </Button>
        <Button
          primary
          disabled={isLoading}
          data-testid="create-list-accept-button"
          loading={isLoading}
          onClick={handleCreateList}
        >
          {t('global.create')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(CreateListModal)
