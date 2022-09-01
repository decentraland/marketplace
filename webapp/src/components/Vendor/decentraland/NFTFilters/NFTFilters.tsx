import React, { useCallback, useEffect, useState } from 'react'
import {
  Radio,
  CheckboxProps,
  Button,
  Header,
  Dropdown,
  DropdownProps,
  Responsive,
  Modal,
  Icon,
  NotMobile
} from 'decentraland-ui'
import { Network, NFTCategory, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { SortBy } from '../../../../modules/routing/types'
import { WearableGender } from '../../../../modules/nft/wearable/types'
import { Section } from '../../../../modules/vendor/decentraland/routing/types'
import { getCategoryFromSection } from '../../../../modules/routing/search'
import { MAX_QUERY_SIZE } from '../../../../modules/vendor/api'
import { NFTSidebar } from '../../NFTSidebar'
import { Chip } from '../../../Chip'
import { TextFilter } from '../../NFTFilters/TextFilter'
import { FiltersMenu } from '../../NFTFilters/FiltersMenu'
import { Props } from './NFTFilters.types'
import { AssetType } from '../../../../modules/asset/types'

const NFTFilters = (props: Props) => {
  const {
    section,
    search,
    count,
    onlyOnSale,
    onlySmart,
    isMap,
    rarities,
    wearableGenders,
    contracts,
    network,
    onBrowse,
    assetType,
    hasFiltersEnabled,
    onClearFilters
  } = props

  const category = section ? getCategoryFromSection(section) : undefined

  const [showFiltersMenu, setShowFiltersMenu] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  const orderBydropdownOptions = [
    { value: SortBy.RECENTLY_SOLD, text: t('filters.recently_sold') },
    { value: SortBy.NEWEST, text: t('filters.newest') },
    { value: SortBy.NAME, text: t('filters.name') }
  ]
  const typeDropdownOptions = [
    { value: AssetType.ITEM, text: t('filters.item') },
    { value: AssetType.NFT, text: t('filters.nft') }
  ]

  if (onlyOnSale) {
    orderBydropdownOptions.unshift({
      value: SortBy.RECENTLY_LISTED,
      text: t('filters.recently_listed')
    })
    orderBydropdownOptions.unshift({
      value: SortBy.CHEAPEST,
      text: t('filters.cheapest')
    })
  }

  const sortBy = orderBydropdownOptions.find(
    option => option.value === props.sortBy
  )
    ? props.sortBy
    : orderBydropdownOptions[0].value

  const appliedFilters = []
  if (rarities.length > 0) {
    appliedFilters.push(t('nft_filters.rarity'))
  }
  if (wearableGenders.length > 0) {
    appliedFilters.push(t('nft_filters.gender'))
  }
  if (contracts.length > 0) {
    appliedFilters.push(t('nft_filters.collection'))
  }

  const handleToggleOnlySmart = useCallback(
    (newOnlySmart: boolean) => onBrowse({ onlySmart: newOnlySmart }),
    [onBrowse]
  )

  const handleOnlyOnSaleChange = useCallback(
    (_, props: CheckboxProps) => {
      onBrowse({ sortBy: SortBy.NEWEST, onlyOnSale: !!props.checked })
    },
    [onBrowse]
  )

  const handleIsMapChange = useCallback(
    (isMap: boolean) => {
      onBrowse({ isMap, isFullscreen: isMap, search: '' })
    },
    [onBrowse]
  )

  const handleOrderByDropdownChange = useCallback(
    (_, props: DropdownProps) => {
      onBrowse({ sortBy: props.value as SortBy })
    },
    [onBrowse]
  )

  const handleTypeByDropdownChange = useCallback(
    (_, props: DropdownProps) => {
      onBrowse({ assetType: props.value as AssetType })
    },
    [onBrowse]
  )

  const handleRaritiesChange = useCallback(
    (options: string[]) => {
      onBrowse({ rarities: options as Rarity[] })
    },
    [onBrowse]
  )

  const handleGendersChange = useCallback(
    (options: string[]) => {
      onBrowse({ wearableGenders: options as WearableGender[] })
    },
    [onBrowse]
  )

  const handleCollectionsChange = useCallback(
    (contract?: string) => {
      onBrowse({ contracts: contract ? [contract] : undefined })
    },
    [onBrowse]
  )

  const handleSearch = useCallback(
    (newSearch: string) => {
      if (search !== newSearch) {
        onBrowse({ search: newSearch, isMap: false, isFullscreen: false })
      }
    },
    [search, onBrowse]
  )

  const handleNetworkChange = useCallback(
    (newNetwork: Network) => {
      if (network !== newNetwork) {
        onBrowse({ network: newNetwork })
      }
    },
    [network, onBrowse]
  )

  useEffect(() => setShowFiltersMenu(category === NFTCategory.WEARABLE), [
    category,
    setShowFiltersMenu
  ])

  const searchPlaceholder = isMap
    ? t('nft_filters.search_land')
    : count === undefined
    ? t('global.loading') + '...'
    : t('nft_filters.search', {
        suffix:
          count < MAX_QUERY_SIZE
            ? t('nft_filters.results', {
                count: count.toLocaleString()
              })
            : t('nft_filters.more_than_results', {
                count: count.toLocaleString()
              })
      })

  return (
    <div className="NFTFilters">
      <div className="topbar">
        {isMap ? (
          <>
            <TextFilter
              value={search}
              placeholder={searchPlaceholder}
              onChange={handleSearch}
            />
            <Responsive
              minWidth={Responsive.onlyTablet.minWidth}
              className="topbar-filter"
            >
              <Radio
                toggle
                checked={onlyOnSale}
                onChange={handleOnlyOnSaleChange}
                label={t('nft_filters.on_sale')}
              />
            </Responsive>
          </>
        ) : (
          <>
            <TextFilter
              value={search}
              placeholder={searchPlaceholder}
              onChange={handleSearch}
            />
            <NotMobile>
              {hasFiltersEnabled && (
                <div className="clear-filters" onClick={onClearFilters}>
                  <Icon
                    aria-label="Clear filters"
                    aria-hidden="false"
                    name="close"
                  />
                  <span>{t('filters.clear')}</span>
                </div>
              )}
            </NotMobile>
            <Responsive
              minWidth={Responsive.onlyTablet.minWidth}
              className="topbar-filter"
            >
              <Dropdown
                direction="left"
                value={sortBy}
                options={orderBydropdownOptions}
                onChange={handleOrderByDropdownChange}
              />
            </Responsive>
            <Responsive
              minWidth={Responsive.onlyTablet.minWidth}
              className="topbar-filter"
            >
              <Radio
                toggle
                checked={onlyOnSale}
                onChange={handleOnlyOnSaleChange}
                label={t('nft_filters.on_sale')}
              />
            </Responsive>
          </>
        )}

        <Responsive maxWidth={Responsive.onlyMobile.maxWidth}>
          <div
            className="open-filters-wrapper"
            onClick={() => setShowFiltersModal(!showFiltersModal)}
          >
            <div className="label">{t('nft_filters.filter')}</div>
            <div
              className={`open-filters ${
                showFiltersMenu || appliedFilters.length > 0 ? 'active' : ''
              }`}
            />
          </div>
        </Responsive>

        {section === Section.LAND ||
        section === Section.PARCELS ||
        section === Section.ESTATES ? (
          <div className="topbar-filter">
            <div className="toggle-map">
              <Chip
                className="grid"
                icon="table"
                isActive={!isMap}
                onClick={() => handleIsMapChange(false)}
              />
              <Chip
                className="atlas"
                icon="map marker alternate"
                isActive={isMap}
                onClick={() => handleIsMapChange(true)}
              />
            </div>
          </div>
        ) : null}
      </div>

      {showFiltersMenu ? (
        <Responsive
          minWidth={Responsive.onlyTablet.minWidth}
          className="filters"
        >
          <FiltersMenu
            assetType={assetType}
            selectedNetwork={network}
            selectedCollection={contracts[0]}
            selectedRarities={rarities}
            selectedGenders={wearableGenders}
            isOnlySmart={!!onlySmart}
            onCollectionsChange={handleCollectionsChange}
            onGendersChange={handleGendersChange}
            onRaritiesChange={handleRaritiesChange}
            onNetworkChange={handleNetworkChange}
            onOnlySmartChange={handleToggleOnlySmart}
          />
        </Responsive>
      ) : null}

      <Modal
        className="FiltersModal"
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
      >
        <Modal.Header>{t('nft_filters.filter')}</Modal.Header>
        <Modal.Content>
          {hasFiltersEnabled && (
            <div className="filter-row">
              <div className="clear-filters-modal" onClick={onClearFilters}>
                <Icon
                  aria-label="Clear filters"
                  aria-hidden="false"
                  name="close"
                />
                <span>{t('filters.clear')}</span>
              </div>
            </div>
          )}
          {category === NFTCategory.WEARABLE ? (
            <>
              <div className="filter-row">
                <Header sub>{t('filters.type')}</Header>
                <Dropdown
                  direction="left"
                  value={assetType}
                  options={typeDropdownOptions}
                  onChange={handleTypeByDropdownChange}
                />
              </div>
              <FiltersMenu
                assetType={assetType}
                selectedNetwork={network}
                selectedCollection={contracts[0]}
                selectedRarities={rarities}
                selectedGenders={wearableGenders}
                isOnlySmart={!!onlySmart}
                onCollectionsChange={handleCollectionsChange}
                onGendersChange={handleGendersChange}
                onRaritiesChange={handleRaritiesChange}
                onNetworkChange={handleNetworkChange}
                onOnlySmartChange={handleToggleOnlySmart}
              />
            </>
          ) : null}
          <div className="filter-row">
            <Header sub>{t('nft_filters.order_by')}</Header>
            <Dropdown
              direction="left"
              value={sortBy}
              options={orderBydropdownOptions}
              onChange={handleOrderByDropdownChange}
            />
          </div>
          <div className="filter-row">
            <Header sub>{t('nft_filters.on_sale')}</Header>
            <Radio
              toggle
              checked={onlyOnSale}
              onChange={handleOnlyOnSaleChange}
            />
          </div>
          <NFTSidebar />
          <Button
            className="apply-filters"
            primary
            onClick={() => setShowFiltersModal(false)}
          >
            {t('global.apply')}
          </Button>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default React.memo(NFTFilters)
