import React, { useCallback, useEffect, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import {
  Radio,
  CheckboxProps,
  Button,
  Header,
  Dropdown,
  DropdownProps,
  Modal,
  Icon
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { LANDFilters } from '../../Vendor/decentraland/types'
import { browseRentedLAND } from '../../Vendor/decentraland/utils'
import { SortBy } from '../../../modules/routing/types'
import { getCategoryFromSection } from '../../../modules/routing/search'
import { NFTSidebar } from '../../Vendor/NFTSidebar'
import { AssetType } from '../../../modules/asset/types'
import { isLandSection } from '../../../modules/ui/utils'
import { Props } from './AssetFiltersModal.types'
import './AssetFiltersModal.css'

const AssetFiltersModal = (props: Props) => {
  const {
    section,
    onlyOnSale,
    onlyOnRent,
    rarities,
    wearableGenders,
    contracts,
    onBrowse,
    assetType,
    hasFiltersEnabled,
    onClearFilters,
    isRentalsEnabled,
    onClose
  } = props
  const category = section ? getCategoryFromSection(section) : undefined

  const [showFiltersMenu, setShowFiltersMenu] = useState(false)

  let orderByDropdownOptions = undefined
  if (onlyOnRent) {
    orderByDropdownOptions = [
      {
        value: SortBy.RENTAL_LISTING_DATE,
        text: t('filters.recently_listed_for_rent')
      },
      { value: SortBy.NAME, text: t('filters.name') },
      { value: SortBy.NEWEST, text: t('filters.newest') },
      { value: SortBy.MAX_RENTAL_PRICE, text: t('filters.cheapest') }
    ]
  } else {
    orderByDropdownOptions = [
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
      value: SortBy.RECENTLY_SOLD,
      text: t('filters.recently_sold')
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

  const handleOnlyOnSaleChange = useCallback(
    (_, props: CheckboxProps) => {
      onBrowse({ sortBy: SortBy.NEWEST, onlyOnSale: !!props.checked })
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

  useEffect(
    () =>
      setShowFiltersMenu(
        category === NFTCategory.WEARABLE || category === NFTCategory.EMOTE
      ),
    [category, setShowFiltersMenu]
  )

  return (
    <div className="AssetFilters">
      <Modal open className="AssetFiltersModal" onClose={onClose}>
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
            onClick={e => onClose?.(e, {})}
          >
            {t('global.apply')}
          </Button>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default React.memo(AssetFiltersModal)
