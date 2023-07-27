import React, { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal } from 'decentraland-dapps/dist/containers'
import { Loader, ModalNavigation } from 'decentraland-ui'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import { getSmartWearableVideoShowcase } from '../../../lib/asset'
import { VIDEO_TEST_ID } from './constants'
import { Props } from './SmartWearableVideoShowcaseModal.types'
import styles from './SmartWearableVideoShowcaseModal.module.css'

const SmartWearableVideoShowcaseModal = (props: Props) => {
  const {
    metadata: { asset },
    onClose
  } = props
  const [videoSrc, setVideoSrc] = useState<string | undefined>(undefined)

  const fetchVideoSrc = useCallback(async () => {
    if (!asset?.urn) return

    const videoHash = await getSmartWearableVideoShowcase(asset)
    if (videoHash) setVideoSrc(builderAPI.contentUrl(videoHash))
  }, [asset])

  useEffect(() => {
    fetchVideoSrc()
  }, [fetchVideoSrc])

  return (
    <Modal size="tiny" className={styles.modal} onClose={onClose} open>
      <ModalNavigation
        title={t('smart_wearable_video_showcase_modal.title')}
        onClose={onClose}
      />
      <Modal.Content className={styles.content}>
        {videoSrc ? (
          <video
            src={videoSrc}
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
