import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AtlasPage } from '../AtlasPage'
import { locations } from '../../modules/routing/locations'
import { MarketPage } from '../MarketPage'
import { CurrentAccountPage } from '../CurrentAccountPage'
import { AccountPage } from '../AccountPage'
import { SignInPage } from '../SignInPage'

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
      <Route
        exact
        path={locations.account(':address')}
        component={AccountPage}
      />
      <Route exact path={locations.signIn()} component={SignInPage} />
      {/* TODO: The following redirect shoud be changed once we have a HomePage */}
      <Redirect to={locations.atlas()} />
    </Switch>
  )
}

export default Routes
