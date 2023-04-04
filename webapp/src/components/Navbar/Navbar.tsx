import React, { useCallback } from 'react'
import { Navbar as BaseNavbar } from 'decentraland-dapps/dist/containers'

import { locations } from '../../modules/routing/locations'
import UserMenu from '../UserMenu'
import { Props } from './Navbar.types'
import './Navbar.css'

const Navbar = (props: Props) => {
  const { location, onNavigate, isConnected } = props
  const { pathname, search } = location

  if (isConnected) {
    props = { ...props, rightMenu: <UserMenu /> }
  }

  const handleOnSignIn = useCallback(() => {
    onNavigate(locations.signIn(`${pathname}${search}`))
  }, [onNavigate, pathname, search])

  const handleOnClickAccount = useCallback(() => {
    onNavigate(locations.settings())
  }, [onNavigate])

  return (
    <BaseNavbar
      {...props}
      activePage="marketplace"
      isFullscreen={props.isFullscreen}
      isSignIn={pathname === locations.signIn()}
      onSignIn={handleOnSignIn}
      onClickAccount={handleOnClickAccount}
    />
  )
}

export default React.memo(Navbar)
