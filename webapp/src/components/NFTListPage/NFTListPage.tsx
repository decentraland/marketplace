import React, { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Page,
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
  Modal
} from 'decentraland-ui'

import {
  SearchOptions,
  Section,
  SortBy,
  getSearchCategory,
  getSearchWearableCategory
} from '../../modules/routing/search'
import { View } from '../../modules/ui/types'
import {
  WearableRarity,
  WearableGender
} from '../../modules/nft/wearable/types'
import { NFTCategory } from '../../modules/nft/types'
import { getSortOrder } from '../../modules/nft/utils'
import { ContractName, Vendors } from '../../modules/vendor/types'
import {
  MAX_QUERY_SIZE,
  MAX_PAGE,
  PAGE_SIZE
} from '../../modules/vendor/decentraland/apiClient'
import { CategoriesMenu } from '../CategoriesMenu'
import { NFTCard } from '../NFTCard'
import { Row } from '../Layout/Row'
import { Column } from '../Layout/Column'
import { ClearFilters } from './ClearFilters'
import { TextFilter } from './TextFilter'
import { FiltersMenu } from './FiltersMenu'
import { Props } from './NFTListPage.types'
import './NFTListPage.css'

const MAX_RESULTS = 1000

const NFTListPage = (props: Props) => {
  const {
    address,
    defaultOnlyOnSale,
    page,
    section,
    nfts,
    view,
    count,
    wearableRarities,
    wearableGenders,
    contracts,
    search,
    isLoading,
    onFetchNFTs,
    onNavigate
  } = props

  // "Instance" variables
  const category = section ? getSearchCategory(section) : null

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
  const [showFiltersMenu, setShowFiltersMenu] = useState(false)

  const buildSearch = useCallback(
    (options: SearchOptions, clearFilters = false) => {
      let newOptions: SearchOptions = {
        page,
        section,
        sortBy,
        onlyOnSale,
        ...options
      }
      const prevCategory = section ? getSearchCategory(section) : null
      const nextCategory = newOptions.section
        ? getSearchCategory(newOptions.section)
        : null

      // Category specific logic to keep filters if the category doesn't change (unless forced by clearFilters flag)
      if (prevCategory && prevCategory === nextCategory && !clearFilters) {
        switch (nextCategory) {
          case NFTCategory.WEARABLE: {
            newOptions = {
              wearableRarities,
              wearableGenders,
              search,
              contracts,
              ...newOptions
            }
          }
        }
      }

      // Keep search if section is not changing (ie. when clicking  on 'Load more')
      if (section === newOptions.section) {
        newOptions = {
          search,
          ...newOptions
        }
      }

      return newOptions
    },
    [
      wearableRarities,
      wearableGenders,
      page,
      section,
      sortBy,
      onlyOnSale,
      search,
      contracts
    ]
  )

  // Handlers
  const handleOnNavigate = useCallback(
    (section: Section) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        buildSearch({
          page: 1,
          section: section,
          onlyOnSale,
          sortBy
        })
      )
    },
    [onlyOnSale, sortBy, onNavigate, buildSearch]
  )

  const handleOnlyOnSaleChange = useCallback(
    (_: React.SyntheticEvent, props: CheckboxProps) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        buildSearch({
          page: 1,
          onlyOnSale: !!props.checked,
          search
        })
      )
    },
    [onNavigate, buildSearch, search]
  )

  const handleDropdownChange = useCallback(
    (_: React.SyntheticEvent, props: DropdownProps) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        buildSearch({
          page: 1,
          sortBy: props.value as SortBy
        })
      )
    },
    [onNavigate, buildSearch]
  )

  const handleLoadMore = useCallback(() => {
    setOffset(page)
    setLastNFTLength(nfts.length)
    onNavigate(buildSearch({ page: page + 1 }))
  }, [page, nfts, onNavigate, setOffset, buildSearch])

  const handleRaritiesChange = useCallback(
    (options: string[]) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        buildSearch({
          page: 1,
          wearableRarities: options as WearableRarity[]
        })
      )
    },
    [setOffset, setLastNFTLength, onNavigate, buildSearch]
  )

  const handleGendersChange = useCallback(
    (options: string[]) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        buildSearch({
          page: 1,
          wearableGenders: options as WearableGender[]
        })
      )
    },
    [setOffset, setLastNFTLength, onNavigate, buildSearch]
  )

  const handleCollectionsChange = useCallback(
    (contract: string) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        buildSearch({
          page: 1,
          contracts: [contract as ContractName]
        })
      )
    },
    [setOffset, setLastNFTLength, onNavigate, buildSearch]
  )

  const handleToggleFilterMenu = useCallback(
    () => setShowFiltersMenu(!showFiltersMenu),
    [showFiltersMenu, setShowFiltersMenu]
  )

  const handleSearch = useCallback(
    (newSearch: string) => {
      if (search !== newSearch) {
        setOffset(0)
        setLastNFTLength(0)
        onNavigate(buildSearch({ page: 1, search: newSearch }))
      }
    },
    [setOffset, setLastNFTLength, onNavigate, buildSearch, search]
  )

  const handleClearFilters = useCallback(() => {
    setOffset(0)
    setLastNFTLength(0)
    onNavigate(buildSearch({ page: 1 }, true))
  }, [setOffset, setLastNFTLength, onNavigate, buildSearch])

  // Kick things off
  useEffect(() => {
    const skip = Math.min(offset, MAX_PAGE) * PAGE_SIZE
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
        wearableRarities,
        wearableGenders,
        wearableCategory,
        contracts,
        search
      },
      vendor: Vendors.DECENTRALAND,
      view: skip === 0 ? view : View.LOAD_MORE
    })
  }, [
    address,
    onlyOnSale,
    view,
    offset,
    page,
    section,
    sortBy,
    wearableRarities,
    wearableGenders,
    contracts,
    search,
    onFetchNFTs
  ])

  // Close the menu when the category changes
  useEffect(() => setShowFiltersMenu(false), [category, setShowFiltersMenu])

  let appliedFilters = []
  if (wearableRarities.length > 0) {
    appliedFilters.push(t('nft_list_page.rarity'))
  }
  if (wearableGenders.length > 0) {
    appliedFilters.push(t('nft_list_page.gender'))
  }
  if (contracts.length > 0) {
    appliedFilters.push(t('nft_list_page.collection'))
  }

  return (
    <Page className="NFTListPage">
      <Row>
        <Column align="left">
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <CategoriesMenu
              section={section}
              onMenuItemClick={handleOnNavigate}
            />
          </Responsive>
        </Column>

        <Column align="right" grow={true}>
          <div className="topbar">
            <TextFilter
              value={search}
              placeholder={t('nft_list_page.search', {
                category: t(`menu.${section}`).toLowerCase()
              })}
              onChange={handleSearch}
            />
            <Responsive
              as={Dropdown}
              minWidth={Responsive.onlyTablet.minWidth}
              direction="left"
              value={sortBy}
              options={dropdownOptions}
              onChange={handleDropdownChange}
            />

            {category === NFTCategory.WEARABLE ? (
              <Responsive
                minWidth={Responsive.onlyTablet.minWidth}
                className="open-filters-wrapper"
                onClick={handleToggleFilterMenu}
              >
                <div className="label">{t('nft_list_page.filter')}</div>
                <div
                  className={`open-filters ${
                    showFiltersMenu || appliedFilters.length > 0 ? 'active' : ''
                  }`}
                />
              </Responsive>
            ) : null}
          </div>

          <HeaderMenu>
            <HeaderMenu.Left>
              {appliedFilters.length > 0 ? (
                <ClearFilters
                  filters={appliedFilters}
                  onClear={handleClearFilters}
                />
              ) : null}
              <Header sub className="results">
                {count === null
                  ? t('global.loading') + '...'
                  : count < MAX_RESULTS
                  ? t('nft_list_page.results', {
                      count: count.toLocaleString()
                    })
                  : t('nft_list_page.more_than_results', {
                      count: count.toLocaleString()
                    })}
              </Header>
            </HeaderMenu.Left>
            <HeaderMenu.Right>
              <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                <Radio
                  toggle
                  checked={onlyOnSale}
                  onChange={handleOnlyOnSaleChange}
                  label={t('nft_list_page.on_sale')}
                />
              </Responsive>
              <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
                <div
                  className="open-filters-wrapper"
                  onClick={() => setShowFiltersModal(!showFiltersModal)}
                >
                  <div className="label">{t('nft_list_page.filter')}</div>
                  <div
                    className={`open-filters ${
                      showFiltersMenu || appliedFilters.length > 0
                        ? 'active'
                        : ''
                    }`}
                  />
                </div>
              </Responsive>
            </HeaderMenu.Right>
          </HeaderMenu>

          {showFiltersMenu ? (
            <Responsive
              minWidth={Responsive.onlyTablet.minWidth}
              className="filters"
            >
              <FiltersMenu
                selectedCollection={contracts[0]}
                selectedRarities={wearableRarities}
                selectedGenders={wearableGenders}
                onCollectionsChange={handleCollectionsChange}
                onGendersChange={handleGendersChange}
                onRaritiesChange={handleRaritiesChange}
              />
            </Responsive>
          ) : null}

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

          <div className="load-more">
            {nfts.length >= PAGE_SIZE &&
            nfts.length > lastNFTLength &&
            (nfts.length !== count || count === MAX_QUERY_SIZE) &&
            page <= MAX_PAGE ? (
              <Button
                loading={isLoading}
                inverted
                primary
                onClick={handleLoadMore}
              >
                {t('global.load_more')}
              </Button>
            ) : null}
          </div>
        </Column>
      </Row>

      <Modal
        className="FiltersModal"
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
      >
        <Modal.Header>{t('nft_list_page.filter')}</Modal.Header>
        <Modal.Content>
          <FiltersMenu
            selectedCollection={contracts[0]}
            selectedRarities={wearableRarities}
            selectedGenders={wearableGenders}
            onCollectionsChange={handleCollectionsChange}
            onGendersChange={handleGendersChange}
            onRaritiesChange={handleRaritiesChange}
          />
          <div className="filter-row">
            <Header sub>{t('nft_list_page.order_by')}</Header>
            <Dropdown
              direction="left"
              value={sortBy}
              options={dropdownOptions}
              onChange={handleDropdownChange}
            />
          </div>
          <div className="filter-row">
            <Header sub>{t('nft_list_page.on_sale')}</Header>
            <Radio
              toggle
              checked={onlyOnSale}
              onChange={handleOnlyOnSaleChange}
            />
          </div>
          <CategoriesMenu
            section={section}
            onMenuItemClick={handleOnNavigate}
          />
          <Button
            className="apply-filters"
            primary
            onClick={() => setShowFiltersModal(false)}
          >
            {t('global.apply')}
          </Button>
        </Modal.Content>
      </Modal>
    </Page>
  )
}

export default React.memo(NFTListPage)
