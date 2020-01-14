import React, { useEffect, useCallback, useState } from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import {
  Page,
  Card,
  Header,
  HeaderMenu,
  Dropdown,
  DropdownProps,
  Loader,
  Button
} from 'decentraland-ui'

import { Navigation } from '../Navigation'
import { Props } from './MarketPage.types'
import { OrderCard } from './OrderCard'
import {
  locations,
  MarketSortBy,
  MarketSection
} from '../../modules/routing/locations'
import { Order, OrderCategory } from '../../modules/order/types'
import './MarketPage.css'

const PAGE_SIZE = 24
const MAX_QUERY_SIZE = 1000

const getFilters = (
  sortBy: MarketSortBy,
  section: MarketSection
): [keyof Order, 'asc' | 'desc', OrderCategory | undefined] => {
  let orderBy: keyof Order = 'createdAt'
  let orderDirection: 'asc' | 'desc' = 'desc'
  let category: OrderCategory | undefined
  switch (sortBy) {
    case MarketSortBy.NEWEST: {
      orderBy = 'createdAt'
      orderDirection = 'desc'
      break
    }
    case MarketSortBy.CHEAPEST: {
      orderBy = 'price'
      orderDirection = 'asc'
      break
    }
  }
  switch (section) {
    case MarketSection.PARCELS: {
      category = OrderCategory.PARCEL
      break
    }
    case MarketSection.ESTATES: {
      category = OrderCategory.ESTATE
      break
    }
    case MarketSection.WEARABLES: {
      category = OrderCategory.WEARABLE
      break
    }
  }

  return [orderBy, orderDirection, category]
}

const MarketPage = (props: Props) => {
  const {
    page,
    section,
    sortBy,
    orders,
    onFetchOrders,
    onNavigate,
    isLoading
  } = props

  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const [orderBy, orderDirection, category] = getFilters(sortBy, section)
    const skip = offset * PAGE_SIZE
    const first = Math.min(page * PAGE_SIZE - skip, MAX_QUERY_SIZE)
    onFetchOrders({
      variables: {
        first,
        skip,
        orderBy,
        orderDirection,
        category
      },
      view: skip === 0 ? 'market' : 'load-more'
    })
  }, [offset, page, section, sortBy, onFetchOrders])

  const handleDropdownChange = useCallback(
    (_: React.SyntheticEvent, props: DropdownProps) => {
      setOffset(0)
      onNavigate(
        locations.market({
          page: 1,
          section,
          sortBy: props.value as MarketSortBy
        })
      )
    },
    [section, onNavigate]
  )

  const handleSectionChange = useCallback(
    (section: MarketSection) => {
      setOffset(0)
      onNavigate(
        locations.market({
          page: 1,
          section,
          sortBy
        })
      )
    },
    [sortBy, onNavigate]
  )

  const handleLoadMore = useCallback(() => {
    setOffset(page)
    onNavigate(
      locations.market({
        page: page + 1,
        section,
        sortBy
      })
    )
  }, [page, sortBy, section, onNavigate, setOffset])

  return (
    <>
      <Navbar isFullscreen activePage="marketplace" />
      <Navigation activeTab="market" />
      <Page className="MarketPage">
        <div className="menu-column">
          <Header sub>Categories</Header>
          <ul className="menu">
            <li
              className={section === MarketSection.ALL ? 'active' : ''}
              onClick={() => handleSectionChange(MarketSection.ALL)}
            >
              All Assets
            </li>
            <li
              className={section === MarketSection.LAND ? 'active' : ''}
              onClick={() => handleSectionChange(MarketSection.LAND)}
            >
              Land
            </li>
            {[
              MarketSection.LAND,
              MarketSection.PARCELS,
              MarketSection.ESTATES
            ].includes(section) ? (
              <>
                {' '}
                <li
                  className={
                    section === MarketSection.PARCELS ? 'sub active' : 'sub'
                  }
                  onClick={() => handleSectionChange(MarketSection.PARCELS)}
                >
                  Parcels
                </li>
                <li
                  className={
                    section === MarketSection.ESTATES ? 'sub active' : 'sub'
                  }
                  onClick={() => handleSectionChange(MarketSection.ESTATES)}
                >
                  Estates
                </li>
              </>
            ) : null}
            <li
              className={section === MarketSection.WEARABLES ? 'active' : ''}
              onClick={() => handleSectionChange(MarketSection.WEARABLES)}
            >
              Wearables
            </li>
          </ul>
        </div>
        <div className={`orders-column ${isLoading ? 'loading' : ''}`}>
          <HeaderMenu>
            <HeaderMenu.Left>
              <Header sub>Assets</Header>
            </HeaderMenu.Left>
            <HeaderMenu.Right>
              <Dropdown
                direction="left"
                value={sortBy}
                options={[
                  { value: MarketSortBy.NEWEST, text: 'Newest' },
                  { value: MarketSortBy.CHEAPEST, text: 'Cheapest' }
                ]}
                onChange={handleDropdownChange}
              />
            </HeaderMenu.Right>
          </HeaderMenu>
          <Card.Group>
            {orders.length > 0
              ? orders.map(order => <OrderCard key={order.id} order={order} />)
              : null}
            {orders.length === 0 && !isLoading ? <div>No orders</div> : null}
            {isLoading ? (
              <>
                <div className="overlay" />
                <Loader size="massive" active />
              </>
            ) : null}
          </Card.Group>
          {orders.length === 0 ? null : (
            <Button
              className="load-more"
              loading={isLoading}
              inverted
              primary
              onClick={handleLoadMore}
            >
              Load more
            </Button>
          )}
        </div>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(MarketPage)
