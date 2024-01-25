import classNames from 'classnames'
import Lottie from 'lottie-react'
import { Link, useLocation } from 'react-router-dom'
import { Button, Header, Icon, Loader } from 'decentraland-ui'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { locations } from '../../modules/routing/locations'
import { config } from '../../config'
import { Footer } from '../Footer'
import { Asset, AssetType } from '../../modules/asset/types'
import { AssetImage } from '../AssetImage'
import { AssetProvider } from '../AssetProvider'
import { Navbar } from '../Navbar'
import { Props } from './SuccessPage.types'
import successAnimation from './successAnimation.json'
import styles from './SuccessPage.module.css'

const EXPLORER_URL = config.get('EXPLORER_URL', '')

export function SuccessPage(props: Props) {
  const { isLoading, mintedTokenId, profile, onSetNameAsAlias } = props
  const search = new URLSearchParams(useLocation().search)
  const contractAddress = search.get('contractAddress')
  const tokenId = search.get('tokenId')
  const assetType = search.get('assetType')
  const subdomain = search.get('subdomain')

  // this is a workaround to show the NAME while the transaction is being mined
  if (subdomain && isLoading) {
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.container}>
          <Header className={styles.title}>
            {t('success_page.loading_state.title')}
          </Header>
          <AssetImage
            asset={{ category: 'ens', data: { ens: { subdomain } } } as Asset}
            showMonospace
            className={classNames(styles.assetImage, styles.loading)}
          />

          <div className={styles.statusInfo}>
            <Loader size="small" inline active />
            {t('success_page.loading_state.status')}
          </div>
          <span className={styles.description}>
            {t('success_page.loading_state.description')}
          </span>
          <Button secondary as={Link} to={locations.activity()}>
            {t('success_page.loading_state.progress_in_activity')}
          </Button>
        </div>
        <Footer className={styles.footer} />
      </div>
    )
  }

  if (contractAddress && !tokenId && isLoading) {
    // in this case, we asume the tokenId is getting trieved and it's waiting for the tx to be mined
    return (
      <div className={styles.pageContainer}>
        <Navbar />
        <div className={styles.container}>
          <Header className={styles.title}>
            {t('success_page.loading_state.title')}
          </Header>

          <div className={styles.statusInfo}>
            <Loader size="small" inline active />
            {t('success_page.loading_state.status')}
          </div>
          <span className={styles.description}>
            {t('success_page.loading_state.description')}
          </span>
          <Button secondary as={Link} to={locations.activity()}>
            {t('success_page.loading_state.progress_in_activity')}
          </Button>
        </div>
        <Footer className={styles.footer} />
      </div>
    )
  }

  return (
    <div className={styles.pageContainer}>
      <Navbar />
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
                    <Button secondary as={Link} to={locations.activity()}>
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
                    {assetType === AssetType.ITEM &&
                    !isLoading &&
                    mintedTokenId ? (
                      <AssetProvider
                        retry
                        type={AssetType.NFT}
                        contractAddress={contractAddress}
                        tokenId={mintedTokenId.toString()}
                      >
                        {asset => (
                          <Button
                            as={Link}
                            className={styles.successButton}
                            secondary
                            loading={!asset}
                            to={locations.nft(contractAddress, asset?.tokenId)}
                          >
                            {t('success_page.success_state.view_item')}
                          </Button>
                        )}
                      </AssetProvider>
                    ) : (
                      <>
                        {asset.category === NFTCategory.ENS ? (
                          <>
                            <Button
                              as={Link}
                              className={styles.successButton}
                              secondary
                              to={locations.claimName()}
                            >
                              {t('success_page.success_state.mint_more_names')}
                            </Button>
                            {!!profile && (
                              <Button
                                className={styles.successButton}
                                primary
                                onClick={() => onSetNameAsAlias(asset.name)}
                              >
                                {t(
                                  'success_page.success_state.set_as_primary_name'
                                )}
                              </Button>
                            )}
                          </>
                        ) : (
                          <Button
                            as={Link}
                            className={styles.successButton}
                            secondary
                            to={
                              assetType === AssetType.ITEM
                                ? locations.item(contractAddress, tokenId)
                                : locations.nft(contractAddress, tokenId)
                            }
                          >
                            {t('success_page.success_state.view_item')}
                          </Button>
                        )}
                      </>
                    )}

                    {(asset.category === NFTCategory.WEARABLE ||
                      asset.category === NFTCategory.EMOTE) && (
                      <Button
                        className={styles.successButton}
                        primary
                        as="a"
                        href={EXPLORER_URL}
                        target="_blank"
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
            <Button as={Link} primary to={locations.activity()}>
              {t('success_page.error_state.go_to_activity')}
            </Button>
          </div>
        )}
      </div>
      <Footer className={styles.footer} />
    </div>
  )
}
