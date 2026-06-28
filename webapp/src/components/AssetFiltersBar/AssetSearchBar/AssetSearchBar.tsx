import { useCallback, useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Close, Field, Icon } from 'decentraland-ui'
import { browse } from '../../../modules/routing/actions'
import { useGetBrowseOptions } from '../../../modules/routing/hooks'
import { getCategoryFromSection, getSectionFromCategory } from '../../../modules/routing/search'
import { getView } from '../../../modules/ui/browse/selectors'
import { View } from '../../../modules/ui/types'
import { SearchBarDropdown } from '../../AssetTopbar/SearchBarDropdown'
import './AssetSearchBar.css'

export type AssetSearchBarProps = {
  placeholder?: string
}

// Self-connected search field with the suggestions dropdown (collections /
// creators / items). Mirrors the search behaviour from AssetTopbar so it can
// live on the right of the horizontal filters bar.
export const AssetSearchBar = ({ placeholder }: AssetSearchBarProps) => {
  const dispatch = useDispatch()
  const browseOptions = useGetBrowseOptions()
  const view = useSelector(getView)
  const search = browseOptions.search || ''
  const section = browseOptions.section
  const category = section ? getCategoryFromSection(section) : undefined

  const onBrowse = useCallback((options: Parameters<typeof browse>[0]) => dispatch(browse(options)), [dispatch])

  const fieldRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [searchValue, setSearchValue] = useState(search)
  const [searchValueForDropdown, setSearchValueForDropdown] = useState(search)
  const [shouldRenderDropdown, setShouldRenderDropdown] = useState(false)

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    []
  )

  const handleInputChange = useCallback(
    (text: string) => {
      if (!shouldRenderDropdown && text) setShouldRenderDropdown(true)
      if (!text && text !== search) {
        onBrowse({ search: '' })
      }
      if (shouldRenderDropdown) {
        setSearchValueForDropdown(text)
      } else if (text && text !== search) {
        onBrowse({ search: text, section: category ? getSectionFromCategory(category) : section })
      }
    },
    [category, onBrowse, search, section, shouldRenderDropdown]
  )

  const handleDebouncedChange = useCallback(
    (text: string) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      setSearchValue(text)
      timeoutRef.current = setTimeout(() => handleInputChange(text), 500)
    },
    [handleInputChange]
  )

  const handleClearSearch = useCallback(() => {
    setSearchValue('')
    setSearchValueForDropdown('')
    onBrowse({ search: '' })
  }, [onBrowse])

  const handleSearch = useCallback(
    ({ value, contractAddresses }: { value?: string; contractAddresses?: string[] }) => {
      if (contractAddresses && contractAddresses.length) {
        onBrowse({ contracts: contractAddresses, search: '' })
        handleClearSearch()
      } else if (search !== value) {
        onBrowse({ search: value, section: category ? getSectionFromCategory(category) : section })
      }
      setShouldRenderDropdown(false)
    },
    [category, handleClearSearch, onBrowse, search, section]
  )

  const handleFieldClick = useCallback(() => {
    setShouldRenderDropdown(
      (category === NFTCategory.EMOTE || category === NFTCategory.WEARABLE) && view !== View.CURRENT_ACCOUNT && view !== View.ACCOUNT
    )
  }, [category, view])

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (!fieldRef.current?.contains(event.target as Node | null)) {
      setShouldRenderDropdown(false)
    }
  }, [])

  return (
    <div className="AssetSearchBar" ref={fieldRef}>
      <Field
        className="AssetSearchBar__field"
        placeholder={placeholder ?? t('nft_filters.search')}
        kind="full"
        value={searchValue}
        onChange={(_e, data) => handleDebouncedChange(data.value)}
        icon={<Icon name="search" className="searchIcon" />}
        iconPosition="left"
        onClick={handleFieldClick}
      />
      {searchValue ? <Close onClick={handleClearSearch} /> : null}
      {shouldRenderDropdown ? (
        <SearchBarDropdown
          category={category}
          searchTerm={searchValueForDropdown}
          onSearch={handleSearch}
          onClickOutside={handleClickOutside}
        />
      ) : null}
    </div>
  )
}

export default AssetSearchBar
