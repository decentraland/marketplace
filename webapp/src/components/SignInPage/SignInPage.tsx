import React from 'react'
import { default as SignIn } from 'decentraland-dapps/dist/containers/SignInPage'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { Page } from 'decentraland-ui'

const SignInPage = () => {
  return (
    <>
      <Navbar isFullscreen activePage="marketplace" />
      <Page isFullscreen>
        <SignIn />
      </Page>
      <Footer isFullscreen />
    </>
  )
}

export default React.memo(SignInPage)
