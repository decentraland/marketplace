import React, { useCallback } from 'react'
import { Footer } from 'decentraland-dapps/dist/containers'
import { Page, Grid } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { Navigation } from '../Navigation'
import { AccountNFTs } from '../AccountNFTs'
import { CategoriesMenu } from '../CategoriesMenu'
import { locations } from '../../modules/routing/locations'
import { SearchOptions } from '../../modules/routing/search'
import { Props } from './AccountPage.types'
import './AccountPage.css'

const AccountPage = (props: Props) => {
  const { address, section, onNavigate } = props

  const handleOnNavigate = useCallback(
    (options?: SearchOptions) =>
      onNavigate(locations.account(address, options)),
    [address, onNavigate]
  )

  return (
    <>
      <Navbar isFullscreen />
      <Navigation />
      <Page className="AccountPage">
        <Grid.Column>
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
        </Grid.Column>
        <Grid.Column>
          <AccountNFTs address={address} />
        </Grid.Column>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(AccountPage)
