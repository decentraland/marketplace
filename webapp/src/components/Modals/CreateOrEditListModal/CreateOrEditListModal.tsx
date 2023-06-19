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
import styles from './CreateOrEditListModal.module.css'
import { Props } from './CreateOrEditListModal.types'

const MAX_NAME_LENGTH = 32
const MAX_DESCRIPTION_LENGTH = 100
const DUPLICATED_ERROR = 'There is already a list with the same name'
export const CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID = 'create-or-edit-list-name'
export const CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID =
  'create-or-edit-list-description'
export const CREATE_OR_EDIT_LIST_PRIVATE_DATA_TEST_ID =
  'create-or-edit-list-private'
export const CREATE_OR_EDIT_LIST_CANCEL_BUTTON_DATA_TEST_ID =
  'create-or-edit-list-cancel-button'
export const CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID =
  'create-or-edit-list-accept-button'

const CreateOrEditListModal = ({
  onClose,
  isLoading,
  onCreateList,
  onEditList,
  metadata,
  error
}: Props) => {
  const list = metadata?.list

  const [name, setName] = useState(list?.name ?? '')
  const [description, setDescription] = useState(list?.description ?? '')
  const [isPrivate, setIsPrivate] = useState(list?.isPrivate ?? false)
  const [showMaxLengthNameInfo, setShowMaxLengthNameInfo] = useState(false)
  const [
    showMaxLengthDescriptionInfo,
    setShowMaxLengthDescriptionInfo
  ] = useState(false)

  const handleCreateOrEditList = useCallback(
    () =>
      list
        ? onEditList(list.id, { name, description, isPrivate })
        : onCreateList({ name, description, isPrivate }),
    [list, onEditList, name, description, isPrivate, onCreateList]
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
  const listChanged = list
    ? name !== list.name ||
      description !== list.description ||
      isPrivate !== list.isPrivate
    : false

  return (
    <Modal size="tiny" className={styles.modal} onClose={handleClose}>
      <ModalNavigation
        title={
          list
            ? t('create_or_edit_list_modal.edit.title')
            : t('create_or_edit_list_modal.create.title')
        }
        onClose={handleClose}
      />
      <Modal.Content className={styles.content}>
        <Field
          label={t('create_or_edit_list_modal.name')}
          data-testid={CREATE_OR_EDIT_LIST_NAME_DATA_TEST_ID}
          className={styles.name}
          value={name}
          message={
            isNameDuplicatedError
              ? t('create_or_edit_list_modal.errors.name_duplicated', {
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
              ? t('create_or_edit_list_modal.info.max_name_length', {
                  max: MAX_NAME_LENGTH
                })
              : undefined
          }
          maxLength={MAX_NAME_LENGTH}
          onChange={handleNameChange}
        />
        <TextAreaField
          label={t('create_or_edit_list_modal.description')}
          data-testid={CREATE_OR_EDIT_LIST_DESCRIPTION_DATA_TEST_ID}
          value={description}
          className={styles.description}
          maxLength={MAX_DESCRIPTION_LENGTH}
          disabled={isLoading}
          onFocus={handleDescriptionFocus}
          onBlur={handleDescriptionBlur}
          info={
            showMaxLengthDescriptionInfo
              ? t('create_or_edit_list_modal.info.max_description_length', {
                  max: MAX_DESCRIPTION_LENGTH
                })
              : undefined
          }
          onChange={handleDescriptionChange}
        />
        <Checkbox
          checked={isPrivate}
          label={
            list
              ? t('create_or_edit_list_modal.edit.private')
              : t('create_or_edit_list_modal.create.private')
          }
          data-testid={CREATE_OR_EDIT_LIST_PRIVATE_DATA_TEST_ID}
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
          fluid
          primary
          disabled={isLoading || name.length === 0 || (list && !listChanged)}
          data-testid={CREATE_OR_EDIT_LIST_ACCEPT_BUTTON_DATA_TEST_ID}
          loading={isLoading}
          onClick={handleCreateOrEditList}
        >
          {list ? t('global.save') : t('global.create')}
        </Button>
        <Button
          onClick={handleClose}
          data-testid={CREATE_OR_EDIT_LIST_CANCEL_BUTTON_DATA_TEST_ID}
          disabled={isLoading}
          fluid
        >
          {t('global.cancel')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(CreateOrEditListModal)
