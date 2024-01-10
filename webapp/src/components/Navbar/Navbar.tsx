import React, { useCallback } from 'react'
import { Navbar as BaseNavbar } from 'decentraland-dapps/dist/containers'
import { Navbar2 as BaseNavbar2 } from 'decentraland-dapps/dist/containers'
import { Navbar2Pages } from 'decentraland-ui/dist/components/Navbar2/Navbar2.types'
import { config } from '../../config'
import { locations } from '../../modules/routing/locations'
import UserInformation from '../UserInformation'
import { Props } from './Navbar.types'
import './Navbar.css'

const Navbar = (props: Props) => {
  const { location, onNavigate, isAuthDappEnabled, isNavbarV2Enabled } = props
  const { pathname, search } = location

  const handleOnSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get('redirectTo')
    const basename = /^decentraland.(zone|org|today)$/.test(
      window.location.host
    )
      ? '/marketplace'
      : ''
    const redirectTo = !currentRedirectTo
      ? `${basename}${pathname}${search}`
      : `${basename}${currentRedirectTo}`
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

  return isNavbarV2Enabled ? (
    <BaseNavbar2
      {...props}
      withNotifications
      activePage={Navbar2Pages.MARKETPLACE}
      hasActivity={props.hasPendingTransactions}
      identity={props.identity}
      onSignIn={handleOnSignIn}
      onClickAccountSettings={handleOnClickAccount}
    />
  ) : (
    <BaseNavbar
      {...props}
      withNotifications
      activePage="marketplace"
      isFullscreen={props.isFullscreen}
      isSignIn={pathname === locations.signIn()}
      onSignIn={handleOnSignIn}
      onClickAccount={handleOnClickAccount}
      rightMenu={
        <UserInformation identity={props.identity} withNotifications />
      }
    />
  )
}

export default React.memo(Navbar)
