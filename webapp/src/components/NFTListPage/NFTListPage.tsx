import React, { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isMobile } from 'decentraland-dapps/dist/lib/utils'
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
  Modal,
  Row
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
import { ContractName } from '../../modules/contract/types'
import {
  contractAddresses,
  contractCategories,
  contractSymbols
} from '../../modules/contract/utils'
import {
  MAX_QUERY_SIZE,
  MAX_PAGE,
  PAGE_SIZE
} from '../../modules/vendor/decentraland/apiClient'
import { CategoriesMenu } from '../CategoriesMenu'
import { NFTCard } from '../NFTCard'
import { Props } from './NFTListPage.types'
import { ClearFilter } from './ClearFilter'
import { TextFilter } from './TextFilter'
import { ArrayFilter } from './ArrayFilter'
import { SelectFilter } from './SelectFilter'
import './NFTListPage.css'

export const ALL_COLLECTIONS_FILTER_OPTION = 'all'
const MAX_RESULTS = 1000
const RARITY_FILTER_OPTIONS = Object.values(WearableRarity)
  .filter(x => x !== WearableRarity.COMMON && x !== WearableRarity.UNIQUE)
  .reverse()
const GENDER_FILTER_OPTIONS = Object.values(WearableGender)
const COLLECTION_FILTER_OPTIONS = Object.keys(contractAddresses).filter(
  key =>
    contractCategories[contractAddresses[key as ContractName]] ===
    NFTCategory.WEARABLE
) as ContractName[]

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

  const fillVariables = useCallback(
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

      // category specific logic to keep filters if the category doesn't change (unless forced by clearFilters flag)
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

      // keep search if section is not changing (ie. when clicking  on 'load more')
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
    (options?: SearchOptions) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          ...options,
          onlyOnSale,
          sortBy
        })
      )
    },
    [onlyOnSale, sortBy, onNavigate, fillVariables]
  )

  const handleOnlyOnSaleChange = useCallback(
    (_: React.SyntheticEvent, props: CheckboxProps) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          onlyOnSale: !!props.checked,
          search
        })
      )
    },
    [onNavigate, fillVariables, search]
  )

  const handleDropdownChange = useCallback(
    (_: React.SyntheticEvent, props: DropdownProps) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          sortBy: props.value as SortBy
        })
      )
    },
    [onNavigate, fillVariables]
  )

  const handleLoadMore = useCallback(() => {
    setOffset(page)
    setLastNFTLength(nfts.length)
    onNavigate(
      fillVariables({
        page: page + 1
      })
    )
  }, [page, nfts, onNavigate, setOffset, fillVariables])

  const handleRaritiesChange = useCallback(
    (options: string[]) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          wearableRarities: options as WearableRarity[]
        })
      )
    },
    [setOffset, setLastNFTLength, onNavigate, fillVariables]
  )

  const handleGendersChange = useCallback(
    (options: string[]) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          wearableGenders: options as WearableGender[]
        })
      )
    },
    [setOffset, setLastNFTLength, onNavigate, fillVariables]
  )

  const handleCollectionsChange = useCallback(
    (contract: string) => {
      setOffset(0)
      setLastNFTLength(0)
      onNavigate(
        fillVariables({
          page: 1,
          contracts: [contract as ContractName]
        })
      )
    },
    [setOffset, setLastNFTLength, onNavigate, fillVariables]
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
        onNavigate(
          fillVariables({
            page: 1,
            search: newSearch
          })
        )
      }
    },
    [setOffset, setLastNFTLength, onNavigate, fillVariables, search]
  )

  const handleClearFilters = useCallback(() => {
    setOffset(0)
    setLastNFTLength(0)
    onNavigate(
      fillVariables(
        {
          page: 1
        },
        true
      )
    )
  }, [setOffset, setLastNFTLength, onNavigate, fillVariables])

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

  // close the menu when the category changes
  useEffect(() => setShowFiltersMenu(false), [category, setShowFiltersMenu])

  const filters = (
    <>
      <Row>
        <SelectFilter
          name={t('nft_list_page.collection')}
          value={contracts[0] || ALL_COLLECTIONS_FILTER_OPTION}
          options={[
            {
              value: ALL_COLLECTIONS_FILTER_OPTION,
              text: t('nft_list_page.all_collections')
            },
            ...COLLECTION_FILTER_OPTIONS.map(collection => ({
              value: collection,
              text: contractSymbols[contractAddresses[collection]]
            }))
          ]}
          onChange={handleCollectionsChange}
        />
      </Row>
      <Row>
        <ArrayFilter
          name={t('nft_list_page.rarity')}
          values={wearableRarities}
          options={RARITY_FILTER_OPTIONS.map(rarity => ({
            value: rarity,
            text: t(`wearable.rarity.${rarity}`)
          }))}
          onChange={handleRaritiesChange}
        />
        <ArrayFilter
          name={t('nft_list_page.gender')}
          values={wearableGenders}
          options={GENDER_FILTER_OPTIONS.map(gender => ({
            value: gender,
            text: t(`wearable.body_shape.${gender}`)
          }))}
          onChange={handleGendersChange}
        />
      </Row>
    </>
  )

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

  let appliedFiltersLabel = ''
  if (appliedFilters.length === 1) {
    appliedFiltersLabel = appliedFilters[0]
    // "RARITY, GENDER (X)" on desktop, "2 FILTERS (X)" on mobile
  } else if (appliedFilters.length === 2 && !isMobile()) {
    appliedFiltersLabel = appliedFilters.join(', ')
  } else if (appliedFilters.length > 1) {
    appliedFiltersLabel = t('nft_list_page.multiple_filters', {
      count: appliedFilters.length
    })
  }

  return (
    <Page className="NFTListPage">
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Grid.Column className="left-column">
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
        </Grid.Column>
      </Responsive>
      <Grid.Column className="right-column">
        <div className="topbar">
          <TextFilter
            value={search}
            placeholder={t('nft_list_page.search', {
              category: t(`categories_menu.menu_item.${section}`).toLowerCase()
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
              <ClearFilter
                name={appliedFiltersLabel}
                onClear={handleClearFilters}
              />
            ) : null}
            <Header sub className="results">
              {count === null
                ? t('global.loading') + '...'
                : count < MAX_RESULTS
                ? t('nft_list_page.results', { count: count.toLocaleString() })
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
                    showFiltersMenu || appliedFilters.length > 0 ? 'active' : ''
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
            {filters}
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
      </Grid.Column>
      <Modal
        className="FiltersModal"
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
      >
        <Modal.Header>{t('nft_list_page.filter')}</Modal.Header>
        <Modal.Content>
          {filters}
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
          <CategoriesMenu section={section} onNavigate={handleOnNavigate} />
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
