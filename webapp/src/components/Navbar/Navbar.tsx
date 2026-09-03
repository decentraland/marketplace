import React, { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { Navbar2 as BaseNavbar2 } from 'decentraland-dapps/dist/containers/Navbar'
import { config } from '../../config'
import { useIsIAP } from '../../modules/iap/useIAP'
import { getBasename } from '../../modules/routing/basename'
import { Props } from './Navbar.types'

/**
 * `withCredits={false}` on both variants: the credits chip belongs to the Shop, not here.
 *
 * Left on — and it defaults to ON in dapps — this navbar rendered the LEGACY MANA-denominated credits
 * ("Expiring in 0 days (1 Credit = 1 MANA in value)"), a programme the marketplace no longer issues or
 * spends, so the figure is at best zero and at worst an offer this surface cannot honour. The flag also
 * covers the Shop's USD credits, which is the right outcome for the same reason: they are not spendable
 * here either.
 */
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
          withCredits={false}
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
      withCredits={false}
      showManaBalancesInNavbar
      activePage="shop"
      identity={props.identity}
      onSignIn={handleOnSignIn}
    />
  )
}

export default React.memo(Navbar)
