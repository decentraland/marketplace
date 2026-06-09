import React, { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar2 as BaseNavbar2 } from 'decentraland-dapps/dist/containers/Navbar'
import { DclLogo } from 'decentraland-ui2/dist/components/Navbar/icons'
import { config } from '../../config'
import CreditsIcon from '../../images/icon-credits.svg'
import { useIsIAP } from '../../modules/iap/useIAP'
import { getBasename } from '../../modules/routing/basename'
import { Props } from './Navbar.types'

// TODO(mock): remove once mobile auth is integrated — only used for local testing without wallet
const MockIAPNavbar = () => (
  <>
    <nav className="iap-navbar-custom">
      <a href="https://decentraland.org" className="iap-navbar-logo" aria-label="Decentraland">
        <DclLogo />
      </a>
      <div className="iap-navbar-right">
        <div className="iap-navbar-credits">
          <img src={CreditsIcon} alt="Credits" />
          <span>150</span>
        </div>
        <img className="iap-navbar-avatar" src="https://api.dicebear.com/7.x/avataaars/png?seed=iap-tester&size=256" alt="IAP Tester" />
      </div>
    </nav>
    <div className="iap-navbar-spacer" />
  </>
)

const Navbar = (props: Props) => {
  const { pathname, search } = useLocation()
  const isIAP = useIsIAP()
  const isMock = useMemo(() => new URLSearchParams(search).get('mock') === 'true', [search])

  const handleOnSignIn = useCallback(() => {
    const searchParams = new URLSearchParams(search)
    const currentRedirectTo = searchParams.get('redirectTo')
    const basename = getBasename()
    const redirectTo = !currentRedirectTo ? `${basename}${pathname}${search}` : `${basename}${currentRedirectTo}`

    window.location.replace(`${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(redirectTo)}`)
  }, [pathname, search])

  // TODO(mock): remove this block once mobile auth is integrated
  if (isIAP && isMock) {
    return <MockIAPNavbar />
  }

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
