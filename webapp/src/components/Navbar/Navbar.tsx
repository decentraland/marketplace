import React, { useCallback } from 'react'
import { Navbar as BaseNavbar } from 'decentraland-dapps/dist/containers'

import { Props } from './Navbar.types'
import { locations } from '../../modules/routing/locations'

const Navbar = (props: Props) => {
  const { onNavigate } = props

  const handleOnSignIn = useCallback(() => {
    onNavigate(locations.signIn())
  }, [onNavigate])

  return (
    <BaseNavbar
      activePage="marketplace"
      isFullscreen={props.isFullscreen}
      isSignIn={window.location.pathname === locations.signIn()}
      onSignIn={handleOnSignIn}
    />
  )
}

export default React.memo(Navbar)
