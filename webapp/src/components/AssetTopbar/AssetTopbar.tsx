import { useCallback, useEffect, useRef, useState } from 'react'
import { NFTCategory } from '@dcl/schemas'
import classNames from 'classnames'
import {
  Close,
  Dropdown,
  DropdownProps,
  Field,
  Icon,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { useInput } from '../../lib/input'
import { getCountText } from './utils'
import { SortBy } from '../../modules/routing/types'
import { isCatalogView } from '../../modules/routing/utils'
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
import trash from '../../images/trash.png'
import { Chip } from '../Chip'
import { Props } from './AssetTopbar.types'
import { SelectedFilters } from './SelectedFilters'
import { SearchBarDropdown } from './SearchBarDropdown'
import styles from './AssetTopbar.module.css'

export const AssetTopbar = ({
  search,
  view,
  count,
  isLoading,
  isMap,
  onlyOnSale,
  onlyOnRent,
  sortBy,
  section,
  hasFiltersEnabled,
  onBrowse,
  onClearFilters,
  onOpenFiltersModal,
  sortByOptions
}: Props): JSX.Element => {
  const isMobile = useTabletAndBelowMediaQuery()
  const searchBarFieldRef = useRef<HTMLDivElement>(null)
  const category = section ? getCategoryFromSection(section) : undefined
  const [searchValueForDropdown, setSearchValueForDropdown] = useState(search)
  const [shouldRenderSearchDropdown, setShouldRenderSearchDropdown] = useState(
    false
  )

  const handleInputChange = useCallback(
    text => {
      if (shouldRenderSearchDropdown) {
        setSearchValueForDropdown(text)
      } else if (text) {
        // common search, when the dropdown is not opened
        onBrowse({
          search: text,
          section: category ? getSectionFromCategory(category) : section
        })
      }
    },
    [category, onBrowse, section, shouldRenderSearchDropdown]
  )
  const [searchValue, setSearchValue] = useInput(search, handleInputChange, 500)

  const handleClearSearch = useCallback(() => {
    setSearchValue({ target: { value: '' } } as React.ChangeEvent<
      HTMLInputElement
    >)
    setSearchValueForDropdown('') // clears the input

    onBrowse({
      search: ''
    }) // triggers search with no search term
  }, [onBrowse, setSearchValue])

  const handleSearch = useCallback(
    ({
      value,
      contractAddresses
    }: {
      value?: string
      contractAddresses?: string[]
    }) => {
      if (value !== undefined && search !== value) {
        onBrowse({
          search: value,
          section: category ? getSectionFromCategory(category) : section
        })
      } else if (contractAddresses && contractAddresses.length) {
        onBrowse({
          contracts: contractAddresses,
          search: ''
        })
        handleClearSearch()
      }
      setShouldRenderSearchDropdown(false)
    },
    [category, handleClearSearch, onBrowse, search, section]
  )

  const handleOrderByDropdownChange = useCallback(
    (_, props: DropdownProps) => {
      const sortBy: SortBy = props.value as SortBy
      if (!onlyOnRent && !onlyOnSale && isLandSection(section)) {
        if (sortBy === SortBy.CHEAPEST_SALE) {
          onBrowse({ onlyOnSale: true, sortBy: SortBy.CHEAPEST })
        } else if (sortBy === SortBy.CHEAPEST_RENT) {
          onBrowse({ onlyOnRent: true, sortBy: SortBy.MAX_RENTAL_PRICE })
        }
      } else {
        onBrowse({ sortBy })
      }
    },
    [onlyOnRent, onlyOnSale, section, onBrowse]
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

  useEffect(() => {
    const option = sortByOptions.find(option => option.value === sortBy)
    if (!option) {
      onBrowse({ sortBy: sortByOptions[0].value })
    }
  }, [onBrowse, sortBy, sortByOptions])

  const sortByValue = sortByOptions.find(option => option.value === sortBy)
    ? sortBy
    : sortByOptions[0].value

  useEffect(() => {
    // when the category changes, close the dropdown
    setShouldRenderSearchDropdown(false)
  }, [category])

  const handleFieldClick = useCallback(() => {
    // opens the dropdown on the field focus
    setShouldRenderSearchDropdown(
      category === NFTCategory.EMOTE || category === NFTCategory.WEARABLE
    )
  }, [category])

  const handleSearchBarDropdownClickOutside = useCallback(event => {
    // when clicking outside the dropdown, close it
    const containsClick = searchBarFieldRef.current?.contains(event.target)
    if (!containsClick) {
      setShouldRenderSearchDropdown(false)
    }
  }, [])

  const renderSearch = useCallback(() => {
    return (
      <SearchBarDropdown
        category={category}
        searchTerm={searchValueForDropdown}
        onSearch={handleSearch}
        onClickOutside={handleSearchBarDropdownClickOutside}
      />
    )
  }, [
    category,
    handleSearch,
    handleSearchBarDropdownClickOutside,
    searchValueForDropdown
  ])

  return (
    <div className={styles.assetTopbar} ref={searchBarFieldRef}>
      <div
        className={classNames(styles.searchContainer, {
          [styles.searchMap]: isMap
        })}
      >
        {!isMap && !isListsSection(section) && (
          <div className={styles.searchFieldContainer}>
            <Field
              className={styles.searchField}
              placeholder={t('nft_filters.search')}
              kind="full"
              value={searchValue}
              onChange={setSearchValue}
              icon={<Icon name="search" className="searchIcon" />}
              iconPosition="left"
              onClick={handleFieldClick}
            />
            {searchValue ? <Close onClick={handleClearSearch} /> : null}
          </div>
        )}
        {shouldRenderSearchDropdown && renderSearch()}
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
      {!isMap && (
        <div className={styles.infoRow}>
          {!isLoading ? (
            isListsSection(section) && !count ? null : (
              <div className={styles.countContainer}>
                <p className={styles.countText}>
                  {count && isCatalogView(view)
                    ? t(
                        search
                          ? 'nft_filters.query_results'
                          : 'nft_filters.results',
                        {
                          count: count.toLocaleString(),
                          search
                        }
                      )
                    : getCountText(count, search)}
                </p>
              </div>
            )
          ) : null}
          {!isListsSection(section) ? (
            <div className={styles.rightOptionsContainer}>
              <Dropdown
                direction="left"
                value={sortByValue}
                options={sortByOptions}
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
          <button className={styles.clearFilters} onClick={onClearFilters}>
            <img src={trash} alt={t('filters.clear')} />
            {t('filters.clear')}
          </button>
        </div>
      ) : null}
    </div>
  )
}
