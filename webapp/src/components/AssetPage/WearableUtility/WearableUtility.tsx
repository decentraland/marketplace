import { t } from 'decentraland-dapps/dist/modules/translation'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Props } from './WearableUtility.types'
import styles from './WearableUtility.module.css'

export const WEARABLE_UTILITY_HEADER_DATA_TEST_ID = 'wearable-utility-header'
export const WEARABLE_UTILITY_CONTENT_DATA_TEST_ID = 'wearable-utility-content'

export const WearableUtility = ({ utility }: Props) => {
  return (
    <div className={styles.main}>
      <Header sub data-testid={WEARABLE_UTILITY_HEADER_DATA_TEST_ID}>
        {t('global.utility')}
      </Header>
      <span data-testid={WEARABLE_UTILITY_CONTENT_DATA_TEST_ID} className={styles.content}>
        {utility}
      </span>
    </div>
  )
}
