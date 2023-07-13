import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Modal, Button, ModalNavigation } from 'decentraland-ui'
import { locations } from '../../../../modules/routing/locations'
import { Section } from '../../../../modules/vendor/decentraland'
import { AssetStatusFilter } from '../../../../utils/filters'
import handsCategoryImg from '../../../../images/hands_category_img.png'
import { Props } from './HandsCategoryLaunchModal.types'
import styles from './HandsCategoryLaunchModal.module.css'

const HANDS_CATEGORY_FTU_KEY = 'hands-category-ftu-key'

export const HandsCategoryLaunchModal = ({
  isHandsCategoryEnabled,
  isLoadingFeatureFlags
}: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const onClose = useCallback(() => {
    localStorage.setItem(HANDS_CATEGORY_FTU_KEY, 'true')
    setIsOpen(false)
  }, [])

  useEffect(() => {
    if (
      !isLoadingFeatureFlags &&
      isHandsCategoryEnabled &&
      !localStorage.getItem(HANDS_CATEGORY_FTU_KEY)
    ) {
      setIsOpen(true)
    }
  }, [isLoadingFeatureFlags, isHandsCategoryEnabled])

  return (
    <Modal
      open={isOpen}
      size={'small'}
      onClose={onClose}
      className={styles.handCategoryModal}
    >
      <ModalNavigation
        title={t('hands_category_ftu.title')}
        onClose={onClose}
      />
      <div className={styles.container}>
        <img
          src={handsCategoryImg}
          aria-label={t('hands_category_ftu.img_alt')}
        />
        <span>{t('hands_category_ftu.subtitle')}</span>
        <Button
          as={Link}
          to={locations.browse({
            section: Section.WEARABLES_HANDS,
            status: AssetStatusFilter.ON_SALE
          })}
          className={styles.actionButton}
          onClick={onClose}
          primary
        >
          {t('hands_category_ftu.action')}
        </Button>
      </div>
    </Modal>
  )
}
