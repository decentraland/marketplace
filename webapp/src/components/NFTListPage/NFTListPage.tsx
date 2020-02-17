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
  DropdownProps,
  Responsive,
  Icon,
  Modal,
  Close
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
  const [lastNFTLength, setLastNFTLength] = useState(0)
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  // Handlers
  const handleOnNavigate = useCallback(
    (options?: SearchOptions) => {
      setOffset(0)
      setLastNFTLength(0)
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
      setLastNFTLength(0)
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
      setLastNFTLength(0)
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
    setLastNFTLength(nfts.length)
    onNavigate({
      page: page + 1,
      section,
      sortBy,
      onlyOnSale
    })
  }, [page, sortBy, section, onlyOnSale, nfts, onNavigate, setOffset])

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
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Grid.Column>
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
        </Grid.Column>
      </Responsive>
      <Grid.Column className="right-column">
        <HeaderMenu>
          <HeaderMenu.Left>
            <Header sub>{t('global.assets')}</Header>
          </HeaderMenu.Left>
          <HeaderMenu.Right>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
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
            </Responsive>
            <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
              <Button
                basic
                onClick={() => setShowFiltersModal(!showFiltersModal)}
              >
                <Icon name="filter" />
                {t('nft_list_page.filter')}
              </Button>
            </Responsive>
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

        {nfts.length >= PAGE_SIZE && nfts.length > lastNFTLength ? (
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
        ) : null}
      </Grid.Column>
      <Modal
        className="FiltersModal"
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
        closeIcon={<Close onClick={() => setShowFiltersModal(false)} />}
      >
        <Modal.Header>Filter</Modal.Header>
        <Modal.Content>
          <div className="filter-row">
            <Header sub>{t('nft_list_page.on_sale')}</Header>
            <Radio
              toggle
              checked={onlyOnSale}
              onChange={handleOnlyOnSaleChange}
            />
          </div>
          <div className="filter-row">
            <Header sub>{t('nft_list_page.order_by')}</Header>
            <Dropdown
              direction="left"
              value={sortBy}
              options={dropdownOptions}
              onChange={handleDropdownChange}
            />
          </div>
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
        </Modal.Content>
      </Modal>
    </Page>
  )
}

export default React.memo(NFTListPage)
