import React, { useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal, Button, ModalNavigation, Message } from 'decentraland-ui'
import { ManaField } from '../ManaField'
import { Props } from './ConfirmInputValueModal.types'
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
  error,
  network
}: Props) => {
  const [confirmedInput, setConfirmedInput] = useState<string>('')

  const parsedValueToConfirm = parseFloat(valueToConfirm).toString()

  const isDisabled = disabled || parsedValueToConfirm !== confirmedInput

  return (
    <Modal size="small" open={open} onClose={!loading ? onCancel : undefined} className="ConfirmInputValueModal">
      <ModalNavigation title={headerTitle} onClose={!loading ? onCancel : undefined}></ModalNavigation>
      <Modal.Content>
        {content}
        <ManaField
          label={t('global.price')}
          network={network}
          disabled={loading}
          placeholder={parsedValueToConfirm}
          value={confirmedInput}
          onChange={(_event, props) => {
            setConfirmedInput(props.value)
          }}
        />
        {error ? <Message error size="tiny" visible content={error} header={t('global.error')} /> : null}
      </Modal.Content>
      <Modal.Actions>
        <Button
          type="button"
          disabled={loading}
          onClick={() => {
            setConfirmedInput('')
            onCancel()
          }}
        >
          {t('global.cancel')}
        </Button>
        <Button type="submit" primary disabled={isDisabled || loading} loading={loading} onClick={onConfirm}>
          {t('global.proceed')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(ConfirmInputValueModal)
