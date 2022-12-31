import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Center } from 'decentraland-ui/dist/components/Center/Center'
import { Loader } from 'decentraland-ui/dist/components/Loader/Loader'
import { Page } from 'decentraland-ui/dist/components/Page/Page'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { AssetType } from '../../modules/asset/types'
import { locations } from '../../modules/routing/locations'
import { config } from '../../config'
import { Props } from './Routes.types'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'

const LazyIntercom = React.lazy(() =>
  import('decentraland-dapps/dist/components/Intercom')
)
const LazyBrowsePage = React.lazy(() => import('../BrowsePage'))
const LazyAccountPage = React.lazy(() => import('../AccountPage'))
const LazySignInPage = React.lazy(() => import('../SignInPage'))
const LazySettingsPage = React.lazy(() => import('../SettingsPage'))
const LazyAssetPage = React.lazy(() => import('../AssetPage'))
const LazySellPage = React.lazy(() => import('../SellPage'))
const LazyBuyPage = React.lazy(() => import('../BuyPage'))
const LazyCancelSalePage = React.lazy(() => import('../CancelSalePage'))
const LazyTransferPage = React.lazy(() => import('../TransferPage'))
const LazyActivityPage = React.lazy(() => import('../ActivityPage'))
const LazyBidPage = React.lazy(() => import('../BidPage'))
const LazyHomePage = React.lazy(() => import('../HomePage'))
const LazyLegacyNFTPage = React.lazy(() => import('../LegacyNFTPage'))
const LazyLandsPage = React.lazy(() => import('../LandsPage'))
const LazyCollectionPage = React.lazy(() => import('../CollectionPage'))
const LazyCampaignPage = React.lazy(() =>
  import('../Campaign/CampaignBrowserPage')
)
const LazyManageAssetPage = React.lazy(() => import('../ManageAssetPage'))

const Routes = ({ inMaintenance }: Props) => {
  const APP_ID = config.get('INTERCOM_APP_ID')

  if (inMaintenance) {
    return (
      <>
        <Navbar />
        <Page>
          <Center>🚧 {t('maintainance.notice')} 🚧</Center>
        </Page>
        <Footer />
      </>
    )
  }

  return (
    <React.Suspense fallback={<Loader size="huge" />}>
      <Switch>
        <Route exact path={locations.lands()} component={LazyLandsPage} />
        <Route exact path={locations.browse()} component={LazyBrowsePage} />
        <Route path={locations.campaign()} component={LazyCampaignPage} />
        <Route
          exact
          path={locations.currentAccount()}
          component={LazyAccountPage}
        />
        <Route exact path={locations.account()} component={LazyAccountPage} />
        <Route exact path={locations.signIn()} component={LazySignInPage} />
        <Route exact path={locations.sell()} component={LazySellPage} />
        <Route exact path={locations.bid()} component={LazyBidPage} />
        <Route exact path={locations.cancel()} component={LazyCancelSalePage} />
        <Route exact path={locations.transfer()} component={LazyTransferPage} />
        <Route
          exact
          path={locations.collection()}
          component={LazyCollectionPage}
        />
        <Route
          exact
          path={locations.manage()}
          component={LazyManageAssetPage}
        />
        <Route
          exact
          path={locations.buy(AssetType.NFT)}
          component={() => <LazyBuyPage type={AssetType.NFT} />}
        />
        <Route
          exact
          path={locations.buy(AssetType.ITEM)}
          component={() => <LazyBuyPage type={AssetType.ITEM} />}
        />
        <Route
          exact
          path={locations.nft()}
          component={() => <LazyAssetPage type={AssetType.NFT} />}
        />
        <Route
          exact
          path={locations.item()}
          component={() => <LazyAssetPage type={AssetType.ITEM} />}
        />
        <Route exact path={locations.settings()} component={LazySettingsPage} />
        <Route exact path={locations.activity()} component={LazyActivityPage} />
        <Route exact path={locations.root()} component={LazyHomePage} />
        <Route exact path={locations.parcel()} component={LazyLegacyNFTPage} />
        <Route exact path={locations.estate()} component={LazyLegacyNFTPage} />
        <Redirect
          from="/browse"
          to={locations.browse() + window.location.search}
          push
        />
        <Redirect to={locations.root()} />
      </Switch>
      {APP_ID ? (
        <LazyIntercom appId={APP_ID} settings={{ alignment: 'right' }} />
      ) : null}
    </React.Suspense>
  )
}

export default Routes
