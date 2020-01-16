import React, { useEffect, useCallback, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Navbar, Footer } from 'decentraland-dapps/dist/containers'
import {
  Page,
  Grid,
  Card,
  Header,
  HeaderMenu,
  Dropdown,
  DropdownProps,
  Loader,
  Button
} from 'decentraland-ui'

import { Navigation } from '../Navigation'
import { CategoriesMenu } from '../CategoriesMenu'
import { NFTCard } from '../NFTCard'
import { Props } from './MarketPage.types'
import {
  locations,
  MarketSortBy,
  MarketSection
} from '../../modules/routing/locations'
import { Order, OrderCategory } from '../../modules/order/types'
import './MarketPage.css'

const PAGE_SIZE = 24
const MAX_QUERY_SIZE = 1000

// @nico TODO: Move this to utils?
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
    nfts,
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

  useEffect(() => {
    setOffset(0)
  }, [section])

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
        <Grid.Column>
          <CategoriesMenu section={section} />
        </Grid.Column>
        <Grid.Column className={`right-column ${isLoading ? 'loading' : ''}`}>
          <HeaderMenu>
            <HeaderMenu.Left>
              <Header sub>{t('global.assets')}</Header>
            </HeaderMenu.Left>
            <HeaderMenu.Right>
              <Dropdown
                direction="left"
                value={sortBy}
                options={[
                  { value: MarketSortBy.NEWEST, text: t('filters.newest') },
                  { value: MarketSortBy.CHEAPEST, text: t('filters.Cheapest') }
                ]}
                onChange={handleDropdownChange}
              />
            </HeaderMenu.Right>
          </HeaderMenu>
          <Card.Group>
            {orders.length > 0
              ? orders.map(order => (
                  <NFTCard key={order.id} nft={nfts[order.nftId]} />
                ))
              : null}
            {orders.length === 0 && !isLoading ? (
              <div>{t('market_page.empty_orders')}</div>
            ) : null}
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
              {t('global.load_more')}
            </Button>
          )}
        </Grid.Column>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(MarketPage)
