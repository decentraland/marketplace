import React from 'react'
import { Button, Icon, Modal } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ExternalLinkModal.types'
import './ExternalLinkModal.css'

const ExternalLinkModal = ({ link, onClose }: Props) => {
  return (
    <Modal className="ExternalLinkModal" open onClose={onClose} size="small">
      <Modal.Header>
        <Icon name="warning sign" />
        <span>You are exiting Decentraland</span>
      </Modal.Header>
      <Modal.Content>
        <p>
          By clicking <span className="bold">PROCEED</span>, you will be
          redirected to:
        </p>
        <p className="bold">{link}</p>
        <p>
          Please check twice that the link has nothing suspicious on it to avoid
          being the victim of an attack.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>{t('global.cancel')}</Button>
        <Button
          as={'a'}
          target="_blank"
          rel="noopener noreferrer"
          primary
          href={link}
          onClick={onClose}
        >
          {t('global.proceed')}
        </Button>
      </Modal.Actions>
    </Modal>
  )
}

export default React.memo(ExternalLinkModal)
