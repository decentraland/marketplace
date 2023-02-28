import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import classNames from 'classnames'
import {
  Box,
  Dropdown,
  Icon,
  Loader,
  useTabletAndBelowMediaQuery
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Pill } from '../../AssetTopbar/SelectedFilters/Pill/Pill'
import { Props } from './CreatorsFilter.types'
import { getCreatorsByAddress } from './utils'
import './CreatorsFilter.css'

type Creator = {
  name: string
  address: string
}

export const CreatorsFilter = ({
  creators,
  fetchedCreators,
  onChange,
  isLoading,
  defaultCollapsed = false,
  onFetchCreators
}: Props): JSX.Element => {
  const [isFetchingNames, setIsFetchingNames] = useState(false)
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCreators, setSelectedCreators] = useState<Creator[]>(
    creators?.length && fetchedCreators
      ? fetchedCreators.filter(creator => creators.includes(creator.address))
      : []
  )

  useEffect(() => {
    if (creators?.length) {
      setIsFetchingNames(true)
      getCreatorsByAddress(creators).then(creators => {
        setSelectedCreators(creators)
        setIsFetchingNames(false)
      })
    } else if (!creators?.length) {
      setSelectedCreators([])
    }
  }, [creators])

  const handleCreatorsChange = useCallback(
    (value: string) => {
      const creator = fetchedCreators.find(creator => creator.address === value)
      if (creator) {
        const newCreators = [...selectedCreators, creator]
        setSelectedCreators(newCreators)
        onChange(newCreators.map(creator => creator.address))
      }
    },
    [fetchedCreators, onChange, selectedCreators]
  )

  const handleFetchTopCreators = useCallback(() => {
    if (!searchTerm && !isLoading) {
      onFetchCreators('')
    }
  }, [isLoading, onFetchCreators, searchTerm])

  useEffect(() => {
    if (!searchTerm) {
      return
    }
    const delayedDebounceFn = setTimeout(() => {
      onFetchCreators(searchTerm)
    }, 500)
    return () => clearTimeout(delayedDebounceFn)
  }, [onFetchCreators, searchTerm])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">
            {t('nft_filters.creators.title')}
          </span>
          <span className="box-filter-value">
            {isFetchingNames ? (
              <Loader inline size="mini" />
            ) : selectedCreators.length ? (
              selectedCreators.map(creator => creator.name).join(', ')
            ) : (
              t('nft_filters.creators.all_creators')
            )}
          </span>
        </div>
      ) : (
        t('nft_filters.creators.title')
      ),
    [isFetchingNames, isMobileOrTablet, selectedCreators]
  )

  const handleDeleteCreator = useCallback(
    (creatorAddressToDelete: string) => {
      const updatedArray = selectedCreators.filter(
        creator => creator.address !== creatorAddressToDelete
      )
      setSelectedCreators(updatedArray)
      onChange(updatedArray.map(creator => creator.address))
    },
    [onChange, selectedCreators]
  )

  const dropdownOptions = useMemo(
    () =>
      fetchedCreators.map(creator => ({
        text: creator.name,
        value: creator.address
      })),
    [fetchedCreators]
  )

  const dropdownRef = useRef(null)
  const onDropdownChange = useCallback(
    (_event, data) => {
      handleCreatorsChange(data.value as string)
      if (searchTerm && !data.value) {
        setSearchTerm('')
        if (dropdownRef.current) {
          // typing as any since the type of the Legacy ref component is not exposed by the lib
          ;(dropdownRef.current as any).clearSearchQuery?.()
        }
      }
    },
    [handleCreatorsChange, searchTerm]
  )

  return (
    <Box
      header={header}
      collapsible
      className="CreatorsFilter filters-sidebar-box"
      defaultCollapsed={defaultCollapsed || isMobileOrTablet}
    >
      <Dropdown
        className="creators-filter-dropdown"
        placeholder={t('nft_filters.creators.search')}
        loading={isLoading}
        value={searchTerm}
        options={dropdownOptions}
        selectOnNavigation={false}
        selectOnBlur={false}
        clearable
        selection
        search
        fluid
        noResultsMessage={
          fetchedCreators.length > 0 && !isLoading
            ? t('filters.no_results')
            : t('nft_filters.creators.type_to_search')
        }
        onFocus={handleFetchTopCreators}
        onChange={onDropdownChange}
        onSearchChange={(_event, data) => {
          setSearchTerm(data.searchQuery)
        }}
        ref={dropdownRef}
        icon={
          <Icon
            name="search"
            className={classNames(isLoading && 'search-loading')}
          />
        }
      />
      <div className="pill-container">
        {selectedCreators.map(creator => (
          <Pill
            id={creator.address}
            key={creator.address}
            label={creator.name}
            onDelete={() => handleDeleteCreator(creator.address)}
          />
        ))}
      </div>
    </Box>
  )
}
