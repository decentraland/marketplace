import React, { useCallback, useEffect, useState } from 'react'
import {
  Radio,
  CheckboxProps,
  Button,
  Header,
  Dropdown,
  DropdownProps,
  Responsive,
  Modal
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { SortBy } from '../../../../modules/routing/types'
import {
  WearableRarity,
  WearableGender
} from '../../../../modules/nft/wearable/types'
import { ContractName } from '../../../../modules/vendor/types'
import { Section } from '../../../../modules/vendor/decentraland/routing/types'
import { NFTCategory } from '../../../../modules/vendor/decentraland/nft/types'
import { MAX_QUERY_SIZE } from '../../../../modules/vendor/decentraland/api'
import { getSearchCategory } from '../../../../modules/routing/search'
import { NFTSidebar } from '../../NFTSidebar'
import { Chip } from '../../../Chip'
import { TextFilter } from '../../NFTFilters/TextFilter'
import { FiltersMenu } from '../../NFTFilters/FiltersMenu'
import { Props } from './NFTFilters.types'

const NFTFilters = (props: Props) => {
  const {
    section,
    search,
    count,
    onlyOnSale,
    isMap,
    wearableRarities,
    wearableGenders,
    contracts,
    onBrowse
  } = props

  const [showFiltersMenu, setShowFiltersMenu] = useState(false)
  const [showFiltersModal, setShowFiltersModal] = useState(false)

  const category = section ? getSearchCategory(section) : undefined
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

  const handleIsMapChange = useCallback(
    (isMap: boolean) => {
      onBrowse({ isMap })
    },
    [onBrowse]
  )

  const handleDropdownChange = useCallback(
    (_, props: DropdownProps) => {
      onBrowse({ sortBy: props.value as SortBy })
    },
    [onBrowse]
  )

  const handleRaritiesChange = useCallback(
    (options: string[]) => {
      onBrowse({ wearableRarities: options as WearableRarity[] })
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
    (contract: string) => {
      onBrowse({ contracts: [contract as ContractName] })
    },
    [onBrowse]
  )

  const handleSearch = useCallback(
    (newSearch: string) => {
      if (search !== newSearch) {
        onBrowse({ search: newSearch })
      }
    },
    [search, onBrowse]
  )

  const handleToggleFilterMenu = useCallback(
    () => setShowFiltersMenu(!showFiltersMenu),
    [showFiltersMenu, setShowFiltersMenu]
  )

  useEffect(() => setShowFiltersMenu(false), [category, setShowFiltersMenu])

  const searchPlaceholder =
    count === undefined
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
          <div className="full-width" />
        ) : (
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
              <Dropdown
                direction="left"
                value={sortBy}
                options={dropdownOptions}
                onChange={handleDropdownChange}
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

        {section === Section.LAND ||
        section === Section.PARCELS ||
        section === Section.ESTATES ? (
          <Responsive
            minWidth={Responsive.onlyTablet.minWidth}
            className="topbar-filter"
          >
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
          </Responsive>
        ) : null}

        {category === NFTCategory.WEARABLE ? (
          <Responsive
            minWidth={Responsive.onlyTablet.minWidth}
            className="open-filters-wrapper topbar-filter"
            onClick={handleToggleFilterMenu}
          >
            <div
              className={`open-filters ${
                showFiltersMenu || appliedFilters.length > 0 ? 'active' : ''
              }`}
            />
          </Responsive>
        ) : null}

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
      </div>

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
        <Modal.Header>{t('nft_filters.filter')}</Modal.Header>
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
            <Header sub>{t('nft_filters.order_by')}</Header>
            <Dropdown
              direction="left"
              value={sortBy}
              options={dropdownOptions}
              onChange={handleDropdownChange}
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
