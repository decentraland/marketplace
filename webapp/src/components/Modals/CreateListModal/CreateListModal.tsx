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
const DUPLICATED_ERROR = 'There is already a list with the same name'
export const CREATE_LIST_NAME_DATA_TEST_ID = 'create-list-name'
export const CREATE_LIST_DESCRIPTION_DATA_TEST_ID = 'create-list-description'
export const CREATE_LIST_PRIVATE_DATA_TEST_ID = 'create-list-private'
export const CREATE_LIST_CANCEL_BUTTON_DATA_TEST_ID =
  'create-list-cancel-button'
export const CREATE_LIST_ACCEPT_BUTTON_DATA_TEST_ID =
  'create-list-accept-button'

const CreateListModal = ({
  onClose,
  isLoading,
  onCreateList,
  error
}: Props) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [showMaxLengthNameInfo, setShowMaxLengthNameInfo] = useState(false)
  const [
    showMaxLengthDescriptionInfo,
    setShowMaxLengthDescriptionInfo
  ] = useState(false)

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
  const handleNameFocus = useCallback(() => setShowMaxLengthNameInfo(true), [
    setShowMaxLengthNameInfo
  ])
  const handleNameBlur = useCallback(() => setShowMaxLengthNameInfo(false), [
    setShowMaxLengthNameInfo
  ])
  const handleDescriptionFocus = useCallback(
    () => setShowMaxLengthDescriptionInfo(true),
    [setShowMaxLengthDescriptionInfo]
  )
  const handleDescriptionBlur = useCallback(
    () => setShowMaxLengthDescriptionInfo(false),
    [setShowMaxLengthDescriptionInfo]
  )
  const handleClose = useCallback(() => {
    if (!isLoading) {
      onClose()
    }
  }, [isLoading, onClose])

  const isNameDuplicatedError = error?.includes(DUPLICATED_ERROR)

  return (
    <Modal size="tiny" className={styles.modal} onClose={handleClose}>
      <ModalNavigation
        title={t('create_list_modal.title')}
        onClose={handleClose}
      />
      <Modal.Content className={styles.content}>
        <Field
          label={t('create_list_modal.name')}
          data-testid={CREATE_LIST_NAME_DATA_TEST_ID}
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
          onFocus={handleNameFocus}
          onBlur={handleNameBlur}
          info={
            showMaxLengthNameInfo
              ? t('create_list_modal.info.max_name_length', {
                  max: MAX_NAME_LENGTH
                })
              : undefined
          }
          maxLength={MAX_NAME_LENGTH}
          onChange={handleNameChange}
        />
        <TextAreaField
          label={t('create_list_modal.description')}
          data-testid={CREATE_LIST_DESCRIPTION_DATA_TEST_ID}
          value={description}
          className={styles.description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          disabled={isLoading}
          onFocus={handleDescriptionFocus}
          onBlur={handleDescriptionBlur}
          info={
            showMaxLengthDescriptionInfo
              ? t('create_list_modal.info.max_description_length', {
                  max: MAX_DESCRIPTION_LENGTH
                })
              : undefined
          }
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
          onClick={handleClose}
          data-testid={CREATE_LIST_CANCEL_BUTTON_DATA_TEST_ID}
          disabled={isLoading}
        >
          {t('global.cancel')}
        </Button>
        <Button
          primary
          disabled={isLoading || name.length === 0}
          data-testid={CREATE_LIST_ACCEPT_BUTTON_DATA_TEST_ID}
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
