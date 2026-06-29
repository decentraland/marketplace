import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Dropdown, DropdownProps } from 'decentraland-ui'
import { browse } from '../../modules/routing/actions'
import { useGetBrowseOptions, useGetSortByOptionsFromCurrentUrl } from '../../modules/routing/hooks'
import { getCategoryFromSection, getMarketAssetTypeFromCategory } from '../../modules/routing/search'
import { BrowseOptions, SortBy } from '../../modules/routing/types'
import { Section } from '../../modules/vendor/decentraland/routing/types'
import { AssetStatusFilter } from '../../utils/filters'
import PriceFilter from '../AssetFilters/PriceFilter'
import { StatusFilter } from '../AssetFilters/StatusFilter'
import { AssetSearchBar } from './AssetSearchBar/AssetSearchBar'
import { FilterPopover } from './FilterPopover/FilterPopover'
import { RarityDropdown } from './RarityDropdown/RarityDropdown'
import { SectionDropdown, SectionItem } from './SectionDropdown/SectionDropdown'
import './AssetFiltersBar.css'

// Wearables: grouped so "Head" and "Accessories" open a flyout with their parts.
const WEARABLE_ITEMS: SectionItem[] = [
  {
    type: 'group',
    section: Section.WEARABLES_HEAD,
    children: [
      Section.WEARABLES_EYEBROWS,
      Section.WEARABLES_EYES,
      Section.WEARABLES_FACIAL_HAIR,
      Section.WEARABLES_HAIR,
      Section.WEARABLES_MOUTH
    ]
  },
  { type: 'leaf', section: Section.WEARABLES_UPPER_BODY },
  { type: 'leaf', section: Section.WEARABLES_HANDS },
  { type: 'leaf', section: Section.WEARABLES_LOWER_BODY },
  { type: 'leaf', section: Section.WEARABLES_FEET },
  {
    type: 'group',
    section: Section.WEARABLES_ACCESSORIES,
    children: [
      Section.WEARABLES_EARRING,
      Section.WEARABLES_EYEWEAR,
      Section.WEARABLES_HAT,
      Section.WEARABLES_HELMET,
      Section.WEARABLES_MASK,
      Section.WEARABLES_TIARA,
      Section.WEARABLES_TOP_HEAD
    ]
  },
  { type: 'leaf', section: Section.WEARABLES_SKIN }
]

const EMOTE_ITEMS: SectionItem[] = [
  { type: 'leaf', section: Section.EMOTES_DANCE },
  { type: 'leaf', section: Section.EMOTES_POSES },
  { type: 'leaf', section: Section.EMOTES_FUN },
  { type: 'leaf', section: Section.EMOTES_GREETINGS },
  { type: 'leaf', section: Section.EMOTES_HORROR },
  { type: 'leaf', section: Section.EMOTES_MISCELLANEOUS },
  { type: 'leaf', section: Section.EMOTES_STUNT },
  { type: 'leaf', section: Section.EMOTES_REACTIONS }
]

export type AssetFiltersBarProps = {
  section?: Section
  sections: Section[]
}

export const AssetFiltersBar = ({ section }: AssetFiltersBarProps) => {
  const dispatch = useDispatch()
  const browseOptions = useGetBrowseOptions()
  const sortByOptions = useGetSortByOptionsFromCurrentUrl()
  const rarities = browseOptions.rarities ?? []
  const status = browseOptions.status as AssetStatusFilter | undefined
  const minPrice = browseOptions.minPrice ?? ''
  const maxPrice = browseOptions.maxPrice ?? ''
  const onlySmart = browseOptions.onlySmart
  const sortBy = browseOptions.sortBy

  const onBrowse = useCallback((options: BrowseOptions) => dispatch(browse(options)), [dispatch])

  const handleSectionClick = useCallback(
    (next: Section) => {
      const category = getCategoryFromSection(next)
      onBrowse({ section: next, assetType: category ? getMarketAssetTypeFromCategory(category) : undefined })
    },
    [onBrowse]
  )

  const handleSmartToggle = useCallback(() => {
    const category = getCategoryFromSection(Section.WEARABLES)
    onBrowse({
      section: Section.WEARABLES,
      assetType: category ? getMarketAssetTypeFromCategory(category) : undefined,
      onlySmart: !onlySmart
    })
  }, [onBrowse, onlySmart])

  const handleSortChange = useCallback(
    (_: React.SyntheticEvent<HTMLElement>, props: DropdownProps) => onBrowse({ sortBy: props.value as SortBy }),
    [onBrowse]
  )

  const priceActive = !!(minPrice || maxPrice)
  const statusActive = !!status && status !== AssetStatusFilter.NOT_FOR_SALE
  const sortByValue = sortByOptions.find(option => option.value === sortBy) ? sortBy : sortByOptions[0]?.value

  return (
    <div className="AssetFiltersBar">
      {/* Left filter group — can wrap internally without pushing the search/sort
          group to a new line (e.g. when a filter shows its active count badge). */}
      <div className="AssetFiltersBar__left">
        <SectionDropdown
          label={t('menu.wearables')}
          rootSection={Section.WEARABLES}
          items={WEARABLE_ITEMS}
          section={section}
          onSelect={handleSectionClick}
          extraItems={[{ key: 'smart', label: t('nft_filters.smart_wearables'), active: !!onlySmart, onClick: handleSmartToggle }]}
        />
        <SectionDropdown
          label={t('menu.emotes')}
          rootSection={Section.EMOTES}
          items={EMOTE_ITEMS}
          section={section}
          onSelect={handleSectionClick}
        />
        <RarityDropdown rarities={rarities} onChange={value => onBrowse({ rarities: value })} />
        <FilterPopover label={t('global.status')} active={statusActive}>
          <StatusFilter status={status} onChange={onBrowse} defaultCollapsed={false} />
        </FilterPopover>
        <FilterPopover label={t('global.price')} active={priceActive} className="PriceDropdown">
          <PriceFilter
            values={browseOptions}
            minPrice={minPrice}
            maxPrice={maxPrice}
            defaultCollapsed={false}
            onChange={value => onBrowse({ minPrice: value[0], maxPrice: value[1] })}
          />
        </FilterPopover>
      </div>

      <div className="AssetFiltersBar__right">
        <AssetSearchBar placeholder="Search Collections, Creators or Item" />
        <Dropdown
          className="AssetFiltersBar__sort"
          direction="left"
          value={sortByValue}
          options={sortByOptions}
          onChange={handleSortChange}
        />
      </div>
    </div>
  )
}

export default AssetFiltersBar
