import React, { useCallback } from 'react'
import { Page, Grid, Blockie } from 'decentraland-ui'

import { Navbar } from '../Navbar'
import { PageHeader } from '../PageHeader'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { AccountNFTs } from '../AccountNFTs'
import { CategoriesMenu } from '../CategoriesMenu'
import { locations } from '../../modules/routing/locations'
import { SearchOptions } from '../../modules/routing/search'
import { shortenAddress } from '../../modules/wallet/utils'
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
    <div className="AccountPage">
      <Navbar isFullscreen />
      <Navigation isFullscreen />
      <PageHeader>
        <div>
          <Blockie seed={address} scale={18} />
          <div
            className="blockie-address secondary-text"
            data-balloon={address}
            data-balloon-pos="up"
            data-balloon-length="large"
          >
            {shortenAddress(address)}
          </div>
        </div>
      </PageHeader>
      <Page>
        <Grid.Column>
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
        </Grid.Column>
        <Grid.Column className="right-column">
          <AccountNFTs address={address} />
        </Grid.Column>
      </Page>
      <Footer />
    </div>
  )
}

export default React.memo(AccountPage)
