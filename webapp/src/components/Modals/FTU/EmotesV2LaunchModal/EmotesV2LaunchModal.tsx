import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal, Button, ModalNavigation } from 'decentraland-ui'
import { locations } from '../../../../modules/routing/locations'
import { Section } from '../../../../modules/vendor/decentraland'
import { Props } from './EmotesV2LaunchModal.types'
import styles from './EmotesV2LaunchModal.module.css'

const EMOTES_V2_FTU_KEY = 'emotes-v2-ftu-key'

export const EmotesV2LaunchModal = ({
  isEmotesV2FTUEnabled,
  isLoadingFeatureFlags
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = useCallback(() => {
    localStorage.setItem(EMOTES_V2_FTU_KEY, 'true')
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (
      !isLoadingFeatureFlags &&
      isEmotesV2FTUEnabled &&
      !localStorage.getItem(EMOTES_V2_FTU_KEY)
    ) {
      setIsOpen(true)
    }
  }, [isLoadingFeatureFlags, isEmotesV2FTUEnabled])

  return (
    <Modal
      open={isOpen}
      size={'small'}
      onClose={onClose}
      className={styles.emoteV2Modal}
    >
      <ModalNavigation title={t('emotes_v2_ftu.title')} onClose={onClose} />
      <div className={styles.container}>
        <video
          autoPlay
          loop
          className={styles.video}
          src={`${process.env.VITE_BASE_URL}/emotes-v2.mp4`}
          preload="auto"
          muted
        />
        <span className={styles.subtitle}>
          {t('emotes_v2_ftu.subtitle', {
            b: (text: string) => <b>{text}</b>,
            br: () => <br />
          })}
        </span>
        <Button
          as={Link}
          to={locations.browse({
            section: Section.EMOTES,
            emoteHasGeometry: true,
            emoteHasSound: true
          })}
          className={styles.actionButton}
          onClick={onClose}
          primary
        >
          {t('emotes_v2_ftu.action')}
        </Button>
        <Button
          as="a"
          href="https://docs.decentraland.org/player/market/marketplace/"
          className={styles.actionButton}
          onClick={onClose}
          secondary
        >
          {t('global.learn_more')}
        </Button>
      </div>
    </Modal>
  )
}
