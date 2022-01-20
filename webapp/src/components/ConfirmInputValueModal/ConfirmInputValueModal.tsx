import React, { useState } from 'react'
import { Modal, Button, Form } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ConfirmInputValueModal.types'
import { fromMANA, toMANA } from '../../lib/mana'
import { ManaField } from '../ManaField'
import './ConfirmInputValueModal.css'

const ConfirmInputValueModal = ({
  open,
  content,
  headerTitle,
  valueToConfirm,
  onCancel,
  onConfirm,
  loading = false,
  disabled = false,
  network
}: Props) => {
  const [confirmedInput, setConfirmedInput] = useState<string>('')

  return (
    <Modal size="small" open={open} className="ConfirmInputValueModal">
      <Modal.Header>{headerTitle}</Modal.Header>
      <Form onSubmit={onConfirm}>
        <Modal.Content>
          {content}
          <ManaField
            label={t('global.price')}
            network={network}
            placeholder={valueToConfirm}
            value={confirmedInput}
            onChange={(_event, props) => {
              const newPrice = fromMANA(props.value)
              setConfirmedInput(toMANA(newPrice))
            }}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button
            type="button"
            onClick={() => {
              setConfirmedInput('')
              onCancel()
            }}
          >
            {t('global.cancel')}
          </Button>
          <Button
            type="submit"
            primary
            disabled={
              disabled || fromMANA(valueToConfirm) !== fromMANA(confirmedInput)
            }
            loading={loading}
          >
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      </Form>
    </Modal>
  )
}

export default React.memo(ConfirmInputValueModal)
