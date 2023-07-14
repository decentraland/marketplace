import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { ModalNavigation } from 'decentraland-ui'
import { Props } from './SmartWearableVideoShowcaseModal.types'
import styles from './SmartWearableVideoShowcaseModal.module.css'

const SmartWearableVideoShowcaseModal = (props: Props) => {
  const {
    // metadata: { item },
    onClose
  } = props

  return (
    <Modal size="tiny" className={styles.modal} onClose={onClose} open>
      <ModalNavigation
        title={t('smart_wearable_video_showcase_modal.title')}
        onClose={onClose}
      />
      <Modal.Content className={styles.content}>
        <video
          // TODO: use the item video url instead of the hardcoded one
          src="https://www.youtube.com/watch?v=crqI_aDlYYM"
          className={styles.video}
          autoPlay
          controls
          loop
          muted
          playsInline
        />
      </Modal.Content>
    </Modal>
  )
}

export default React.memo(SmartWearableVideoShowcaseModal)
