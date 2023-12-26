import React, { useCallback } from 'react'
import { Navbar as BaseNavbar } from 'decentraland-dapps/dist/containers'
import { config } from '../../config'
import { locations } from '../../modules/routing/locations'
import UserMenu from '../UserMenu'
import UserInformation from '../UserInformation'
import { Props } from './Navbar.types'
import './Navbar.css'

const Navbar = (props: Props) => {
  const {
    location,
    onNavigate,
    isConnected,
    isNewNavbarDropdownEnabled,
    isAuthDappEnabled
  } = props
  const { pathname, search } = location

  if (isConnected) {
    props = {
      ...props,
      rightMenu: <UserMenu />
    }
  }
  if (isNewNavbarDropdownEnabled) {
    props = {
      ...props,
      rightMenu: <UserInformation identity={props.identity} withNotifications />
    }
  }

  const handleOnSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get('redirectTo')
    const redirectTo = !currentRedirectTo
      ? `${pathname}${search}`
      : currentRedirectTo
    if (isAuthDappEnabled) {
      window.location.replace(
        `${config.get('AUTH_URL')}/login?redirectTo=${redirectTo}`
      )
    } else {
      onNavigate(locations.signIn(redirectTo))
    }
  }, [onNavigate, pathname, search, isAuthDappEnabled])

  const handleOnClickAccount = useCallback(() => {
    onNavigate(locations.settings())
  }, [onNavigate])

  return (
    <BaseNavbar
      {...props}
      withNotifications
      activePage="marketplace"
      isFullscreen={props.isFullscreen}
      isSignIn={pathname === locations.signIn()}
      onSignIn={handleOnSignIn}
      onClickAccount={handleOnClickAccount}
    />
  )
}

export default React.memo(Navbar)
