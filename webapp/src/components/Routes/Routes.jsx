import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AtlasPage } from '../AtlasPage'
import { locations } from '../../modules/routing/locations'
import { MarketPage } from '../MarketPage'
import { CurrentAccountPage } from '../CurrentAccountPage'
import { AccountPage } from '../AccountPage'
import { SignInPage } from '../SignInPage'
import { NFTPage } from '../NFTPage'

const Routes = () => {
  return (
    <Switch>
      <Route exact path={locations.atlas()}>
        <AtlasPage />
      </Route>
      <Route exact path={locations.market()}>
        <MarketPage />
      </Route>
      <Route
        exact
        path={locations.currentAccount()}
        component={CurrentAccountPage}
      />
      <Route exact path={locations.account()} component={AccountPage} />
      <Route exact path={locations.signIn()} component={SignInPage} />
      <Route exact path={locations.ntf()}>
        <NFTPage />
      </Route>
      {/* TODO: The following redirect shoud be changed once we have a HomePage */}
      <Redirect to={locations.atlas()} />
    </Switch>
  )
}

export default Routes
