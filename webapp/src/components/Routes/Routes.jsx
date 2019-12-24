import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { AtlasPage } from '../AtlasPage'
import { locations } from '../../modules/routing/locations'

export default class Routes extends React.PureComponent {
  render() {
    return (
      <Switch>
        <Route exact path={locations.atlas()}>
          <AtlasPage />
        </Route>
        {/* TODO: The following redirect shoud be changed once we have a HomePage */}
        <Redirect to={locations.atlas()} />
      </Switch>
    )
  }
}
