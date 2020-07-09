import React, { useEffect } from 'react'
import { Page, Responsive } from 'decentraland-ui'

import { NFTList } from '../NFTList'
import { AccountSidebar } from '../AccountSidebar'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { NFTFilters } from '../Vendor/NFTFilters'
import { NFTSidebar } from '../Vendor/NFTSidebar'
import { Props } from './NFTBrowse.types'
import './NFTBrowse.css'

const NFTBrowse = (props: Props) => {
  const { vendor, view, defaultOnlyOnSale, address, onBrowse } = props

  const onlyOnSale =
    props.onlyOnSale === undefined ? defaultOnlyOnSale : props.onlyOnSale

  // Kick things off
  useEffect(() => {
    onBrowse({ vendor, view, address, onlyOnSale })
  }, [onBrowse, vendor, view, onlyOnSale, address])

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
          <NFTList />
        </Column>
      </Row>
    </Page>
  )
}

export default React.memo(NFTBrowse)
