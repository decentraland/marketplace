import React, { useState } from 'react'
import { Modal, Button, ModalNavigation } from 'decentraland-ui'
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

  const parsedValueToConfirm = parseFloat(valueToConfirm).toString()

  const isDisabled = disabled || parsedValueToConfirm !== confirmedInput

  return (
    <Modal size="small" open={open} className="ConfirmInputValueModal">
      <ModalNavigation title={headerTitle} onClose={onCancel}></ModalNavigation>
      <Modal.Content>
        {content}
        <ManaField
          label={t('global.price')}
          network={network}
          placeholder={parsedValueToConfirm}
          value={confirmedInput}
          onChange={(_event, props) => {
            setConfirmedInput(props.value)
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
          disabled={isDisabled}
          loading={loading}
          onClick={onConfirm}
        >
          {t('global.proceed')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(ConfirmInputValueModal)
