import React, { useCallback } from 'react'
import { default as SignIn } from 'decentraland-dapps/dist/containers/SignInPage'
import { Page } from 'decentraland-ui'
import { config } from '../../config'
import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Props } from './SignInPage.types'
import './SignInPage.css'

const SignInPage = (props: Props) => {
  const { isAuthDappEnabled, isConnecting, isConnected } = props
  const handleConnect = useCallback(() => {
    if (!isConnected && !isConnecting) {
      const params = new URLSearchParams(window.location.search)
      const basename = /^decentraland.(zone|org|today)$/.test(
        window.location.host
      )
        ? '/marketplace'
        : ''
      window.location.replace(
        `${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(
          `${basename}${params.get('redirectTo') || '/'}`
        )}`
      )
    }
  }, [isConnected, isConnecting])

  return (
    <>
      <Navbar />
      <Page className="SignInPage" isFullscreen>
        <SignIn onConnect={isAuthDappEnabled ? handleConnect : undefined} />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(SignInPage)
