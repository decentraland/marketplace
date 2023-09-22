import { useCallback, useEffect, useState } from 'react'
import { Button, Icon, Loader, Tabs } from 'decentraland-ui'
import { Item, NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { catalogAPI } from '../../../modules/vendor/decentraland/catalog/api'
import CollectibleResultItemRow from './CollectibleResultItemRow/CollectibleResultItemRow'
import styles from './SearchBarDropdown.module.css'

type SearchBarDropdownProps = {
  searchTerm: string
  category: NFTCategory | undefined
  onSearch: (value: string) => void
}

export enum SearchTab {
  WEARABLES = 'wearables',
  EMOTES = 'emotes',
  CREATORS = 'creators',
  COLLECTIONS = 'collections'
}

type Results = Item[]

export const SearchBarDropdown = ({
  searchTerm,
  category,
  onSearch
}: SearchBarDropdownProps) => {
  console.log('searchTerm: ', searchTerm)
  const [isLoading, setIsLoading] = useState(false)
  const isSearchingWearables = category === NFTCategory.WEARABLE
  const isSearchingEmotes = category === NFTCategory.EMOTE
  const [currentSearchTab, setCurrentSearchTab] = useState<SearchTab>(
    category === NFTCategory.WEARABLE ? SearchTab.WEARABLES : SearchTab.EMOTES
  )
  const [results, setResults] = useState<Results>([])

  const handleOnChangeItemSection = useCallback(newTab => {
    setCurrentSearchTab(newTab)
  }, [])

  const handleSeeAll = useCallback(() => {
    onSearch(searchTerm)
  }, [onSearch, searchTerm])

  useEffect(() => {
    console.log('useEffect')
    let cancel = false
    console.log('searchTerm: ', searchTerm)
    if (searchTerm) {
      console.log('isSearchingWearables: ', isSearchingWearables)
      console.log('isSearchingEmotes: ', isSearchingEmotes)
      if (isSearchingWearables || isSearchingEmotes) {
        setIsLoading(true)
        catalogAPI
          .get({ search: searchTerm, category: category, first: 10 })
          .then(response => {
            console.log('response: ', response)
            if (!cancel) {
              setResults(response.data)
            }
          })
          .finally(() => !cancel && setIsLoading(false))
          .catch(error => {
            console.error(error)
          })
      }
    }
  }, [category, isSearchingEmotes, isSearchingWearables, searchTerm])

  const renderCollectiblesSearch = useCallback(() => {
    return (
      <>
        {results.map(result => (
          <CollectibleResultItemRow item={result} />
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
  }, [handleSeeAll, results])

  const renderCollectionsSearch = useCallback(() => {
    return <div> Looking for collections...</div>
  }, [])

  const renderCreatorsSearch = useCallback(() => {
    return <div> Looking for creators...</div>
  }, [])

  const renderContent = useCallback(() => {
    if (!searchTerm) return <div> Show recent searchs </div>
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
    renderCollectiblesSearch,
    renderCollectionsSearch,
    renderCreatorsSearch,
    searchTerm
  ])

  return (
    <div className={styles.searchBarDropdown}>
      <div className={styles.tabsContainer}>
        <Tabs>
          <Tabs.Tab
            active={
              isSearchingWearables
                ? currentSearchTab === SearchTab.WEARABLES
                : currentSearchTab === SearchTab.EMOTES
            }
            onClick={() =>
              setCurrentSearchTab(
                isSearchingWearables ? SearchTab.WEARABLES : SearchTab.EMOTES
              )
            }
          >
            {isSearchingWearables ? t('menu.wearables') : t('menu.emotes')}
          </Tabs.Tab>
          <Tabs.Tab
            active={currentSearchTab === SearchTab.CREATORS}
            onClick={() => setCurrentSearchTab(SearchTab.CREATORS)}
          >
            {t('search_dropdown.creators')}
          </Tabs.Tab>
          <Tabs.Tab
            active={currentSearchTab === SearchTab.COLLECTIONS}
            onClick={() => setCurrentSearchTab(SearchTab.COLLECTIONS)}
          >
            {t('search_dropdown.collections')}
          </Tabs.Tab>
        </Tabs>
      </div>
      {isLoading ? <Loader active /> : renderContent()}
    </div>
  )
}
