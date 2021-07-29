import React from 'react'
import { Loader } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetProvider } from '../AssetProvider'
import { Props } from './AssetProviderPage.types'
import styles from './AssetProviderPage.module.css'

const Loading = () => (
  <div className={styles.center}>
    <Loader active size="huge" />
  </div>
)

const NotFound = () => (
  <div className={styles.center}>
    <p className="secondary-text">{t('global.not_found')}&hellip;</p>
  </div>
)

const AssetProviderPage = (props: Props) => {
  const { type, isConnecting, children } = props
  return (
    <AssetProvider type={type}>
      {(asset, order, isAssetLoading) => {
        const isLoading = isConnecting || isAssetLoading

        return (
          <>
            {isLoading ? <Loading /> : null}
            {!isLoading && !asset ? <NotFound /> : null}
            {!isLoading && asset ? children(asset, order) : null}
          </>
        )
      }}
    </AssetProvider>
  )
}

export default React.memo(AssetProviderPage)
