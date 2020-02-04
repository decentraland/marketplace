import React, { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Page,
  Grid,
  Card,
  Radio,
  CheckboxProps,
  Button,
  Loader,
  HeaderMenu,
  Header,
  Dropdown,
  DropdownProps
} from 'decentraland-ui'

import {
  getSearchCategory,
  SortBy,
  SearchOptions,
  Section
} from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { getSortOrder } from '../../modules/nft/utils'
import { MAX_QUERY_SIZE, PAGE_SIZE } from '../../lib/api/client'
import { NFTCard } from '../NFTCard'
import { CategoriesMenu } from '../CategoriesMenu'
import { Props } from './NFTListPage.types'
import './NFTListPage.css'

const NFTListPage = (props: Props) => {
  const {
    address,
    defaultOnlyOnSale,
    page,
    section,
    sortBy,
    nfts,
    view,
    isLoading,
    onFetchNFTs,
    onNavigate
  } = props

  const handleOnNavigate = useCallback(
    (options?: SearchOptions) => onNavigate(options),
    [onNavigate]
  )

  const [onlyOnSale, setOnlyOnSale] = useState(defaultOnlyOnSale)
  const [offset, setOffset] = useState(0)

  const handleOnlyOnSaleChange = useCallback(
    (_: React.SyntheticEvent, props: CheckboxProps) =>
      setOnlyOnSale(!!props.checked),
    [section, onNavigate]
  )

  const handleDropdownChange = useCallback(
    (_: React.SyntheticEvent, props: DropdownProps) => {
      setOffset(0)
      onNavigate({
        page: 1,
        section,
        sortBy: props.value as SortBy
      })
    },
    [section, onNavigate]
  )

  const handleLoadMore = useCallback(() => {
    setOffset(page)
    onNavigate({
      page: page + 1,
      section,
      sortBy
    })
  }, [page, sortBy, section, onNavigate, setOffset])

  // Kick things off
  useEffect(() => {
    const category = getSearchCategory(section)
    const [orderBy, orderDirection] = getSortOrder(sortBy)
    const isLand = section === Section.LAND

    const skip = offset * PAGE_SIZE
    const first = Math.min(page * PAGE_SIZE - skip, MAX_QUERY_SIZE)
    onFetchNFTs({
      variables: {
        first,
        skip,
        orderBy,
        orderDirection,
        onlyOnSale,
        address,
        isLand,
        category
      },
      view: skip === 0 ? view : View.LOAD_MORE
    })
  }, [onlyOnSale, address, view, offset, page, section, sortBy, onFetchNFTs])

  return (
    <Page className="NFTListPage">
      <Grid.Column>
        <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
      </Grid.Column>
      <Grid.Column className="right-column">
        <HeaderMenu>
          <HeaderMenu.Left>
            <Header sub>{t('global.assets')}</Header>
          </HeaderMenu.Left>
          <HeaderMenu.Right>
            <Radio
              toggle
              checked={onlyOnSale}
              onChange={handleOnlyOnSaleChange}
              label={t('nft_list_page.on_sale')}
            />
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

        {nfts.length > 0 ? (
          <Card.Group>
            {nfts.map(nft => (
              <NFTCard key={nft.id} nft={nft} />
            ))}

            {isLoading ? (
              <>
                <div className="overlay" />
                <Loader size="massive" active />
              </>
            ) : null}
          </Card.Group>
        ) : null}

        {nfts.length === 0 && !isLoading ? (
          <div>{t('nft_list_page.empty')}</div>
        ) : null}

        {nfts.length <= PAGE_SIZE ? null : (
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
  )
}

export default React.memo(NFTListPage)
