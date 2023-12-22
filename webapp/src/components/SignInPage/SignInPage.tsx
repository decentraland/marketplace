import React, { useEffect } from 'react'
import { default as SignIn } from 'decentraland-dapps/dist/containers/SignInPage'
import { Page } from 'decentraland-ui'
import { config } from '../../config'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Props } from './SignInPage.types'
import './SignInPage.css'

const SignInPage = (props: Props) => {
  const { isAuthDappEnabled, isConnecting, isConnected } = props
  useEffect(() => {
    if (isAuthDappEnabled && !isConnected && !isConnecting) {
      window.location.replace(`${config.get("AUTH_URL")}`)
    }
  }, [isAuthDappEnabled, isConnected, isConnecting])

  return (
    <>
      <Navbar isFullscreen />
      <Page className="SignInPage" isFullscreen>
        <SignIn />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(SignInPage)
