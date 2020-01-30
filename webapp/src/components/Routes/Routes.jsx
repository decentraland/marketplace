import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AtlasPage } from '../AtlasPage'
import { locations } from '../../modules/routing/locations'
import { MarketPage } from '../MarketPage'
import { CurrentAccountPage } from '../CurrentAccountPage'
import { AccountPage } from '../AccountPage'
import { SignInPage } from '../SignInPage'
import { SettingsPage } from '../SettingsPage'
import { NFTPage } from '../NFTPage'
import { SellPage } from '../SellPage'
import { BuyPage } from '../BuyPage'
import { CancelSalePage } from '../CancelSalePage'
import { TransferPage } from '../TransferPage'

const Routes = () => {
  return (
    <Switch>
      <Route exact path={locations.atlas()} component={AtlasPage} />
      <Route exact path={locations.market()} component={MarketPage} />
      <Route
        exact
        path={locations.currentAccount()}
        component={CurrentAccountPage}
      />
      <Route exact path={locations.account()} component={AccountPage} />
      <Route exact path={locations.signIn()} component={SignInPage} />
      <Route exact path={locations.sell()} component={SellPage} />
      <Route exact path={locations.buy()} component={BuyPage} />
      <Route exact path={locations.cancel()} component={CancelSalePage} />
      <Route exact path={locations.transfer()} component={TransferPage} />
      <Route exact path={locations.ntf()} component={NFTPage} />
      <Route exact path={locations.settings()} component={SettingsPage} />
      {/* TODO: The following redirect shoud be changed once we have a HomePage */}
      <Redirect to={locations.atlas()} />
    </Switch>
  )
}

export default Routes
