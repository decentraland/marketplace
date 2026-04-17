import React, { useCallback } from 'react'
import { default as SignIn } from 'decentraland-dapps/dist/containers/SignInPage'
import { Page } from 'decentraland-ui'
import { config } from '../../config'
import { getBasename } from '../../modules/routing/basename'
import { PageLayout } from '../PageLayout'
import { Props } from './SignInPage.types'
import './SignInPage.css'

const SignInPage = (props: Props) => {
  const { isConnecting, isConnected } = props

  const handleConnect = useCallback(() => {
    if (!isConnected && !isConnecting) {
      const params = new URLSearchParams(window.location.search)
      const basename = getBasename()
      window.location.replace(
        `${config.get('AUTH_URL')}/login?redirectTo=${encodeURIComponent(`${basename}${params.get('redirectTo') || '/'}`)}`
      )
    }
  }, [isConnected, isConnecting])

  return (
    <PageLayout>
      <Page className="SignInPage" isFullscreen>
        <SignIn onConnect={handleConnect} />
      </Page>
    </PageLayout>
  )
}

export default React.memo(SignInPage)
