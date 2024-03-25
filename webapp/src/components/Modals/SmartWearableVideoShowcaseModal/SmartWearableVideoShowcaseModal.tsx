import React from 'react'
import { Modal } from 'decentraland-dapps/dist/containers'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Loader, ModalNavigation } from 'decentraland-ui'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import { VIDEO_TEST_ID } from './constants'
import { Props } from './SmartWearableVideoShowcaseModal.types'
import styles from './SmartWearableVideoShowcaseModal.module.css'

const SmartWearableVideoShowcaseModal = (props: Props) => {
  const {
    metadata: { videoHash },
    onClose
  } = props

  return (
    <Modal size="tiny" className={styles.modal} onClose={onClose} open>
      <ModalNavigation title={t('smart_wearable_video_showcase_modal.title')} onClose={onClose} />
      <Modal.Content className={styles.content}>
        {videoHash ? (
          <video
            src={builderAPI.contentUrl(videoHash)}
            className={styles.video}
            autoPlay
            controls
            muted
            playsInline
            data-testid={VIDEO_TEST_ID}
            height={364}
            preload="auto"
          />
        ) : (
          <Loader size="big" />
        )}
      </Modal.Content>
    </Modal>
  )
}

export default React.memo(SmartWearableVideoShowcaseModal)
