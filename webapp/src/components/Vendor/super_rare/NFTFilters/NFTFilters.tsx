import React, { useCallback, useState } from 'react'
import {
  Button,
  Header,
  Dropdown,
  DropdownProps,
  Responsive,
  Modal
} from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'

import { SortBy } from '../../../../modules/routing/types'
import { TextFilter } from '../../NFTFilters/TextFilter'
import { Props } from './NFTFilters.types'

const MAX_RESULTS = 1000

const NFTFilters = (props: Props) => {
  const { search, count, onBrowse } = props

  const [showFiltersModal, setShowFiltersModal] = useState(false)

  const dropdownOptions = [
    { value: SortBy.RECENTLY_LISTED, text: t('filters.recently_listed') },
    { value: SortBy.CHEAPEST, text: t('filters.cheapest') }
  ]

  const sortBy = dropdownOptions.find(option => option.value === props.sortBy)
    ? props.sortBy
    : dropdownOptions[0].value

  const handleDropdownChange = useCallback(
    (_, props: DropdownProps) => {
      onBrowse({ sortBy: props.value as SortBy })
    },
    [onBrowse]
  )

  const handleSearch = useCallback(
    (newSearch: string) => {
      if (search !== newSearch) {
        onBrowse({ search: newSearch })
      }
    },
    [search, onBrowse]
  )

  const searchPlaceholder =
    count === undefined
      ? t('global.loading') + '...'
      : t('nft_filters.search', {
          suffix:
            count < MAX_RESULTS
              ? t('nft_filters.results', {
                  count: count.toLocaleString()
                })
              : t('nft_filters.more_than_results', {
                  count: count.toLocaleString()
                })
        })

  return (
    <div className="NFTFilters">
      <div className="topbar">
        <TextFilter
          value={search}
          placeholder={searchPlaceholder}
          onChange={handleSearch}
        />
        <Responsive
          as={Dropdown}
          className="topbar-filter"
          minWidth={Responsive.onlyTablet.minWidth}
          direction="left"
          value={sortBy}
          options={dropdownOptions}
          onChange={handleDropdownChange}
        />
      </div>

      <Modal
        className="FiltersModal"
        open={showFiltersModal}
        onClose={() => setShowFiltersModal(false)}
      >
        <Modal.Header>{t('nft_filters.filter')}</Modal.Header>
        <Modal.Content>
          <div className="filter-row">
            <Header sub>{t('nft_filters.order_by')}</Header>
            <Dropdown
              direction="left"
              value={sortBy}
              options={dropdownOptions}
              onChange={handleDropdownChange}
            />
          </div>
          <Button
            className="apply-filters"
            primary
            onClick={() => setShowFiltersModal(false)}
          >
            {t('global.apply')}
          </Button>
        </Modal.Content>
      </Modal>
    </div>
  )
}

export default React.memo(NFTFilters)
