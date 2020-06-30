import React, { useEffect } from 'react'
import { Page, Responsive } from 'decentraland-ui'

import { NFTFilters } from '../Vendor/NFTFilters'
import { NFTList } from '../NFTList'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { NFTSidebar } from '../Vendor/NFTSidebar'
import { Props } from './NFTBrowse.types'
import './NFTBrowse.css'

const NFTBrowse = (props: Props) => {
  const { vendor, view, defaultOnlyOnSale, address, onBrowse } = props

  // "Instance" variables
  const onlyOnSale =
    props.onlyOnSale === undefined ? defaultOnlyOnSale : props.onlyOnSale

  // Kick things off
  useEffect(() => {
    onBrowse({ vendor, view, onlyOnSale, address })
  }, [onBrowse, vendor, view, onlyOnSale, address])

  return (
    <Page className="NFTBrowse">
      <Row>
        <Column align="left">
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <NFTSidebar />
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
