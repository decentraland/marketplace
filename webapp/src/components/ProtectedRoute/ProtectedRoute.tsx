import React from 'react'
import { Redirect, Route, useLocation } from 'react-router-dom'
import { locations } from '../../modules/routing/locations'
import { Props } from './ProtectedRoute.types'

const ProtectedRoute = (props: Props) => {
  const { isConnecting, wallet, ...rest } = props

  const { pathname, search } = useLocation()

  if (!isConnecting && !wallet) {
    return <Redirect to={locations.signIn(`${pathname}${search}`)} />
  }

  return <Route {...rest} />
}

export default React.memo(ProtectedRoute)
