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
import { EmotePlayMode, Network, NFTCategory, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { SortBy } from '../../../../modules/routing/types'
import { WearableGender } from '../../../../modules/nft/wearable/types'
import { getCategoryFromSection } from '../../../../modules/routing/search'
import { MAX_QUERY_SIZE } from '../../../../modules/vendor/api'
import { NFTSidebar } from '../../NFTSidebar'
import { Chip } from '../../../Chip'
import { TextFilter } from '../../NFTFilters/TextFilter'
import { FiltersMenu } from '../../NFTFilters/FiltersMenu'
import { Props } from './NFTFilters.types'
import { AssetType } from '../../../../modules/asset/types'
import { isLandSection } from '../../../../modules/ui/utils'
import { LANDFilters } from '../types'
import { browseRentedLAND } from '../utils'

const NFTFilters = (props: Props) => {
  const {
    section,
    search,
    count,
    onlyOnSale,
    onlyOnRent,
    onlySmart,
    isMap,
    rarities,
    wearableGenders,
    contracts,
    network,
    emotePlayMode,
    onBrowse,
    assetType,
    hasFiltersEnabled,
    onClearFilters,
    isRentalsEnabled,
    availableContracts
  } = props

  const category = section ? getCategoryFromSection(section) : undefined

  const [showFiltersMenu, setShowFiltersMenu] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  let orderByDropdownOptions = undefined
  if (onlyOnRent) {
    orderByDropdownOptions = [
      {
        value: SortBy.RENTAL_LISTING_DATE,
        text: t('filters.recently_listed_for_rent')
      },
      { value: SortBy.NAME, text: t('filters.name') },
      { value: SortBy.NEWEST, text: t('filters.newest') }
    ]
  } else {
    orderByDropdownOptions = [
      { value: SortBy.RECENTLY_SOLD, text: t('filters.recently_sold') },
      { value: SortBy.NEWEST, text: t('filters.newest') },
      { value: SortBy.NAME, text: t('filters.name') }
    ]
  }

  const landStatusDropdown = [
    { value: LANDFilters.ALL_LAND, text: t('nft_land_filters.all_land') },
    {
      value: LANDFilters.ONLY_FOR_RENT,
      text: t('nft_land_filters.only_for_rent')
    },
    {
      value: LANDFilters.ONLY_FOR_SALE,
      text: t('nft_land_filters.only_for_sale')
    }
  ]

  const typeDropdownOptions = [
    { value: AssetType.ITEM, text: t('filters.item') },
    { value: AssetType.NFT, text: t('filters.nft') }
  ]

  const shouldShowOnSaleFilter =
    (isRentalsEnabled && ((section && !isLandSection(section!)) || !section)) ||
    !isRentalsEnabled

  if (onlyOnSale) {
    orderByDropdownOptions.unshift({
      value: SortBy.RECENTLY_LISTED,
      text: t('filters.recently_listed')
    })
    orderByDropdownOptions.unshift({
      value: SortBy.CHEAPEST,
      text: t('filters.cheapest')
    })
  }

  const sortBy = orderByDropdownOptions.find(
    option => option.value === props.sortBy
  )
    ? props.sortBy
    : orderByDropdownOptions[0].value

  let currentLANDStatus: LANDFilters
  if (onlyOnRent && !onlyOnSale) {
    currentLANDStatus = LANDFilters.ONLY_FOR_RENT
  } else if (onlyOnSale && !onlyOnRent) {
    currentLANDStatus = LANDFilters.ONLY_FOR_SALE
  } else {
    currentLANDStatus = LANDFilters.ALL_LAND
  }

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

  const handleStatusByDropdownChange = useCallback(
    (_, props: DropdownProps) => {
      browseRentedLAND(onBrowse, props.value as LANDFilters)
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

  const handleEmotePlayModeChange = useCallback(
    (newEmotePlayMode: EmotePlayMode) => {
      if (emotePlayMode !== newEmotePlayMode) {
        onBrowse({ emotePlayMode: newEmotePlayMode })
      }
    },
    [emotePlayMode, onBrowse]
  )

  useEffect(
    () =>
      setShowFiltersMenu(
        category === NFTCategory.WEARABLE || category === NFTCategory.EMOTE
      ),
    [category, setShowFiltersMenu]
  )

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

  const isWearableCategory = category === NFTCategory.WEARABLE
  const isEmoteCategory = category === NFTCategory.EMOTE

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
              {shouldShowOnSaleFilter ? (
                <Radio
                  toggle
                  checked={onlyOnSale}
                  onChange={handleOnlyOnSaleChange}
                  label={t('nft_filters.on_sale')}
                />
              ) : null}
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
              {isRentalsEnabled ? (
                <Dropdown
                  direction="left"
                  className="topbar-dropdown"
                  value={currentLANDStatus}
                  options={landStatusDropdown}
                  onChange={handleStatusByDropdownChange}
                />
              ) : null}
              <Dropdown
                direction="left"
                className="topbar-dropdown"
                value={sortBy}
                options={orderByDropdownOptions}
                onChange={handleOrderByDropdownChange}
              />
            </Responsive>
            <Responsive
              minWidth={Responsive.onlyTablet.minWidth}
              className="topbar-filter"
            >
              {shouldShowOnSaleFilter ? (
                <Radio
                  toggle
                  checked={onlyOnSale}
                  onChange={handleOnlyOnSaleChange}
                  label={t('nft_filters.on_sale')}
                />
              ) : null}
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

        {isLandSection(section) ? (
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
            selectedGenders={isWearableCategory ? wearableGenders : undefined}
            selectedEmotePlayMode={isEmoteCategory ? emotePlayMode : undefined}
            availableContracts={availableContracts}
            isOnlySmart={isWearableCategory ? !!onlySmart : undefined}
            onCollectionsChange={handleCollectionsChange}
            onGendersChange={
              isWearableCategory ? handleGendersChange : undefined
            }
            onRaritiesChange={handleRaritiesChange}
            onNetworkChange={
              isWearableCategory ? handleNetworkChange : undefined
            }
            onEmotePlayModeChange={
              isEmoteCategory ? handleEmotePlayModeChange : undefined
            }
            onOnlySmartChange={
              isWearableCategory ? handleToggleOnlySmart : undefined
            }
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
          {showFiltersMenu ? (
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
                selectedGenders={
                  isWearableCategory ? wearableGenders : undefined
                }
                selectedEmotePlayMode={
                  isEmoteCategory ? emotePlayMode : undefined
                }
                isOnlySmart={isWearableCategory ? !!onlySmart : undefined}
                availableContracts={availableContracts}
                onCollectionsChange={handleCollectionsChange}
                onGendersChange={
                  isWearableCategory ? handleGendersChange : undefined
                }
                onRaritiesChange={handleRaritiesChange}
                onNetworkChange={
                  isWearableCategory ? handleNetworkChange : undefined
                }
                onEmotePlayModeChange={
                  isEmoteCategory ? handleEmotePlayModeChange : undefined
                }
                onOnlySmartChange={
                  isWearableCategory ? handleToggleOnlySmart : undefined
                }
              />
            </>
          ) : null}
          <div className="filter-row">
            <Header sub>{t('nft_filters.order_by')}</Header>
            <Dropdown
              direction="left"
              value={sortBy}
              options={orderByDropdownOptions}
              onChange={handleOrderByDropdownChange}
            />
          </div>
          {isRentalsEnabled && section && isLandSection(section) ? (
            <div className="filter-row">
              <Header sub>{t('filters.status')}</Header>
              <Dropdown
                direction="left"
                value={currentLANDStatus}
                options={landStatusDropdown}
                onChange={handleStatusByDropdownChange}
              />
            </div>
          ) : null}
          {shouldShowOnSaleFilter ? (
            <div className="filter-row">
              <Header sub>{t('nft_filters.on_sale')}</Header>
              <Radio
                toggle
                checked={onlyOnSale}
                onChange={handleOnlyOnSaleChange}
              />
            </div>
          ) : null}
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
