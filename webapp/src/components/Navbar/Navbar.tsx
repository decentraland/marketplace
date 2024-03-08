import React, { useCallback } from 'react'
import { Navbar as BaseNavbar } from 'decentraland-dapps/dist/containers'
import { NavbarPages } from 'decentraland-ui/dist/components/Navbar/Navbar.types'
import { config } from '../../config'
import { locations } from '../../modules/routing/locations'
import { Props } from './Navbar.types'
import './Navbar.css'

const Navbar = (props: Props) => {
  const { location, onNavigate, isChainSelectorEnabled } = props
  const { pathname, search } = location

  const handleOnSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get('redirectTo')
    const basename = /^decentraland.(zone|org|today)$/.test(window.location.host) ? '/marketplace' : ''
    const redirectTo = !currentRedirectTo ? `${basename}${pathname}${search}` : `${basename}${currentRedirectTo}`

    window.location.replace(`${config.get('AUTH_URL')}/login?redirectTo=${redirectTo}`)
  }, [pathname, search])

  const handleOnClickAccount = useCallback(() => {
    onNavigate(locations.settings())
  }, [onNavigate])

  return (
    <BaseNavbar
      {...props}
      withChainSelector={isChainSelectorEnabled}
      withNotifications
      activePage={NavbarPages.MARKETPLACE}
      hasActivity={props.hasPendingTransactions}
      identity={props.identity}
      onSignIn={handleOnSignIn}
      onClickAccountSettings={handleOnClickAccount}
    />
  )
}

export default React.memo(Navbar)
