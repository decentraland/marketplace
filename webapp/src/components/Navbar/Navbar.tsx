import React, { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar2 as BaseNavbar2 } from 'decentraland-dapps/dist/containers/Navbar'
import { config } from '../../config'
import { Props } from './Navbar.types'

const Navbar = (props: Props) => {
  const { pathname, search } = useLocation()

  const handleOnSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get('redirectTo')
    const basename = /^decentraland\.(zone|org|today)$/.test(window.location.host) ? '/marketplace' : ''
    const redirectTo = !currentRedirectTo ? `${basename}${pathname}${search}` : `${basename}${currentRedirectTo}`

    window.location.replace(`${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(redirectTo)}`)
  }, [pathname, search])

  return (
    <BaseNavbar2 {...props} withChainSelector withNotifications activePage="shop" identity={props.identity} onSignIn={handleOnSignIn} />
  )
}

export default React.memo(Navbar)
