import { useCallback } from 'react'
import { Switch, Route, Redirect, RouteComponentProps } from 'react-router-dom'
import { Center, Page } from 'decentraland-ui'
import Intercom from 'decentraland-dapps/dist/components/Intercom'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { config } from '../../config'
import { AssetType } from '../../modules/asset/types'
import { locations } from '../../modules/routing/locations'
import { BrowsePage } from '../BrowsePage'
import { AccountPage } from '../AccountPage'
import { SignInPage } from '../SignInPage'
import { SettingsPage } from '../SettingsPage'
import { AssetPage } from '../AssetPage'
import { SellPage } from '../SellPage'
import { BuyPage } from '../BuyPage'
import { BidPage } from '../BidPage'
import { CancelSalePage } from '../CancelSalePage'
import { TransferPage } from '../TransferPage'
import { ActivityPage } from '../ActivityPage'
import { HomePage } from '../HomePage'
import { LegacyNFTPage } from '../LegacyNFTPage'
import { LandsPage } from '../LandsPage'
import { CollectionPage } from '../CollectionPage'
import { Navbar } from '../Navbar'
import { ManageAssetPage } from '../ManageAssetPage'
import { Footer } from '../Footer'
import { SuccessPage } from '../SuccessPage'
import { CampaignBrowserPage } from '../Campaign/CampaignBrowserPage'
import { StatusPage } from '../BuyPage/StatusPage'
import { ListPage } from '../ListPage'
import { ProtectedRoute } from '../ProtectedRoute'
import { ListsPage } from '../ListsPage'
import { Props } from './Routes.types'

const Routes = ({ inMaintenance }: Props) => {
  const APP_ID = config.get('INTERCOM_APP_ID')
  const renderItemAssetPage = useCallback(
    () => <AssetPage type={AssetType.ITEM} />,
    []
  )

  const renderNFTAssetPage = useCallback(
    () => <AssetPage type={AssetType.NFT} />,
    []
  )

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
    <>
      <Switch>
        <Route exact path={locations.lands()} component={LandsPage} />
        <Route exact path={locations.browse()} component={BrowsePage} />
        <Route path={locations.campaign()} component={CampaignBrowserPage} />
        <Route
          exact
          path={locations.currentAccount()}
          component={AccountPage}
        />
        <Route exact path={locations.account()} component={AccountPage} />
        <ProtectedRoute exact path={locations.lists()} component={ListsPage} />
        <ProtectedRoute exact path={locations.list()} component={ListPage} />
        <Route exact path={locations.signIn()} component={SignInPage} />
        <ProtectedRoute exact path={locations.sell()} component={SellPage} />
        <ProtectedRoute exact path={locations.bid()} component={BidPage} />
        <ProtectedRoute
          exact
          path={locations.cancel()}
          component={CancelSalePage}
        />
        <ProtectedRoute
          exact
          path={locations.transfer()}
          component={TransferPage}
        />
        <Route exact path={locations.collection()} component={CollectionPage} />
        <ProtectedRoute
          exact
          path={locations.manage()}
          component={ManageAssetPage}
        />
        <ProtectedRoute
          exact
          path={locations.buy(AssetType.NFT)}
          component={() => <BuyPage type={AssetType.NFT} />}
        />
        <ProtectedRoute
          exact
          path={locations.buy(AssetType.ITEM)}
          component={() => <BuyPage type={AssetType.ITEM} />}
        />
        <Route
          exact
          path={locations.buyStatusPage(AssetType.NFT)}
          component={(props: RouteComponentProps) => (
            <StatusPage {...props} type={AssetType.NFT} />
          )}
        />
        <Route
          exact
          path={locations.buyStatusPage(AssetType.ITEM)}
          component={(props: RouteComponentProps) => (
            <StatusPage {...props} type={AssetType.ITEM} />
          )}
        />
        <Route exact path={locations.nft()} component={renderNFTAssetPage} />
        <Route exact path={locations.item()} component={renderItemAssetPage} />
        <ProtectedRoute
          exact
          path={locations.settings()}
          component={SettingsPage}
        />
        <ProtectedRoute
          exact
          path={locations.activity()}
          component={ActivityPage}
        />
        <Route exact path={locations.root()} component={HomePage} />
        <Route exact path={locations.parcel()} component={LegacyNFTPage} />
        <Route exact path={locations.estate()} component={LegacyNFTPage} />
        <Route exact path={locations.success()} component={SuccessPage} />
        <Redirect
          from="/browse"
          to={locations.browse() + window.location.search}
          push
        />
        <Redirect to={locations.root()} />
      </Switch>
      {APP_ID ? (
        <Intercom appId={APP_ID} settings={{ alignment: 'right' }} />
      ) : null}
    </>
  )
}

export default Routes
