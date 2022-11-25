import { useCallback, useMemo } from 'react'
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
  Popup,
  Section,
  useMobileMediaQuery
} from 'decentraland-ui'
import { NFTCategory, RentalStatus } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../modules/asset/types'
import { builderUrl } from '../../lib/environment'
import { NFT } from '../../modules/nft/types'
import { locations } from '../../modules/routing/locations'
import {
  isRentalListingExecuted,
  isLandLocked
} from '../../modules/rental/utils'
import { isOwnedBy } from '../../modules/asset/utils'
import { isParcel } from '../../modules/nft/utils'
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
  const { onBack, wallet, isConnecting } = props

  const handleOpenInBuilder = useCallback((asset: NFT) => {
    window.location.replace(
      `${builderUrl}/land/${
        asset.category === NFTCategory.ESTATE
          ? `${asset.tokenId}`
          : `${asset.data.parcel?.x},${asset.data.parcel?.y}`
      }`
    )
  }, [])

  const rentalStatus = useMemo(
    () => [RentalStatus.EXECUTED, RentalStatus.OPEN, RentalStatus.CANCELLED],
    []
  )
  const isMobileView = useMobileMediaQuery()

  return (
    <>
      <Navbar isFullscreen />
      <Navigation activeTab={NavigationTab.MY_STORE} />
      <Page>
        <ErrorBoundary>
          <Section className={styles.main}>
            <AssetProvider type={AssetType.NFT} rentalStatus={rentalStatus}>
              {(asset, order, rental, isLoading) => (
                <>
                  <Back className="back" absolute onClick={onBack} />
                  {isLoading || isConnecting ? <Loading /> : null}
                  {!isLoading && !asset ? <NotFound /> : null}
                  {!isConnecting &&
                  !isLoading &&
                  asset &&
                  wallet &&
                  isOwnedBy(asset, wallet, rental ?? undefined) ? (
                    <>
                      <Narrow className={styles.mainRow}>
                        <NotMobile>
                          <Column className={styles.leftMenu}>
                            {asset && !isLoading ? (
                              <>
                                <Map asset={asset} />
                                <Popup
                                  content={t(
                                    'manage_asset_page.land_is_locked',
                                    {
                                      asset: isParcel(asset)
                                        ? t('global.the_parcel')
                                        : t('global.the_estate')
                                    }
                                  )}
                                  position="top left"
                                  on={isMobileView ? 'click' : 'hover'}
                                  disabled={
                                    !(
                                      rental !== null &&
                                      isLandLocked(
                                        wallet.address,
                                        rental,
                                        asset
                                      )
                                    )
                                  }
                                  trigger={
                                    <span>
                                      <Button
                                        className={styles.builderButton}
                                        primary
                                        disabled={
                                          rental !== null &&
                                          isLandLocked(
                                            wallet.address,
                                            rental,
                                            asset
                                          )
                                        }
                                        onClick={() =>
                                          handleOpenInBuilder(asset)
                                        }
                                      >
                                        {t('manage_asset_page.open_in_builder')}
                                      </Button>
                                    </span>
                                  }
                                />
                                <Highlights
                                  className={styles.highlights}
                                  nft={asset as NFT}
                                />
                                <Details
                                  asset={asset as NFT}
                                  rental={rental}
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
                                        disabled={
                                          rental !== null &&
                                          isLandLocked(
                                            wallet.address,
                                            rental,
                                            asset
                                          )
                                        }
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
                                  {isRentalListingExecuted(rental) ? (
                                    <div className={styles.rentedMessage}>
                                      {t(
                                        'manage_asset_page.cant_transfer_rented_land',
                                        {
                                          asset: isParcel(asset)
                                            ? t('global.the_parcel')
                                            : t('global.the_estate')
                                        }
                                      )}
                                    </div>
                                  ) : null}
                                </section>
                                <Sell
                                  nft={asset}
                                  isLandLocked={
                                    rental !== null &&
                                    isLandLocked(wallet.address, rental, asset)
                                  }
                                  order={order}
                                />
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
                                        disabled={
                                          rental !== null &&
                                          isLandLocked(
                                            wallet.address,
                                            rental,
                                            asset
                                          )
                                        }
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
                                  {isRentalListingExecuted(rental) ? (
                                    <div className={styles.rentedMessage}>
                                      {t(
                                        'manage_asset_page.cant_transfer_rented_land',
                                        {
                                          asset: isParcel(asset)
                                            ? t('global.the_parcel')
                                            : t('global.the_estate')
                                        }
                                      )}
                                    </div>
                                  ) : null}
                                </section>
                                <Sell
                                  nft={asset}
                                  isLandLocked={
                                    rental !== null &&
                                    isLandLocked(wallet.address, rental, asset)
                                  }
                                  order={order}
                                />
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
