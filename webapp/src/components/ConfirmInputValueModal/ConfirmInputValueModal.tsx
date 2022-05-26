import React, { useState } from 'react'
import { Modal, Button, Form } from 'decentraland-ui'
import { toFixedMANAValue } from 'decentraland-dapps/dist/lib/mana'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ConfirmInputValueModal.types'
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

  const isDisabled = disabled || valueToConfirm !== confirmedInput

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
              setConfirmedInput(toFixedMANAValue(props.value))
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
          <Button type="submit" primary disabled={isDisabled} loading={loading}>
            {t('global.proceed')}
          </Button>
        </Modal.Actions>
      </Form>
    </Modal>
  )
}

export default React.memo(ConfirmInputValueModal)
