import { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import {
  Dropdown,
  DropdownProps,
  Field,
  Icon,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { AssetType } from '../../modules/asset/types'
import { useInput } from '../../lib/input'
import { getCountText, getOrderByOptions } from './utils'
import { SortBy } from '../../modules/routing/types'
import {
  getCategoryFromSection,
  getSectionFromCategory
} from '../../modules/routing/search'
import {
  isAccountView,
  isLandSection,
  isListsSection,
  persistIsMapProperty
} from '../../modules/ui/utils'
import { Chip } from '../Chip'
import { AssetTypeFilter } from './AssetTypeFilter'
import { Props } from './AssetTopbar.types'
import { SelectedFilters } from './SelectedFilters'
import styles from './AssetTopbar.module.css'

export const AssetTopbar = ({
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
  const isMobile = useTabletAndBelowMediaQuery()
  const category = section ? getCategoryFromSection(section) : undefined

  const handleSearch = useCallback(
    (value: string) => {
      if (search !== value) {
        onBrowse({
          search: value,
          section: category ? getSectionFromCategory(category) : section
        })
      }
    },
    [category, onBrowse, search, section]
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

  return (
    <div className={styles.assetTopbar}>
      <div
        className={classNames(styles.searchContainer, {
          [styles.searchMap]: isMap
        })}
      >
        {!isMap && !isListsSection(section) && (
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
      {view &&
        !isLandSection(section) &&
        !isAccountView(view) &&
        !isListsSection(section) &&
        (category === NFTCategory.WEARABLE ||
          category === NFTCategory.EMOTE) && (
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
            {hasFiltersEnabled && !isMobile && (
              <button className={styles.clearFilters} onClick={onClearFilters}>
                {t('filters.clear')}
              </button>
            )}
          </div>
          {!isListsSection(section) ? (
            <div className={styles.rightOptionsContainer}>
              <Dropdown
                direction="left"
                value={sortByValue}
                options={orderByDropdownOptions}
                onChange={handleOrderByDropdownChange}
              />
              {isMobile ? (
                <i
                  className={classNames(
                    styles.openFilters,
                    styles.openFiltersWrapper,
                    hasFiltersEnabled && styles.active
                  )}
                  onClick={onOpenFiltersModal}
                />
              ) : null}
            </div>
          ) : null}
        </div>
      )}
      {!isMap && hasFiltersEnabled ? (
        <div className={styles.selectedFiltersContainer}>
          <SelectedFilters />
          {isMobile && (
            <button className={styles.clearFilters} onClick={onClearFilters}>
              {t('filters.clear')}
            </button>
          )}
        </div>
      ) : null}
    </div>
  )
}
