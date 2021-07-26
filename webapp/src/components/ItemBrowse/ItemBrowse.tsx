import React, { useEffect } from 'react'
import { Page, Responsive } from 'decentraland-ui'

import { View } from '../../modules/ui/types'
import { AccountSidebar } from '../AccountSidebar'
import { ItemList } from '../ItemList'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { NFTFilters } from '../Vendor/NFTFilters'
import { NFTSidebar } from '../Vendor/NFTSidebar'
import { Props } from './ItemBrowse.types'
import './ItemBrowse.css'

const NFTBrowse = (props: Props) => {
  const {
    view,
    address,
    onSetView,
    onFetchItemsFromRoute,
    isOnSale,
    viewInState
  } = props

  // Kick things off
  useEffect(() => {
    onSetView(view)
  }, [onSetView, view])

  useEffect(() => {
    if (viewInState === view) {
      onFetchItemsFromRoute({
        filters: {
          creator: address,
          isOnSale
        }
      })
    }
  }, [view, address, isOnSale, viewInState, onFetchItemsFromRoute])

  // classes
  let classes = ['ItemBrowse']

  return (
    <Page className={classes.join(' ')}>
      <Row>
        <Column align="left" className="sidebar">
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            {view === View.ACCOUNT ? (
              <AccountSidebar address={address!} />
            ) : (
              <NFTSidebar />
            )}
          </Responsive>
        </Column>

        <Column align="right" grow={true}>
          <NFTFilters />
          <ItemList />
        </Column>
      </Row>
    </Page>
  )
}

export default React.memo(NFTBrowse)
