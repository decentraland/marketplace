import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Intercom from 'decentraland-dapps/dist/components/Intercom'

import { locations } from '../../modules/routing/locations'
import { BrowsePage } from '../BrowsePage'
import { AccountPage } from '../AccountPage'
import { SignInPage } from '../SignInPage'
import { SettingsPage } from '../SettingsPage'
import { NFTPage } from '../NFTPage'
import { SellPage } from '../SellPage'
import { BuyPage } from '../BuyPage'
import { BidPage } from '../BidPage'
import { CancelSalePage } from '../CancelSalePage'
import { TransferPage } from '../TransferPage'
import { ActivityPage } from '../ActivityPage'
import { PartnersPage } from '../PartnersPage'
import { HomePage } from '../HomePage'
import { MyBidsPage } from '../MyBidsPage'
import { LegacyNFTPage } from '../LegacyNFTPage'

const Routes = () => {
  const APP_ID = process.env.REACT_APP_INTERCOM_APP_ID

  return (
    <>
      <Switch>
        <Route exact path={locations.browse()} component={BrowsePage} />
        <Route
          exact
          path={locations.currentAccount()}
          component={AccountPage}
        />
        <Route exact path={locations.account()} component={AccountPage} />
        <Route exact path={locations.bids()} component={MyBidsPage} />
        <Route exact path={locations.signIn()} component={SignInPage} />
        <Route exact path={locations.sell()} component={SellPage} />
        <Route exact path={locations.buy()} component={BuyPage} />
        <Route exact path={locations.bid()} component={BidPage} />
        <Route exact path={locations.cancel()} component={CancelSalePage} />
        <Route exact path={locations.transfer()} component={TransferPage} />
        <Route exact path={locations.nft()} component={NFTPage} />
        <Route exact path={locations.settings()} component={SettingsPage} />
        <Route exact path={locations.partners()} component={PartnersPage} />
        <Route exact path={locations.activity()} component={ActivityPage} />
        <Route exact path={locations.root()} component={HomePage} />
        <Route exact path={locations.parcel()} component={LegacyNFTPage} />
        <Route exact path={locations.estate()} component={LegacyNFTPage} />
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
