import React, { useMemo } from 'react'
import classNames from 'classnames'
import { RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Loader } from 'decentraland-ui'
import { AssetType } from '../../modules/asset/types'
import { AssetProvider } from '../AssetProvider'
import { Props } from './AssetProviderPage.types'
import styles from './AssetProviderPage.module.css'

const Loading = ({ fullWidth }: { fullWidth: boolean }) => (
  <div className={classNames(styles.center, fullWidth && styles.fullWidth)}>
    <Loader active size="huge" />
  </div>
)

// Exporting to reuse in the BuyPage as a quick fix
export const NotFound = () => (
  <div className={styles.center}>
    <p className="secondary-text">{t('global.not_found')}&hellip;</p>
  </div>
)

const AssetProviderPage = (props: Props) => {
  const { type, isConnecting, children, fullWidth = false } = props
  const rentalStatuses: RentalStatus[] | undefined = useMemo(
    () => (type === AssetType.NFT ? [RentalStatus.OPEN, RentalStatus.EXECUTED, RentalStatus.CANCELLED] : undefined),
    [type]
  )

  return (
    <AssetProvider type={type} rentalStatus={rentalStatuses}>
      {(asset, order, rental, isAssetLoading) => {
        const isLoading = isConnecting || isAssetLoading

        return (
          <>
            {isLoading ? <Loading fullWidth={fullWidth} /> : null}
            {!isLoading && !asset ? <NotFound /> : null}
            {!isLoading && asset ? children(asset, order, rental) : null}
          </>
        )
      }}
    </AssetProvider>
  )
}

export default React.memo(AssetProviderPage)
