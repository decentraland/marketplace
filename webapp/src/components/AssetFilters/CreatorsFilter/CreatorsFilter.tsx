import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Loader, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import ProfilesCache from '../../../lib/profiles'
import { Pill } from '../../AssetTopbar/SelectedFilters/Pill/Pill'
import { InfoTooltip } from '../../InfoTooltip'
import { Props } from './CreatorsFilter.types'
import { profileToCreatorAccount } from './utils'
import './CreatorsFilter.css'

export type Creator = {
  name: string
  address: string
}

export const CreatorsFilter = ({
  isLoading,
  creators,
  fetchedCreators,
  defaultCollapsed = false,
  onChange,
  onFetchCreators
}: Props): JSX.Element => {
  const [isFetchingNames, setIsFetchingNames] = useState(false)
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const [searchTerm, setSearchTerm] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedCreators, setSelectedCreators] = useState<Creator[]>(
    creators?.length && fetchedCreators ? fetchedCreators.filter(creator => creators.includes(creator.address)) : []
  )

  useEffect(() => {
    const fetchCreators = async () => {
      if (creators?.length) {
        setIsFetchingNames(true)
        const profiles = await ProfilesCache.fetchProfile(creators)
        setSelectedCreators(profileToCreatorAccount(profiles))
        setIsFetchingNames(false)
      } else if (!creators?.length) {
        setSelectedCreators([])
      }
    }
    void fetchCreators()
  }, [creators])

  const handleCreatorsChange = useCallback(
    (value: string) => {
      const creator = fetchedCreators.find(creator => creator.address === value)
      if (creator && !selectedCreators.find(c => c.address === creator.address)) {
        const newCreators = [...selectedCreators, creator]
        setSelectedCreators(newCreators)
        onChange(newCreators.map(creator => creator.address))
        setShowSuggestions(false)
        setSearchTerm('')
      }
    },
    [fetchedCreators, onChange, selectedCreators]
  )

  const handleFetchTopCreators = useCallback(() => {
    if (!searchTerm && !isLoading) {
      onFetchCreators('')
      setShowSuggestions(true)
    }
  }, [isLoading, onFetchCreators, searchTerm])

  useEffect(() => {
    if (!searchTerm) {
      return
    }
    setShowSuggestions(false)
    const delayedDebounceFn = setTimeout(() => {
      setShowSuggestions(true)
      onFetchCreators(searchTerm)
    }, 500)
    return () => clearTimeout(delayedDebounceFn)
  }, [onFetchCreators, searchTerm])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('nft_filters.creators.title')}</span>
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
        <>
          {t('nft_filters.creators.title')}
          <InfoTooltip content={t('nft_filters.creators.tooltip')} />
        </>
      ),
    [isFetchingNames, isMobileOrTablet, selectedCreators]
  )

  const handleDeleteCreator = useCallback(
    (creatorAddressToDelete: string) => {
      const updatedArray = selectedCreators.filter(creator => creator.address !== creatorAddressToDelete)
      setSelectedCreators(updatedArray)
      onChange(updatedArray.map(creator => creator.address))
    },
    [onChange, selectedCreators]
  )

  const dropdownContainerRef = useRef<HTMLDivElement>(null)

  // tracks the click outside the main div and close suggestions if needed
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownContainerRef.current && !dropdownContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  const clearAndShowSuggestions = useCallback(() => {
    setSearchTerm('')
    onFetchCreators('')
    setShowSuggestions(true)
  }, [onFetchCreators])

  const handleSearchInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      if (!value) {
        clearAndShowSuggestions()
      } else {
        setSearchTerm(value)
      }
    },
    [clearAndShowSuggestions]
  )

  const handleClearSearchInput = useCallback(() => {
    clearAndShowSuggestions()
  }, [clearAndShowSuggestions])

  return (
    <Box header={header} collapsible className="CreatorsFilter filters-sidebar-box" defaultCollapsed={defaultCollapsed || isMobileOrTablet}>
      <div ref={dropdownContainerRef} className="creators-filter-dropdown-container">
        <input
          className="creators-filter-dropdown"
          placeholder={t('nft_filters.creators.search')}
          onFocus={handleFetchTopCreators}
          onChange={handleSearchInputChange}
          value={searchTerm}
        />
        {isLoading ? (
          <Loader active size={'small'} />
        ) : searchTerm ? (
          <i aria-hidden="true" className="search icon clear" onClick={handleClearSearchInput}></i>
        ) : (
          <i aria-hidden="true" className="search icon"></i>
        )}
        {showSuggestions && !isLoading ? (
          <div className="menu">
            {!searchTerm ? <div className="header">{t('nft_filters.creators.dropdown_header')} </div> : null}
            {searchTerm && !fetchedCreators.length ? <div className="item no-results">{t('filters.no_results')}</div> : null}
            {fetchedCreators.map(creator => (
              <div key={creator.address} className="item" onClick={() => handleCreatorsChange(creator.address)}>
                {creator.name}
              </div>
            ))}
          </div>
        ) : null}
      </div>
      <div className="pill-container">
        {selectedCreators.map(creator => (
          <Pill id={creator.address} key={creator.address} label={creator.name} onDelete={() => handleDeleteCreator(creator.address)} />
        ))}
      </div>
    </Box>
  )
}
