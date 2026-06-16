import React, { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar2 as BaseNavbar2 } from 'decentraland-dapps/dist/containers/Navbar'
import { config } from '../../config'
import { useIsIAP } from '../../modules/iap/useIAP'
import { getBasename } from '../../modules/routing/basename'
import { Props } from './Navbar.types'

const Navbar = (props: Props) => {
  const { pathname, search } = useLocation()
  const isIAP = useIsIAP()

  const handleOnSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get('redirectTo')
    const basename = getBasename()
    const redirectTo = !currentRedirectTo ? `${basename}${pathname}${search}` : `${basename}${currentRedirectTo}`

    window.location.replace(`${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(redirectTo)}`)
  }, [pathname, search])

  if (isIAP) {
    return (
      <div className="iap-navbar">
        <BaseNavbar2
          {...props}
          withChainSelector={false}
          withNotifications={false}
          activePage={undefined}
          identity={props.identity}
          onSignIn={handleOnSignIn}
        />
      </div>
    )
  }

  return (
    <BaseNavbar2
      {...props}
      withChainSelector
      withNotifications
      // @ts-expect-error forwarded to ui2 Navbar at runtime; dapps connect() types haven't picked up this ui2 prop yet
      showManaBalancesInNavbar
      activePage="shop"
      identity={props.identity}
      onSignIn={handleOnSignIn}
    />
  )
}

export default React.memo(Navbar)
