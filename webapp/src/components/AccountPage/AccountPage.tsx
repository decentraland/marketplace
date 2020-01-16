import React from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import { Page, Grid } from 'decentraland-ui'

import { AccountNFTs } from '../AccountNFTs'
import { CategoriesMenu } from '../CategoriesMenu'
import { Props } from './AccountPage.types'
import './AccountPage.css'

const AccountPage = (props: Props) => {
  const { address, section } = props

  return (
    <>
      <Navbar isFullscreen={true} activePage="marketplace" />
      <Page className="AccountPage">
        <Grid.Column>
          <CategoriesMenu section={section} />
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
