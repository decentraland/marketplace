import React, { useCallback } from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { Page, Grid, Loader } from 'decentraland-ui'

import { Navigation } from '../Navigation'
import { CategoriesMenu } from '../CategoriesMenu'
import { locations } from '../../modules/routing/locations'
import { SearchOptions } from '../../modules/routing/search'
import { AccountNFTs } from '../AccountNFTs'
import { Props } from './CurrentAccountPage.types'
import './CurrentAccountPage.css'

const CurrentAccountPage = (props: Props) => {
  const { wallet, section, isConnecting, onNavigate } = props

  const handleOnNavigate = useCallback(
    (options?: SearchOptions) => onNavigate(locations.currentAccount(options)),
    [onNavigate]
  )

  return (
    <>
      <Navbar isFullscreen activePage="marketplace" />
      <Navigation isFullscreen activeTab="account" />
      <Page className="CurrentAccountPage">
        {isConnecting ? (
          <Loader size="massive" active />
        ) : wallet ? (
          <>
            <Grid.Column>
              <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
            </Grid.Column>
            <Grid.Column className="right-column">
              <AccountNFTs address={wallet.address} />
            </Grid.Column>
          </>
        ) : (
          <div>
            Please connect your wallet <br /> SIGN IN
          </div>
        )}
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(CurrentAccountPage)
