import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Modal, ModalNavigation } from 'decentraland-ui'

import styles from './BuyWithCardExplanationModal.module.css'
import { Props } from './BuyWithCardExplanationModal.types'

const BuyWithCardExplanationModal = ({
  metadata: { asset },
  onContinue,
  onClose
}: Props) => (
  <Modal open className={styles.buyWithCardExplanationModal}>
    <ModalNavigation
      title={t('buy_with_card_explanation_modal.title')}
      onClose={onClose}
    />
    <Modal.Content className={styles.content}>
      <div className={styles.explanation}>
        <p>
          {t('buy_with_card_explanation_modal.explanation', {
            link_to_transak: (
              <a
                href="https://transak.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Transak
              </a>
            )
          })}
        </p>
        <p className={styles.learnMore}>
          {/* TODO (buy nfts with card): change href to Transak Documentation when it's online. */}
          <a
            className="learn-more"
            href="https://transak.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('buy_with_card_explanation_modal.learn_more')}
          </a>
        </p>
      </div>
    </Modal.Content>
    <Modal.Actions className={styles.actions}>
      <Button primary onClick={() => onContinue(asset)}>
        {t('global.continue')}
      </Button>
      <Button secondary className={styles.cancel} onClick={onClose}>
        {t('global.go_back')}
      </Button>
    </Modal.Actions>
  </Modal>
)

export default React.memo(BuyWithCardExplanationModal)
