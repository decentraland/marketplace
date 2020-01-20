import React from 'react'
import { default as SignIn } from 'decentraland-dapps/dist/containers/SignInPage'
import { Footer } from 'decentraland-dapps/dist/containers'
import { Page } from 'decentraland-ui'

import { Navbar } from '../Navbar'

const SignInPage = () => {
  return (
    <>
      <Navbar isFullscreen />
      <Page isFullscreen>
        <SignIn />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(SignInPage)
