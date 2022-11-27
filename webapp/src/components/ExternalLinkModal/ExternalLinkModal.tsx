import React from 'react'
import Icon from 'semantic-ui-react/dist/commonjs/elements/Icon'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Props } from './ExternalLinkModal.types'
import './ExternalLinkModal.css'

const ExternalLinkModal = ({ link, onClose }: Props) => {
  return (
    <Modal className="ExternalLinkModal" open onClose={onClose} size="small">
      <Modal.Header>
        <Icon name="warning sign" />
        <span>{t('external_link_modal.header')}</span>
      </Modal.Header>
      <Modal.Content>
        <p>{t('external_link_modal.before_link')}</p>
        <p className="bold">{link}</p>
        <p>{t('external_link_modal.after_link')}</p>
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
