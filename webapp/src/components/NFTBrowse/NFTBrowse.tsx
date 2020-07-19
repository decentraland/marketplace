import React, { useEffect } from 'react'
import { Page, Responsive } from 'decentraland-ui'

import { getDefaultOptionsByView } from '../../modules/routing/search'
import { Atlas } from '../Atlas'
import { NFTList } from '../NFTList'
import { AccountSidebar } from '../AccountSidebar'
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
  }, [onFetchNFTsFromRoute, vendor, view, onlyOnSale, address])

  return (
    <Page className="NFTBrowse">
      <Row>
        <Column align="left">
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            {address ? <AccountSidebar address={address} /> : <NFTSidebar />}
          </Responsive>
        </Column>

        <Column align="right" grow={true}>
          <NFTFilters />
          {isMap ? <Atlas withNavigation /> : <NFTList />}
        </Column>
      </Row>
    </Page>
  )
}

export default React.memo(NFTBrowse)
