import { useCallback, useEffect, useMemo, useState } from 'react'
import classNames from 'classnames'
import {
  Dropdown,
  DropdownProps,
  Field,
  Icon,
  useMobileMediaQuery
} from 'decentraland-ui'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../../../modules/asset/types'
import { useInput } from '../../../../lib/input'
import { getCountText, getOrderByOptions } from './utils'
import { SortBy } from '../../../../modules/routing/types'
import { getCategoryFromSection } from '../../../../modules/routing/search'
import {
  isAccountView,
  isLandSection,
  persistIsMapProperty
} from '../../../../modules/ui/utils'
import { Chip } from '../../../Chip'
import { AssetTypeFilter } from './AssetTypeFilter'
import { Props } from './NFTTopbar.types'
import { SelectedFilters } from './SelectedFilters'
import styles from './NFTTopbar.module.css'

export const NFTTopbar = ({
  search,
  view,
  assetType,
  count,
  isMap,
  onlyOnSale,
  onlyOnRent,
  sortBy,
  section,
  hasFiltersEnabled,
  onBrowse,
  onClearFilters,
  onOpenFiltersModal
}: Props): JSX.Element => {
  const isMobile = useMobileMediaQuery()
  const [showFiltersMenu, setShowFiltersMenu] = useState(false)
  const category = section ? getCategoryFromSection(section) : undefined

  const handleSearch = useCallback(
    (value: string) => {
      if (search !== value) {
        onBrowse({ search: value })
      }
    },
    [onBrowse, search]
  )

  const [searchValue, setSearchValue] = useInput(search, handleSearch, 500)

  const handleAssetTypeChange = useCallback(
    (value: AssetType) => {
      onBrowse({ assetType: value })
    },
    [onBrowse]
  )

  const handleOrderByDropdownChange = useCallback(
    (_, props: DropdownProps) => {
      onBrowse({ sortBy: props.value as SortBy })
    },
    [onBrowse]
  )

  const handleIsMapChange = useCallback(
    (isMap: boolean) => {
      persistIsMapProperty(isMap)

      onBrowse({
        isMap,
        isFullscreen: isMap,
        search: '',
        // Forces the onlyOnSale property in the defined cases so the users can see LAND on sale.
        onlyOnSale:
          (!onlyOnSale && onlyOnRent === false) ||
          (onlyOnSale === undefined && onlyOnRent === undefined) ||
          onlyOnSale
      })
    },
    [onBrowse, onlyOnSale, onlyOnRent]
  )

  const orderByDropdownOptions = useMemo(
    () => getOrderByOptions(onlyOnRent, onlyOnSale),
    [onlyOnRent, onlyOnSale]
  )

  const sortByValue = orderByDropdownOptions.find(
    option => option.value === sortBy
  )
    ? sortBy
    : orderByDropdownOptions[0].value

  useEffect(
    () =>
      setShowFiltersMenu(
        category === NFTCategory.WEARABLE || category === NFTCategory.EMOTE
      ),
    [category, setShowFiltersMenu]
  )

  return (
    <div className={styles.nftTopbar}>
      <div>
        {!isMap && (
          <Field
            className={styles.searchField}
            placeholder={t('nft_filters.search')}
            kind="full"
            value={searchValue}
            onChange={setSearchValue}
            icon={<Icon name="search" />}
            iconPosition="left"
          />
        )}
        {isLandSection(section) && !isAccountView(view!) && (
          <div
            className={classNames(styles.mapToggle, { [styles.map]: isMap })}
          >
            <Chip
              className="grid"
              icon="table"
              isActive={!isMap}
              onClick={handleIsMapChange.bind(null, false)}
            />
            <Chip
              className="atlas"
              icon="map marker alternate"
              isActive={isMap}
              onClick={handleIsMapChange.bind(null, true)}
            />
          </div>
        )}
      </div>
      {!isLandSection(section) && view && !isAccountView(view) && (
        <AssetTypeFilter
          view={view}
          assetType={assetType}
          onChange={handleAssetTypeChange}
        />
      )}
      {!isMap && (
        <div className={styles.infoRow}>
          <div className={styles.countContainer}>
            <p className={styles.countText}>{getCountText(count, search)}</p>
            {hasFiltersEnabled && (
              <button className={styles.clearFilters} onClick={onClearFilters}>
                {t('filters.clear')}
              </button>
            )}
          </div>
          <div className={styles.rightOptionsContainer}>
            <Dropdown
              direction="left"
              value={sortByValue}
              options={orderByDropdownOptions}
              onChange={handleOrderByDropdownChange}
            />
            {isMobile ? (
              <div
                className={styles.openFiltersWrapper}
                onClick={onOpenFiltersModal}
              >
                <div
                  className={classNames(
                    styles.openFilters,
                    (showFiltersMenu || hasFiltersEnabled) && styles.active
                  )}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}
      <SelectedFilters />
    </div>
  )
}
