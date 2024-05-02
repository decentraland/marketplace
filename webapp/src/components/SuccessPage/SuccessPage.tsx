import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames'
import Lottie from 'lottie-react'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Button, Header, Icon, Loader } from 'decentraland-ui'
import { config } from '../../config'
import { Asset, AssetType } from '../../modules/asset/types'
import { locations } from '../../modules/routing/locations'
import { isOfEnumType } from '../../utils/enums'
import { AssetImage } from '../AssetImage'
import { AssetProvider } from '../AssetProvider'
import { PageLayout } from '../PageLayout'
import successAnimation from './successAnimation.json'
import { Props } from './SuccessPage.types'
import styles from './SuccessPage.module.css'

const EXPLORER_URL = config.get('EXPLORER_URL', '')
const BUILDER_URL = config.get('BUILDER_URL', '')

const SuccessPageLoadingStateDescription = () => {
  return (
    <div className={styles.viewProgress}>
      <Icon inverted color="grey" name="info circle" />
      <div>
        {t('success_page.loading_state.description', {
          br: () => <br />,
          highlight: (text: string) => <span className={styles.highlighted}>{text}</span>,
          link: (text: string) => <Link to={locations.activity()}>{text}</Link>
        })}
      </div>
    </div>
  )
}

export function SuccessPage(props: Props) {
  const { isLoading, mintedTokenId, profile, onSetNameAsAlias } = props
  const search = new URLSearchParams(useLocation().search)
  const contractAddress = search.get('contractAddress')
  const tokenId = search.get('tokenId')
  const assetType = isOfEnumType(search.get('assetType'), AssetType) ? (search.get('assetType') as AssetType) : null
  const subdomain = search.get('subdomain')

  // this is a workaround to show the NAME while the transaction is being mined or the tokenId getting retrieved.
  if (subdomain && (isLoading || !tokenId)) {
    return (
      <PageLayout className={styles.pageContainer}>
        <div className={styles.container}>
          <Header className={styles.title}>{t('success_page.loading_state.subdomain.title')}</Header>
          <AssetImage
            asset={{ category: 'ens', data: { ens: { subdomain } } } as Asset}
            className={classNames(styles.assetImage, styles.loading)}
          />

          <div className={styles.statusInfo}>
            <Loader size="small" inline active />
            {t('success_page.loading_state.status')}
          </div>
          <SuccessPageLoadingStateDescription />
        </div>
      </PageLayout>
    )
  }

  if (contractAddress && !tokenId && isLoading) {
    // in this case, we asume the tokenId is getting trieved and it's waiting for the tx to be mined
    return (
      <PageLayout className={styles.pageContainer}>
        <div className={styles.container}>
          <Header className={styles.title}>{t('success_page.loading_state.item.title')}</Header>

          <div className={styles.statusInfo}>
            <Loader size="small" inline active />
            {t('success_page.loading_state.status')}
          </div>
          <SuccessPageLoadingStateDescription />
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout className={styles.pageContainer}>
      <div className={styles.container}>
        {assetType && contractAddress && tokenId ? (
          <AssetProvider retry type={assetType as AssetType} contractAddress={contractAddress} tokenId={tokenId}>
            {asset => {
              if (!asset) {
                return <Loader data-testid="asset-loader" size="massive" active />
              }

              if (isLoading) {
                return (
                  <>
                    <Header className={styles.title}>{t('success_page.loading_state.item.title')}</Header>
                    <AssetImage asset={asset} isSmall className={classNames(styles.assetImage, styles.loading)} />
                    <div className={styles.statusInfo}>
                      <Loader size="small" inline active />
                      {t('success_page.loading_state.status')}
                    </div>
                    <SuccessPageLoadingStateDescription />
                  </>
                )
              }

              return (
                <>
                  <Lottie animationData={successAnimation} loop={1} className={styles.animation} />
                  <Header className={styles.title}>{t('success_page.success_state.title')}</Header>
                  <AssetImage asset={asset} className={styles.assetImage} />
                  <span className={classNames(styles.statusInfo, styles.success)}>
                    <Icon name="check circle" className={styles.checkIcon} />
                    {t('success_page.success_state.status')}
                  </span>
                  <div className={styles.actionContainer}>
                    {assetType === AssetType.ITEM && !isLoading && mintedTokenId ? (
                      <AssetProvider retry type={AssetType.NFT} contractAddress={contractAddress} tokenId={mintedTokenId.toString()}>
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
                          <div className={styles.ensActions}>
                            <div className={styles.primaryEnsActions}>
                              <Button as={Link} className={styles.successButton} secondary to={locations.claimName()}>
                                {t('success_page.success_state.mint_more_names')}
                              </Button>
                              {!!profile && (
                                <>
                                  <Button className={styles.successButton} primary onClick={() => onSetNameAsAlias(asset.name)}>
                                    {t('success_page.success_state.set_as_primary_name')}
                                  </Button>
                                </>
                              )}
                            </div>
                            {!!profile && (
                              <div>
                                <Button inverted fluid as={'a'} href={BUILDER_URL + '/names'}>
                                  <div className={styles.manageNames}>
                                    <div className={styles.manageNamesIcon}></div>
                                    {t('success_page.success_state.manage_names')}
                                  </div>
                                </Button>
                              </div>
                            )}
                          </div>
                        ) : asset.category === NFTCategory.PARCEL || asset.category === NFTCategory.ESTATE ? (
                          <div className={styles.ensActions}>
                            <div className={styles.primaryEnsActions}>
                              <Button as={Link} className={styles.successButton} secondary to={locations.nft(contractAddress, tokenId)}>
                                {t('success_page.success_state.manage_land')}
                              </Button>
                              {!!profile && (
                                <>
                                  <Button className={styles.successButton} primary href={BUILDER_URL + '/scenes'}>
                                    {t('success_page.success_state.start_building')}
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
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

                    {(asset.category === NFTCategory.WEARABLE || asset.category === NFTCategory.EMOTE) && (
                      <Button className={styles.successButton} primary as="a" href={EXPLORER_URL} target="_blank">
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
              <h1 className={styles.errorTitle}>{t('success_page.error_state.title')}</h1>
              <p className={styles.errorDescription}>{t('success_page.error_state.description')}</p>
            </div>
            <Button as={Link} primary to={locations.activity()}>
              {t('success_page.error_state.go_to_activity')}
            </Button>
          </div>
        )}
      </div>
    </PageLayout>
  )
}
