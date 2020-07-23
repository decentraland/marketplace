// import React, { useEffect, useState } from 'react'
import React, { useEffect } from 'react'
import { Page, Responsive } from 'decentraland-ui'

import { getDefaultOptionsByView } from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { Atlas } from '../Atlas'
import { AccountSidebar } from '../AccountSidebar'
import { NFTList } from '../NFTList'
import { VendorStrip } from '../VendorStrip'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { NFTFilters } from '../Vendor/NFTFilters'
import { NFTSidebar } from '../Vendor/NFTSidebar'
import { Props } from './NFTBrowse.types'
import './NFTBrowse.css'

const NFTBrowse = (props: Props) => {
  const { vendor, view, isMap, address, onFetchNFTsFromRoute } = props

  const defaultOptions = getDefaultOptionsByView(view)

  const onlyOnSale =
    props.onlyOnSale === undefined
      ? defaultOptions.onlyOnSale
      : props.onlyOnSale

  // Kick things off
  useEffect(() => {
    onFetchNFTsFromRoute({
      vendor,
      view,
      address,
      onlyOnSale
    })
    // eslint-disable-next-line
  }, [onFetchNFTsFromRoute])

  return (
    <Page className="NFTBrowse">
      <Row>
        <Column align="left">
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            {view === View.ACCOUNT ? (
              <AccountSidebar address={address!} />
            ) : (
              <NFTSidebar />
            )}
          </Responsive>
        </Column>

        <Column align="right" grow={true}>
          {view === View.ACCOUNT ? <VendorStrip address={address!} /> : null}
          <NFTFilters />
          {isMap ? <Atlas withNavigation /> : <NFTList />}
        </Column>
      </Row>
    </Page>
  )
}

export default React.memo(NFTBrowse)
