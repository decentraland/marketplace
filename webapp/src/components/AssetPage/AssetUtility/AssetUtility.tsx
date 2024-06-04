import { t } from 'decentraland-dapps/dist/modules/translation'
import { Header } from 'decentraland-ui/dist/components/Header/Header'
import { Props } from './AssetUtility.types'
import styles from './AssetUtility.module.css'

export const ASSET_UTILITY_HEADER_DATA_TEST_ID = 'asset-utility-header'
export const ASSET_UTILITY_CONTENT_DATA_TEST_ID = 'asset-utility-content'

export const AssetUtility = ({ utility }: Props) => {
  return (
    <div className={styles.main}>
      <Header sub data-testid={ASSET_UTILITY_HEADER_DATA_TEST_ID}>
        {t('global.utility')}
      </Header>
      <span data-testid={ASSET_UTILITY_CONTENT_DATA_TEST_ID} className={styles.content}>
        {utility}
      </span>
    </div>
  )
}
