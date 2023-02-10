import React from 'react'
import { T, t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Modal } from 'decentraland-ui'
import { Props } from './LeavingSiteModal.types'

const BuyWithCardExplanationModal = ({
  metadata: {
    nft: { url, vendor }
  },
  onClose
}: Props) => (
  <Modal className="LeavingSiteModal" size="small" open onClose={onClose}>
    <Modal.Header>{t('asset_page.actions.leaving_decentraland')}</Modal.Header>
    <Modal.Content>
      <p>
        <T
          id="asset_page.actions.leaving_decentraland_description"
          values={{
            vendor: t(`vendors.${vendor}`),
            vendor_link: (
              <a href={url} target="_blank" rel="noopener noreferrer">
                {url}
              </a>
            )
          }}
        />
        <br />
        <br />
        <small>
          <i>{t('asset_page.actions.leaving_decentraland_disclaimer')}</i>
        </small>
      </p>
    </Modal.Content>
    <Modal.Actions>
      <Button onClick={onClose}>{t('global.cancel')}</Button>
      <Button primary as="a" href={url} target="_blank" rel="noopener noreferrer" onClick={onClose}>
        {t('global.proceed')}
      </Button>
    </Modal.Actions>
  </Modal>
)

export default React.memo(BuyWithCardExplanationModal)
