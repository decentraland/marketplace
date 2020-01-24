import React, { useEffect, useCallback, useState } from 'react'
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
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { Navbar } from '../Navbar'
import { Footer } from '../Footer'
import { Navigation } from '../Navigation'
import { CategoriesMenu } from '../CategoriesMenu'
import { NFTCard } from '../NFTCard'
import { locations } from '../../modules/routing/locations'
import { getSortOrder } from '../../modules/order/utils'
import {
  getSearchCategory,
  SortBy,
  SearchOptions
} from '../../modules/routing/search'
import { Props } from './MarketPage.types'
import './MarketPage.css'

const PAGE_SIZE = 24
const MAX_QUERY_SIZE = 1000

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
    const category = getSearchCategory(section)
    const [orderBy, orderDirection] = getSortOrder(sortBy)

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

  useEffect(() => setOffset(0), [section])

  const handleDropdownChange = useCallback(
    (_: React.SyntheticEvent, props: DropdownProps) => {
      setOffset(0)
      onNavigate(
        locations.market({
          page: 1,
          section,
          sortBy: props.value as SortBy
        })
      )
    },
    [section, onNavigate]
  )

  const handleOnNavigate = useCallback(
    (options?: SearchOptions) => {
      onNavigate(locations.market(options))
    },
    [onNavigate]
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
      <Navbar isFullscreen />
      <Navigation activeTab="market" />
      <Page className="MarketPage">
        <Grid.Column>
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
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
                  { value: SortBy.NEWEST, text: t('filters.newest') },
                  { value: SortBy.CHEAPEST, text: t('filters.cheapest') }
                ]}
                onChange={handleDropdownChange}
              />
            </HeaderMenu.Right>
          </HeaderMenu>
          <Card.Group>
            {orders.length > 0
              ? orders.map(order => (
                  <NFTCard
                    key={order.id}
                    nft={nfts[order.nftId]}
                    order={order}
                  />
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
            <div className="load-more">
              <Button
                loading={isLoading}
                inverted
                primary
                onClick={handleLoadMore}
              >
                {t('global.load_more')}
              </Button>
            </div>
          )}
        </Grid.Column>
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(MarketPage)
