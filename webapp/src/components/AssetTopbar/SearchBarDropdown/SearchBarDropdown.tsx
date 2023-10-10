import { useCallback, useEffect, useRef, useState } from 'react'
import { v5 as uuidv5 } from 'uuid'
import { Button, Close, Icon } from 'decentraland-ui'
import { Tabs } from 'decentraland-ui/dist'
import { Item, NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import * as events from '../../../utils/events'
import clock from '../../../images/clock.png'
import { catalogAPI } from '../../../modules/vendor/decentraland/catalog/api'
import { BuilderCollectionAttributes } from '../../../modules/vendor/decentraland/builder/types'
import { CreatorAccount } from '../../../modules/account/types'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import SearchBarDropdownOptionSkeleton from './SearchBarDropdownOptionSkeleton/SearchBarDropdownOptionSkeleton'
import { SearchBarDropdownProps, SearchTab } from './SearchBarDropdown.types'
import CreatorResultItemRow from './CreatorResultRow/CreatorResultRow'
import CollectionResultRow from './CollectionResultRow/CollectionResultRow'
import CollectibleResultItemRow from './CollectibleResultItemRow/CollectibleResultItemRow'
import styles from './SearchBarDropdown.module.css'
import {
  COLLECTIBLE_DATA_TEST_ID,
  COLLECTION_ROW_DATA_TEST_ID,
  NO_RESULTS_DATA_TEST_ID,
  RECENT_SEARCHES_DATA_TEST_ID,
  SEE_ALL_COLLECTIBLES_DATA_TEST_ID
} from './constants'

type Results = Item[] | BuilderCollectionAttributes[]
type RecentSearch = CreatorAccount | BuilderCollectionAttributes | Item

function isCreatorRecentSearch(search: RecentSearch): search is CreatorAccount {
  return 'collections' in search
}

function isCollectionRecentSearch(
  search: RecentSearch
): search is BuilderCollectionAttributes {
  return 'contract_address' in search
}

function isItemRecentSearch(search: RecentSearch): search is Item {
  return 'itemId' in search
}

export const LOCAL_STORAGE_RECENT_SEARCHES_KEY = 'marketplace_recent_searches'
const MAX_AMOUNT_OF_RESULTS = 5
const MAX_RECENT_RESULTS = 10

// Defines a custom random namespace to create UUIDs
const UUID_NAMESPACE = '1b671a64-40d5-491e-99b0-da01ff1f3341'

export const SearchBarDropdown = ({
  searchTerm,
  category,
  onSearch,
  fetchedCreators,
  isLoadingCreators,
  onFetchCreators,
  onClickOutside
}: SearchBarDropdownProps) => {
  const [searchUUID, setSearchUUID] = useState(
    uuidv5(searchTerm, UUID_NAMESPACE)
  )

  // assigns a UUID to the search term to link the events of rendering the results with the search term selected
  useEffect(() => {
    setSearchUUID(uuidv5(searchTerm, UUID_NAMESPACE))
  }, [searchTerm])

  const isSearchingWearables = category === NFTCategory.WEARABLE
  const isSearchingEmotes = category === NFTCategory.EMOTE

  const dropdownContainerRef = useRef<HTMLDivElement>(null)
  const [results, setResults] = useState<Results>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSearchTab, setCurrentSearchTab] = useState<SearchTab>(
    category === NFTCategory.WEARABLE ? SearchTab.WEARABLES : SearchTab.EMOTES
  )
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>(
    JSON.parse(localStorage.getItem(LOCAL_STORAGE_RECENT_SEARCHES_KEY) || '[]')
  )

  const handleSaveToLocalStorage = useCallback(
    (selection: RecentSearch) => {
      if (
        !recentSearches.some(
          recentSearch =>
            JSON.stringify(recentSearch) === JSON.stringify(selection)
        )
      ) {
        const withNewSelection = [...recentSearches, selection]
        localStorage.setItem(
          LOCAL_STORAGE_RECENT_SEARCHES_KEY,
          JSON.stringify(withNewSelection)
        )
        setRecentSearches(withNewSelection)
      }
    },
    [recentSearches]
  )

  const handleRemoveRecentSearch = useCallback(
    (item: RecentSearch) => {
      const newRecentSearches = recentSearches.filter(
        recentSearch => recentSearch !== item
      )
      localStorage.setItem(
        LOCAL_STORAGE_RECENT_SEARCHES_KEY,
        JSON.stringify(newRecentSearches)
      )
      setRecentSearches(newRecentSearches)
    },
    [recentSearches]
  )

  const handleSeeAll = useCallback(() => {
    if (!searchTerm) {
      return
    }
    if (
      currentSearchTab === SearchTab.EMOTES ||
      currentSearchTab === SearchTab.WEARABLES
    ) {
      onSearch({ value: searchTerm })
      getAnalytics().track(events.SEARCH_ALL, {
        tab: currentSearchTab,
        searchTerm,
        searchUUID
      })
    } else if (currentSearchTab === SearchTab.COLLECTIONS) {
      const contractAddresses = (results as BuilderCollectionAttributes[]).map(
        collection => collection.contract_address
      )
      onSearch({ contractAddresses, value: '' })
      getAnalytics().track(events.SEARCH_ALL, {
        tab: currentSearchTab,
        searchTerm
      })
    }
  }, [currentSearchTab, onSearch, results, searchTerm, searchUUID])

  // handle the enter key press and trigger the See all feature
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleSeeAll()
      }
    }

    // Attach the event listener to the document
    document.addEventListener('keydown', handleKeyDown)

    // Cleanup: remove the event listener when the component is unmounted
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSeeAll])

  useEffect(() => {
    let cancel = false
    if (searchTerm) {
      if (
        currentSearchTab === SearchTab.EMOTES ||
        currentSearchTab === SearchTab.WEARABLES
      ) {
        setIsLoading(true)
        catalogAPI
          .get({
            search: searchTerm,
            category: category,
            first: MAX_AMOUNT_OF_RESULTS
          })
          .then(response => {
            if (!cancel) {
              setResults(response.data)
              getAnalytics().track(events.SEARCH_RESULT, {
                tab: currentSearchTab,
                searchTerm,
                searchUUID,
                items: response.data.map(item => item.id)
              })
            }
          })
          .finally(() => {
            if (!cancel) {
              setIsLoading(false)
            }
          })
          .catch(error => {
            console.error(error)
          })
      } else if (currentSearchTab === SearchTab.CREATORS) {
        onFetchCreators(searchTerm, searchUUID)
      } else {
        setIsLoading(true)
        builderAPI
          .fetchPublishedCollectionsBySearchTerm({
            searchTerm,
            limit: MAX_AMOUNT_OF_RESULTS
          })
          .then(response => {
            if (!cancel) {
              setResults(response)
            }
            getAnalytics().track(events.SEARCH_RESULT, {
              tab: currentSearchTab,
              searchTerm,
              searchUUID,
              collections: response.map(
                collection => collection.contract_address
              )
            })
          })
          .finally(() => !cancel && setIsLoading(false))
          .catch(error => {
            console.error(error)
          })
      }
      return () => {
        cancel = true
      }
    }
  }, [
    category,
    currentSearchTab,
    searchTerm,
    isSearchingEmotes,
    isSearchingWearables,
    searchUUID,
    onFetchCreators
  ])

  // tracks the click outside the main div and close suggestions if needed
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContainerRef.current &&
        !dropdownContainerRef.current.contains(event.target as Node)
      ) {
        onClickOutside(event)
      }
    }
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [onClickOutside])

  const onCollectibleResultClick = useCallback(
    (collectible, index) => {
      handleSaveToLocalStorage(collectible)
      getAnalytics().track(events.SEARCH_RESULT_CLICKED, {
        searchTerm,
        item_id: collectible.id,
        search_uuid: searchUUID,
        item_position: index
      })
    },
    [handleSaveToLocalStorage, searchTerm, searchUUID]
  )

  const renderCollectiblesSearch = useCallback(() => {
    return (
      <>
        {results.length ? (
          <>
            {(results as Item[]).map((item, index) => (
              <CollectibleResultItemRow
                data-testid={`${COLLECTIBLE_DATA_TEST_ID}-${item.name}`}
                key={item.id}
                item={item}
                onClick={collectible =>
                  onCollectibleResultClick(collectible, index)
                }
              />
            ))}
            <Button
              className={styles.seeAllButton}
              inverted
              fluid
              onClick={handleSeeAll}
              data-testid={SEE_ALL_COLLECTIBLES_DATA_TEST_ID}
            >
              <Icon name="search" className="searchIcon" />
              {isSearchingEmotes
                ? t('search_dropdown.see_all_emotes')
                : t('search_dropdown.see_all_wearables')}
            </Button>
          </>
        ) : !isLoading ? (
          <span
            className={styles.searchEmpty}
            data-testid={NO_RESULTS_DATA_TEST_ID}
          >
            {t('search_dropdown.no_results')}
          </span>
        ) : null}
      </>
    )
  }, [
    handleSeeAll,
    isLoading,
    isSearchingEmotes,
    onCollectibleResultClick,
    results
  ])

  const onCreatorsResultClick = useCallback(
    (creator, index) => {
      handleSaveToLocalStorage(creator)
      getAnalytics().track(events.SEARCH_RESULT_CLICKED, {
        searchTerm,
        wallet_id: creator.address,
        search_uuid: searchUUID,
        item_position: index
      })
    },
    [handleSaveToLocalStorage, searchTerm, searchUUID]
  )

  const renderCreatorsSearch = useCallback(() => {
    return (
      <>
        {fetchedCreators
          .slice(0, MAX_AMOUNT_OF_RESULTS)
          .map((creator, index) => (
            <CreatorResultItemRow
              key={creator.address}
              creator={creator}
              onClick={creator => onCreatorsResultClick(creator, index)}
            />
          ))}
        {fetchedCreators.length === 0 && !isLoadingCreators ? (
          <span className={styles.searchEmpty}>
            {t('search_dropdown.no_results')}
          </span>
        ) : null}
      </>
    )
  }, [fetchedCreators, isLoadingCreators, onCreatorsResultClick])

  const onCollectionResultClick = useCallback(
    (collection, index) => {
      onSearch({ contractAddresses: [collection.contract_address] })
      handleSaveToLocalStorage(collection)
      getAnalytics().track(events.SEARCH_RESULT_CLICKED, {
        searchTerm,
        collection_id: collection.contract_address,
        search_uuid: searchUUID,
        item_position: index
      })
    },
    [handleSaveToLocalStorage, onSearch, searchTerm, searchUUID]
  )

  const renderCollectionsSearch = useCallback(() => {
    return (
      <>
        {(results as BuilderCollectionAttributes[]).map((collection, index) => (
          <CollectionResultRow
            key={collection.contract_address}
            collection={collection}
            onClick={() => onCollectionResultClick(collection, index)}
            data-testid={`${COLLECTION_ROW_DATA_TEST_ID}-${collection.name}`}
          />
        ))}
        {results.length === 0 && !isLoadingCreators ? (
          <span className={styles.searchEmpty}>
            {t('search_dropdown.no_results')}
          </span>
        ) : null}
      </>
    )
  }, [isLoadingCreators, onCollectionResultClick, results])

  const renderLoading = useCallback(() => {
    switch (currentSearchTab) {
      case SearchTab.COLLECTIONS:
      case SearchTab.WEARABLES:
      case SearchTab.EMOTES:
        return [...Array(5).keys()].map(index => (
          <SearchBarDropdownOptionSkeleton key={index} />
        ))

      default:
        return [...Array(5).keys()].map(index => (
          <SearchBarDropdownOptionSkeleton
            key={index}
            lines={1}
            shape="circle"
          />
        ))
    }
  }, [currentSearchTab])

  const renderRecentContent = useCallback(() => {
    if (recentSearches.length) {
      return (
        <div
          className={styles.recentSearchesContainer}
          data-testid={RECENT_SEARCHES_DATA_TEST_ID}
        >
          <div className={styles.recentSearchesTitle}>
            {t('search_dropdown.recent')}
          </div>
          {[...recentSearches]
            .reverse()
            .slice(0, MAX_RECENT_RESULTS)
            .map((recentSearch, index) => (
              <div className={styles.recentSearchContainer} key={index}>
                {isCollectionRecentSearch(recentSearch) ? (
                  <>
                    <img
                      src={clock}
                      alt="clock"
                      className={styles.recentIcon}
                    />
                    <CollectionResultRow
                      key={recentSearch.contract_address}
                      collection={recentSearch}
                      onClick={() =>
                        onSearch({
                          contractAddresses: [recentSearch.contract_address]
                        })
                      }
                    />
                  </>
                ) : isCreatorRecentSearch(recentSearch) ? (
                  <>
                    <img
                      src={clock}
                      alt="clock"
                      className={styles.recentIcon}
                    />
                    <CreatorResultItemRow
                      key={recentSearch.address}
                      creator={recentSearch}
                      onClick={handleSaveToLocalStorage}
                    />
                  </>
                ) : isItemRecentSearch(recentSearch) ? (
                  <>
                    <img
                      src={clock}
                      alt="clock"
                      className={styles.recentIcon}
                    />
                    <CollectibleResultItemRow
                      item={recentSearch}
                      onClick={handleSaveToLocalStorage}
                    />
                  </>
                ) : null}
                <Close onClick={() => handleRemoveRecentSearch(recentSearch)} />
              </div>
            ))}
        </div>
      )
    }
  }, [
    handleRemoveRecentSearch,
    handleSaveToLocalStorage,
    onSearch,
    recentSearches
  ])

  const renderContent = useCallback(() => {
    if (isLoading || isLoadingCreators) {
      return renderLoading()
    }
    switch (currentSearchTab) {
      case SearchTab.WEARABLES:
      case SearchTab.EMOTES:
        return renderCollectiblesSearch()
      case SearchTab.COLLECTIONS:
        return renderCollectionsSearch()
      case SearchTab.CREATORS:
        return renderCreatorsSearch()
    }
  }, [
    currentSearchTab,
    isLoading,
    isLoadingCreators,
    renderCollectiblesSearch,
    renderCollectionsSearch,
    renderCreatorsSearch,
    renderLoading
  ])

  const handleTabChange = useCallback(
    (newTab: SearchTab) => {
      setResults([])
      setCurrentSearchTab(newTab)
      setIsLoading(false)
    },
    [setCurrentSearchTab]
  )

  const renderTabs = useCallback(() => {
    return (
      <div className={styles.tabsContainer}>
        <Tabs>
          <Tabs.Tab
            active={
              isSearchingWearables
                ? currentSearchTab === SearchTab.WEARABLES
                : currentSearchTab === SearchTab.EMOTES
            }
            onClick={() =>
              handleTabChange(
                isSearchingWearables ? SearchTab.WEARABLES : SearchTab.EMOTES
              )
            }
          >
            {isSearchingWearables ? t('menu.wearables') : t('menu.emotes')}
          </Tabs.Tab>
          <Tabs.Tab
            active={currentSearchTab === SearchTab.CREATORS}
            onClick={() => handleTabChange(SearchTab.CREATORS)}
          >
            {t('search_dropdown.creators')}
          </Tabs.Tab>
          <Tabs.Tab
            active={currentSearchTab === SearchTab.COLLECTIONS}
            onClick={() => handleTabChange(SearchTab.COLLECTIONS)}
          >
            {t('search_dropdown.collections')}
          </Tabs.Tab>
        </Tabs>
      </div>
    )
  }, [currentSearchTab, handleTabChange, isSearchingWearables])

  return recentSearches.length || searchTerm ? (
    <div
      className={styles.searchBarDropdown}
      ref={dropdownContainerRef}
      data-testid="search-bar-dropdown"
    >
      {searchTerm ? (
        <>
          {renderTabs()}
          {renderContent()}
        </>
      ) : (
        renderRecentContent()
      )}
    </div>
  ) : null
}
