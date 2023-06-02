import { useCallback } from 'react'
import classNames from 'classnames'
import Lottie from 'lottie-react'
import { useLocation } from 'react-router-dom'
import { Button, Header, Icon, Loader } from 'decentraland-ui'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { config } from '../../config'
import { Footer } from '../Footer'
import { AssetType } from '../../modules/asset/types'
import { AssetImage } from '../AssetImage'
import { AssetProvider } from '../AssetProvider'
import { Navbar } from '../Navbar'
import { Props } from './SuccessPage.types'
import successAnimation from './successAnimation.json'
import styles from './SuccessPage.module.css'

const EXPLORER_URL = config.get('EXPLORER_URL', '')

export function SuccessPage(props: Props) {
  const { isLoading, onNavigate } = props
  const search = new URLSearchParams(useLocation().search)
  const contractAddress = search.get('contractAddress')
  const tokenId = search.get('tokenId')
  const assetType = search.get('assetType')

  const handleViewInActivityPage = useCallback(() => {
    onNavigate(locations.activity())
  }, [onNavigate])

  const handleViewMyItem = useCallback(() => {
    if (contractAddress && tokenId) {
      if (assetType === AssetType.ITEM) {
        onNavigate(locations.item(contractAddress, tokenId))
      } else {
        onNavigate(locations.nft(contractAddress, tokenId))
      }
    }
  }, [contractAddress, tokenId, assetType, onNavigate])

  const handleRedirectToExplorer = useCallback(() => {
    window.open(EXPLORER_URL, '_blank')
  }, [])

  return (
    <div className={styles.pageContainer}>
      <Navbar isFullscreen />
      <div className={styles.container}>
        {assetType && contractAddress && tokenId ? (
          <AssetProvider
            type={assetType as AssetType}
            contractAddress={contractAddress}
            tokenId={tokenId}
          >
            {asset => {
              if (!asset) {
                return (
                  <Loader data-testid="asset-loader" size="massive" active />
                )
              }

              if (isLoading) {
                return (
                  <>
                    <Header className={styles.title}>
                      {t('success_page.loading_state.title')}
                    </Header>
                    <AssetImage
                      asset={asset}
                      isSmall
                      className={classNames(styles.assetImage, styles.loading)}
                    />
                    <div className={styles.statusInfo}>
                      <Loader size="small" inline active />
                      {t('success_page.loading_state.status')}
                    </div>
                    <span className={styles.description}>
                      {t('success_page.loading_state.description')}
                    </span>
                    <Button secondary onClick={handleViewInActivityPage}>
                      {t('success_page.loading_state.progress_in_activity')}
                    </Button>
                  </>
                )
              }

              return (
                <>
                  <Lottie
                    animationData={successAnimation}
                    loop={1}
                    className={styles.animation}
                  />
                  <Header className={styles.title}>
                    {t('success_page.success_state.title')}
                  </Header>
                  <AssetImage asset={asset} className={styles.assetImage} />
                  <span
                    className={classNames(styles.statusInfo, styles.success)}
                  >
                    <Icon name="check circle" className={styles.checkIcon} />
                    {t('success_page.success_state.status')}
                  </span>
                  <div className={styles.actionContainer}>
                    <Button
                      className={styles.successButton}
                      secondary
                      onClick={handleViewMyItem}
                    >
                      {t('success_page.success_state.view_item')}
                    </Button>
                    {(asset.category === NFTCategory.WEARABLE ||
                      asset.category === NFTCategory.EMOTE) && (
                      <Button
                        className={styles.successButton}
                        primary
                        onClick={handleRedirectToExplorer}
                      >
                        {t('success_page.success_state.try_genesis_city')}
                      </Button>
                    )}
                  </div>
                </>
              )
            }}
          </AssetProvider>
        ) : (
          <div className={styles.errorContainer}>
            <div className={styles.errorInfo}>
              <h1 className={styles.errorTitle}>
                {t('success_page.error_state.title')}
              </h1>
              <p className={styles.errorDescription}>
                {t('success_page.error_state.description')}
              </p>
            </div>
            <Button primary onClick={handleViewInActivityPage}>
              {t('success_page.error_state.go_to_activity')}
            </Button>
          </div>
        )}
      </div>
      <Footer className={styles.footer} />
    </div>
  )
}
