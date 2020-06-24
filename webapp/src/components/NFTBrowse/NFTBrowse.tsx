import React, { useCallback, useEffect, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Page,
  Radio,
  CheckboxProps,
  Button,
  HeaderMenu,
  Header,
  Dropdown,
  DropdownProps,
  Responsive,
  Card,
  Loader,
  Modal
} from 'decentraland-ui'

import {
  // SearchOptions,
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
import { useNavigate } from '../../modules/nft/hooks'
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
import { TextFilter } from './TextFilter'
import { FiltersMenu } from './FiltersMenu'
import { Props } from './NFTBrowse.types'
import './NFTBrowse.css'

import { NFT } from '../../modules/nft/types' // From NFTList

const MAX_RESULTS = 1000

const NFTBrowse = (props: Props) => {
  const {
    address,
    defaultOnlyOnSale,
    page,
    section,
    sortBy,
    nfts,
    view,
    count,
    wearableRarities,
    wearableGenders,
    contracts,
    search,
    isLoading,
    onFetchNFTs
  } = props

  // "Instance" variables
  const onlyOnSale =
    props.onlyOnSale === undefined ? defaultOnlyOnSale : props.onlyOnSale

  // State variables
  const data = useNavigate()
  const isLoadMore = data[1]

  // Kick things off
  useEffect(() => {
    const offset = isLoadMore ? page - 1 : 0
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

    const fetchView = isLoadMore ? View.LOAD_MORE : view
    const vendor = Vendors.DECENTRALAND

    onFetchNFTs(
      fetchView,
      vendor,
      {
        first,
        skip,
        orderBy,
        orderDirection,
        onlyOnSale,
        address,
        category,
        search
      },
      {
        isLand,
        isWearableHead,
        isWearableAccessory,
        wearableRarities,
        wearableGenders,
        wearableCategory,
        contracts
      }
    )
  }, [
    isLoadMore,
    address,
    onlyOnSale,
    view,
    page,
    section,
    sortBy,
    wearableRarities,
    wearableGenders,
    contracts,
    search,
    onFetchNFTs
  ])

  return (
    <Page className="NFTBrowse">
      <Row>
        <Column align="left">
          <Responsive minWidth={Responsive.onlyTablet.minWidth}>
            <Sidebar section={section} />
          </Responsive>
        </Column>

        <Column align="right" grow={true}>
          <Filters
            section={section}
            sortBy={sortBy}
            search={search}
            count={count}
            onlyOnSale={onlyOnSale}
            wearableRarities={wearableRarities}
            wearableGenders={wearableGenders}
            contracts={contracts}
          />

          <NFTList
            nfts={nfts}
            page={page}
            count={count}
            isLoading={isLoading}
          />
        </Column>
      </Row>
    </Page>
  )
}

export default React.memo(NFTBrowse)

type SidebarProps = {
  section: Section
}
export const Sidebar = (props: SidebarProps) => {
  const { section } = props
  const [navigate] = useNavigate()

  const handleOnNavigate = useCallback(
    (section: Section) => {
      navigate({ section: section })
    },
    [navigate]
  )

  return <CategoriesMenu section={section} onMenuItemClick={handleOnNavigate} />
}

type NFTListProps = {
  nfts: NFT[]
  page: number
  count?: number
  isLoading: boolean
}
export const NFTList = (props: NFTListProps) => {
  const { nfts, page, count, isLoading } = props
  const [navigate] = useNavigate()

  const handleLoadMore = useCallback(() => {
    navigate({ page: page + 1 })
  }, [page, navigate])

  return (
    <>
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

      {(nfts.length !== count || count === MAX_QUERY_SIZE) &&
      page <= MAX_PAGE ? (
        <div className="load-more">
          <Button loading={isLoading} inverted primary onClick={handleLoadMore}>
            {t('global.load_more')}
          </Button>
        </div>
      ) : null}
    </>
  )
}

type FiltersProps = {
  section: Section
  sortBy: SortBy
  search: string
  count?: number
  onlyOnSale: boolean
  wearableRarities: WearableRarity[]
  wearableGenders: WearableGender[]
  contracts: ContractName[]
}
export const Filters = (props: FiltersProps) => {
  const {
    section,
    search,
    count,
    onlyOnSale,
    wearableRarities,
    wearableGenders,
    contracts
  } = props
  const [navigate] = useNavigate()

  const [showFiltersMenu, setShowFiltersMenu] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  const category = section ? getSearchCategory(section) : null
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

  const appliedFilters = []
  if (wearableRarities.length > 0) {
    appliedFilters.push(t('nft_list_page.rarity'))
  }
  if (wearableGenders.length > 0) {
    appliedFilters.push(t('nft_list_page.gender'))
  }
  if (contracts.length > 0) {
    appliedFilters.push(t('nft_list_page.collection'))
  }

  const handleOnlyOnSaleChange = useCallback(
    (_, props: CheckboxProps) => {
      navigate({ onlyOnSale: !!props.checked })
    },
    [navigate]
  )

  const handleDropdownChange = useCallback(
    (_, props: DropdownProps) => {
      navigate({ sortBy: props.value as SortBy })
    },
    [navigate]
  )

  const handleRaritiesChange = useCallback(
    (options: string[]) => {
      navigate({ wearableRarities: options as WearableRarity[] })
    },
    [navigate]
  )

  const handleGendersChange = useCallback(
    (options: string[]) => {
      navigate({ wearableGenders: options as WearableGender[] })
    },
    [navigate]
  )

  const handleCollectionsChange = useCallback(
    (contract: string) => {
      navigate({ contracts: [contract as ContractName] })
    },
    [navigate]
  )

  const handleSearch = useCallback(
    (newSearch: string) => {
      if (search !== newSearch) {
        navigate({ search: newSearch })
      }
    },
    [search, navigate]
  )

  const handleToggleFilterMenu = useCallback(
    () => setShowFiltersMenu(!showFiltersMenu),
    [showFiltersMenu, setShowFiltersMenu]
  )

  useEffect(() => setShowFiltersMenu(false), [category, setShowFiltersMenu])

  return (
    <>
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
          <Header sub className="results">
            {count === undefined
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
          <Sidebar section={section} />
          <Button
            className="apply-filters"
            primary
            onClick={() => setShowFiltersModal(false)}
          >
            {t('global.apply')}
          </Button>
        </Modal.Content>
      </Modal>
    </>
  )
}
