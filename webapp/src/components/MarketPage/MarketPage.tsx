import React, { useEffect, useCallback } from 'react'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import {
  Page,
  Card,
  Header,
  HeaderMenu,
  Dropdown,
  DropdownProps,
  Pagination,
  PaginationProps,
  Loader
} from 'decentraland-ui'

import { Navigation } from '../Navigation'
import { Props } from './MarketPage.types'
import { OrderCard } from './OrderCard'

import './MarketPage.css'
import {
  locations,
  MarketSortBy,
  MarketSection
} from '../../modules/routing/locations'
import { Order, OrderCategory } from '../../modules/order/types'

const PAGE_SIZE = 24

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

  useEffect(() => {
    let orderBy: keyof Order = 'createdAt'
    let orderDirection: 'asc' | 'desc' = 'desc'
    let category: OrderCategory | null = null
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
    onFetchOrders({
      first: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
      category,
      orderBy,
      orderDirection,
      view: 'market'
    })
  }, [page, section, sortBy, onFetchOrders])

  const handleDropdownChange = useCallback(
    (_: React.SyntheticEvent, props: DropdownProps) => {
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

  const handlePaginationChange = useCallback(
    (_: React.SyntheticEvent, props: PaginationProps) => {
      window.scrollTo(0, 0)
      onNavigate(
        locations.market({
          page: +props.activePage!,
          section,
          sortBy
        })
      )
    },
    [section, sortBy, onNavigate]
  )

  const handleSectionChange = useCallback(
    (section: MarketSection) => {
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
            {orders.map(order => (
              <OrderCard key={order.id} order={order} />
            ))}
            {orders.length === 0 || isLoading ? (
              <>
                <div className="overlay" />
                <Loader size="massive" active />
              </>
            ) : null}
          </Card.Group>
          <Pagination
            activePage={page}
            totalPages={20}
            onPageChange={handlePaginationChange}
          />
        </div>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(MarketPage)
