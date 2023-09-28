import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Close, Icon, Tabs } from 'decentraland-ui'
import { Item, NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import clock from '../../../images/clock.png'
import { catalogAPI } from '../../../modules/vendor/decentraland/catalog/api'
import { BuilderCollectionAttributes } from '../../../modules/vendor/decentraland/builder/types'
import { CreatorAccount } from '../../../modules/account/types'
import { builderAPI } from '../../../modules/vendor/decentraland/builder/api'
import SearchBarDropdownOptionSkeleton from './SearchBarDropdownOptionSkeleton/SearchBarDropdownOptionSkeleton'
import { SearchBarDropdownProps, SearchTab } from './SearchBarDropdown.types'
import CreatorsResultItemRow from './CreatorResultRow/CreatorResultRow'
import CollectionResultRow from './CollectionResultRow/CollectionResultRow'
import CollectibleResultItemRow from './CollectibleResultItemRow/CollectibleResultItemRow'
import styles from './SearchBarDropdown.module.css'

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

const LOCAL_STORAGE_RECENT_SEARCHES_KEY = 'marketplace_recent_searches'
const MAX_AMOUNT_OF_RESULTS = 10

export const SearchBarDropdown = ({
  searchTerm,
  category,
  onSearch,
  fetchedCreators,
  isLoadingCreators,
  onFetchCreators,
  onClickOutside
}: SearchBarDropdownProps) => {
  const isSearchingWearables = category === NFTCategory.WEARABLE
  const isSearchingEmotes = category === NFTCategory.EMOTE

  const dropdownContainerRef = useRef<HTMLDivElement>(null)
  const [results, setResults] = useState<Results>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentSearchTab, setCurrentSearchTab] = useState<SearchTab>(
    category === NFTCategory.WEARABLE ? SearchTab.WEARABLES : SearchTab.EMOTES
  )
  const [recentSearches, setRecentSearchs] = useState<RecentSearch[]>(
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
        setRecentSearchs(withNewSelection)
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
      setRecentSearchs(newRecentSearches)
    },
    [recentSearches]
  )

  const handleSeeAll = useCallback(() => {
    if (
      currentSearchTab === SearchTab.EMOTES ||
      currentSearchTab === SearchTab.WEARABLES
    ) {
      onSearch({ value: searchTerm })
    } else if (currentSearchTab === SearchTab.COLLECTIONS) {
      const contractAddresses = (results as BuilderCollectionAttributes[]).map(
        collection => collection.contract_address
      )
      onSearch({ contractAddresses, value: '' })
    }
  }, [currentSearchTab, onSearch, results, searchTerm])

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
            }
          })
          .finally(() => !cancel && setIsLoading(false))
          .catch(error => {
            console.error(error)
          })
        // }
      } else if (currentSearchTab === SearchTab.CREATORS) {
        onFetchCreators(searchTerm)
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

  const renderCollectiblesSearch = useCallback(() => {
    return (
      <>
        {(results as Item[]).map(item => (
          <CollectibleResultItemRow
            key={item.id}
            item={item}
            onClick={handleSaveToLocalStorage}
          />
        ))}
        <Button
          className={styles.seeAllButton}
          inverted
          fluid
          onClick={handleSeeAll}
        >
          <Icon name="search" className="searchIcon" />
          {t('search_dropdown.see_all_wearables')}
        </Button>
      </>
    )
  }, [handleSaveToLocalStorage, handleSeeAll, results])

  const renderCreatorsSearch = useCallback(() => {
    return (
      <>
        {fetchedCreators.map(creator => (
          <CreatorsResultItemRow
            key={creator.address}
            creator={creator}
            onClick={handleSaveToLocalStorage}
          />
        ))}
        {fetchedCreators.length === 0 && !isLoadingCreators ? (
          <span className={styles.searchEmpty}>
            {t('search_dropdown.no_results')}
          </span>
        ) : null}
      </>
    )
  }, [fetchedCreators, handleSaveToLocalStorage, isLoadingCreators])

  const renderCollectionsSearch = useCallback(() => {
    return (
      <>
        {(results as BuilderCollectionAttributes[]).map(collection => (
          <CollectionResultRow
            key={collection.contract_address}
            collection={collection}
            onClick={contractAddress => {
              onSearch({ contractAddresses: [contractAddress] })
              handleSaveToLocalStorage(collection)
            }}
          />
        ))}
        {results.length === 0 && !isLoadingCreators ? (
          <span className={styles.searchEmpty}>
            {t('search_dropdown.no_results')}
          </span>
        ) : null}
      </>
    )
  }, [handleSaveToLocalStorage, isLoadingCreators, onSearch, results])

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
        <div className={styles.recentSearchesContainer}>
          <div className={styles.recentSearchesTitle}>
            {t('search_dropdown.recent')}
          </div>
          {recentSearches.map((recentSearch, index) => (
            <div className={styles.recentSearchContainer} key={index}>
              {isCollectionRecentSearch(recentSearch) ? (
                <>
                  <img src={clock} alt="clock" className={styles.recentIcon} />
                  <CollectionResultRow
                    key={recentSearch.contract_address}
                    collection={recentSearch}
                    onClick={contractAddress =>
                      onSearch({ contractAddresses: [contractAddress] })
                    }
                  />
                </>
              ) : isCreatorRecentSearch(recentSearch) ? (
                <>
                  <img src={clock} alt="clock" className={styles.recentIcon} />
                  <CreatorsResultItemRow
                    key={recentSearch.address}
                    creator={recentSearch}
                    onClick={handleSaveToLocalStorage}
                  />
                </>
              ) : isItemRecentSearch(recentSearch) ? (
                <>
                  <img src={clock} alt="clock" className={styles.recentIcon} />
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
    <div className={styles.searchBarDropdown} ref={dropdownContainerRef}>
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
