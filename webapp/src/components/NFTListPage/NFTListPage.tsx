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
  SearchOptions,
  Section,
  SortBy,
  getSearchCategory,
  getSearchWearableCategory
} from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import { NFTCategory } from '../../modules/nft/types'
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
    nfts,
    view,
    isLoading,
    onFetchNFTs,
    onNavigate
  } = props

  // "Instance" variables
  const onlyOnSale =
    props.onlyOnSale === null ? defaultOnlyOnSale : props.onlyOnSale

  const dropdownOptions = [
    { value: SortBy.NEWEST, text: t('filters.newest') },
    { value: SortBy.NAME, text: t('filters.name') }
  ]

  if (onlyOnSale) {
    dropdownOptions.unshift({
      value: SortBy.RECENTLY_LISTED,
      text: t('filters.recently_listed')
    })
    dropdownOptions.unshift({
      value: SortBy.CHEAPEST,
      text: t('filters.cheapest')
    })
  }

  const sortBy = dropdownOptions.find(option => option.value === props.sortBy)
    ? props.sortBy
    : dropdownOptions[0].value

  // State variables
  const [offset, setOffset] = useState(0)

  // Handlers
  const handleOnNavigate = useCallback(
    (options?: SearchOptions) => {
      setOffset(0)
      onNavigate({
        ...options,
        onlyOnSale,
        sortBy
      })
    },
    [onlyOnSale, sortBy, onNavigate]
  )

  const handleOnlyOnSaleChange = useCallback(
    (_: React.SyntheticEvent, props: CheckboxProps) => {
      setOffset(0)
      onNavigate({
        page: 1,
        section,
        sortBy,
        onlyOnSale: !!props.checked
      })
    },
    [section, sortBy, onNavigate]
  )

  const handleDropdownChange = useCallback(
    (_: React.SyntheticEvent, props: DropdownProps) => {
      setOffset(0)
      onNavigate({
        page: 1,
        section,
        sortBy: props.value as SortBy,
        onlyOnSale
      })
    },
    [section, onlyOnSale, onNavigate]
  )

  const handleLoadMore = useCallback(() => {
    setOffset(page)
    onNavigate({
      page: page + 1,
      section,
      sortBy,
      onlyOnSale
    })
  }, [page, sortBy, section, onlyOnSale, onNavigate, setOffset])

  // Kick things off
  useEffect(() => {
    const skip = offset * PAGE_SIZE
    const first = Math.min(page * PAGE_SIZE - skip, MAX_QUERY_SIZE)

    const category = getSearchCategory(section)
    const [orderBy, orderDirection] = getSortOrder(sortBy)

    const isLand = section === Section.LAND
    const isWearableHead = section === Section.WEARABLES_HEAD
    const isWearableAccessory = section === Section.WEARABLES_ACCESORIES

    const wearableCategory =
      !isWearableAccessory && category === NFTCategory.WEARABLE
        ? getSearchWearableCategory(section)
        : undefined

    onFetchNFTs({
      variables: {
        first,
        skip,
        orderBy,
        orderDirection,
        onlyOnSale,
        address,
        isLand,
        isWearableHead,
        isWearableAccessory,
        category,
        wearableCategory
      },
      view: skip === 0 ? view : View.LOAD_MORE
    })
  }, [address, onlyOnSale, view, offset, page, section, sortBy, onFetchNFTs])

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
              options={dropdownOptions}
              onChange={handleDropdownChange}
            />
          </HeaderMenu.Right>
        </HeaderMenu>

        <Card.Group>
          {nfts.length > 0
            ? nfts.map(nft => <NFTCard key={nft.id} nft={nft} />)
            : null}
          {isLoading ? (
            <>
              <div className="overlay" />
              <Loader size="massive" active />
            </>
          ) : null}
        </Card.Group>

        {nfts.length === 0 && !isLoading ? (
          <div className="empty">{t('nft_list_page.empty')}</div>
        ) : null}

        {nfts.length < PAGE_SIZE ? null : (
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
