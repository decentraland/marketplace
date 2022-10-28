import { Link } from 'react-router-dom'
import {
  Back,
  Button,
  Footer,
  Loader,
  Mobile,
  Narrow,
  NotMobile,
  Page,
  Section
} from 'decentraland-ui'
import { NFTCategory, RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../modules/asset/types'
import { builderUrl } from '../../lib/environment'
import { NFT } from '../../modules/nft/types'
import { locations } from '../../modules/routing/locations'
import { Navbar } from '../Navbar'
import { ErrorBoundary } from '../AssetPage/ErrorBoundary'
import { AssetProvider } from '../AssetProvider'
import { NavigationTab } from '../Navigation/Navigation.types'
import { Navigation } from '../Navigation'
import { Column } from '../Layout/Column'
import { Highlights } from './Highlights'
import styles from './ManageAssetPage.module.css'
import { Props } from './ManageAssetPage.types'
import { Details } from './Details'
import { Sell } from './Sell'
import { Rent } from './Rent'
import { Map } from './Map'

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

// This page should be ideally provided by a protected router
const Unauthorized = () => (
  <div className={styles.center}>
    <p className="secondary-text">{t('global.unauthorized')}&hellip;</p>
  </div>
)

export const ManageAssetPage = (props: Props) => {
  const { onBack, userAddress, isConnecting } = props

  const handleOpenInBuilder = (asset: NFT) => {
    window.location.replace(
      `${builderUrl}/land/${
        asset.category === NFTCategory.ESTATE
          ? `${asset.tokenId}`
          : `${asset.data.parcel?.x},${asset.data.parcel?.y}`
      }`
    )
  }

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_STORE} />
      <Page>
        <ErrorBoundary>
          <Section>
            <AssetProvider
              type={AssetType.NFT}
              rentalStatus={[RentalStatus.EXECUTED, RentalStatus.OPEN]}
            >
              {(asset, order, rental, isLoading) => (
                <>
                  <Back className="back" absolute onClick={onBack} />
                  {isLoading || isConnecting ? <Loading /> : null}
                  {!isLoading && !asset ? <NotFound /> : null}
                  {userAddress &&
                  !isConnecting &&
                  !isLoading &&
                  userAddress === asset?.owner ? (
                    <>
                      <Narrow className={styles.mainRow}>
                        <NotMobile>
                          <Column className={styles.leftMenu}>
                            {asset && !isLoading ? (
                              <>
                                <Map asset={asset} />
                                <Button
                                  className={styles.builderButton}
                                  primary
                                  onClick={() => handleOpenInBuilder(asset)}
                                >
                                  {t('manage_asset_page.open_in_builder')}
                                </Button>
                                <Highlights
                                  className={styles.highlights}
                                  nft={asset as NFT}
                                />
                                <Details
                                  asset={asset as NFT}
                                  className={styles.details}
                                />
                              </>
                            ) : null}
                          </Column>
                          <Column className={styles.content}>
                            {asset && !isLoading ? (
                              <>
                                <section className={styles.assetDescription}>
                                  <div
                                    className={styles.assetDescriptionHeader}
                                  >
                                    <h1
                                      className={styles.assetDescriptionTitle}
                                    >
                                      {asset?.name}
                                    </h1>
                                    <div
                                      className={styles.assetDescriptionOptions}
                                    >
                                      <Button
                                        className={styles.transfer}
                                        as={Link}
                                        to={locations.transfer(
                                          asset.contractAddress,
                                          asset.tokenId
                                        )}
                                        fluid
                                      >
                                        {t('manage_asset_page.transfer')}
                                      </Button>
                                    </div>
                                  </div>
                                  <p className={styles.assetDescriptionContent}>
                                    {asset?.data.estate?.description ||
                                      asset?.data.parcel?.description}
                                  </p>
                                </section>
                                <Sell nft={asset} order={order} />
                                <Rent nft={asset} rental={rental} />
                              </>
                            ) : null}
                          </Column>
                        </NotMobile>
                        <Mobile>
                          <Column className={styles.columnMobile}>
                            {asset && !isLoading ? (
                              <>
                                <Map asset={asset} />
                                <Button
                                  className={styles.builderButton}
                                  primary
                                  onClick={() => handleOpenInBuilder(asset)}
                                >
                                  {t('manage_asset_page.open_in_builder')}
                                </Button>
                                <Highlights
                                  className={styles.highlights}
                                  nft={asset as NFT}
                                />
                                <Details
                                  asset={asset as NFT}
                                  className={styles.details}
                                />
                              </>
                            ) : null}
                            {asset && !isLoading ? (
                              <>
                                <section className={styles.assetDescription}>
                                  <div
                                    className={styles.assetDescriptionHeader}
                                  >
                                    <h1
                                      className={styles.assetDescriptionTitle}
                                    >
                                      {asset?.name}
                                    </h1>
                                    <div
                                      className={styles.assetDescriptionOptions}
                                    >
                                      <Button
                                        className={styles.transfer}
                                        as={Link}
                                        to={locations.transfer(
                                          asset.contractAddress,
                                          asset.tokenId
                                        )}
                                        fluid
                                      >
                                        {t('manage_asset_page.transfer')}
                                      </Button>
                                    </div>
                                  </div>
                                  <p className={styles.assetDescriptionContent}>
                                    {asset?.data.estate?.description ||
                                      asset?.data.parcel?.description}
                                  </p>
                                </section>
                                <Sell nft={asset} order={order} />
                                <Rent nft={asset} rental={rental} />
                              </>
                            ) : null}
                          </Column>
                        </Mobile>
                      </Narrow>
                    </>
                  ) : (
                    <Unauthorized />
                  )}
                </>
              )}
            </AssetProvider>
          </Section>
        </ErrorBoundary>
      </Page>
      <Footer />
    </>
  )
}
