import { useCallback, useEffect, useMemo, useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box, useTabletAndBelowMediaQuery } from 'decentraland-ui'
import { SelectFilter } from '../../Vendor/NFTFilters/SelectFilter'
import { collectionAPI } from '../../../modules/vendor/decentraland'
import './CollectionFilter.css'

const ALL_FILTER_OPTION = 'ALL'

type CollectionFilterProps = {
  collection: string | undefined
  onlyOnSale: boolean | undefined
  onChange: (collection?: string) => void
  defaultCollapsed?: boolean
}

export const CollectionFilter = ({ collection, onlyOnSale, onChange, defaultCollapsed = false }: CollectionFilterProps): JSX.Element => {
  const isMobileOrTablet = useTabletAndBelowMediaQuery()
  const [savedCollectionInfo, setSavedCollectionInfo] = useState<{
    text: string
    value: string
    onlyOnSale?: boolean
  } | null>(null)

  const handleCollectionChange = useCallback(
    (value: string) => {
      // We need to send undefined for the ALL_FILTER_OPTION because we don't want it to be added to the url.
      // This was causing a bug where the contracts with address "ALL" would be fetched and bring no results.
      onChange(value === ALL_FILTER_OPTION ? undefined : value)
    },
    [onChange]
  )

  const handleFetchOptions = useCallback(
    async (search: string) => {
      try {
        const { data } = await collectionAPI.fetch({
          search,
          isOnSale: onlyOnSale
        })

        return data.map(collection => ({
          text: collection.name,
          value: collection.contractAddress
        }))
      } catch (e) {
        console.warn('Could not fetch options')
        return []
      }
    },
    [onlyOnSale]
  )

  const handleFetchOptionsFromValue = useCallback(
    async (value: string) => {
      try {
        if (value === savedCollectionInfo?.value && onlyOnSale === savedCollectionInfo.onlyOnSale) {
          return {
            text: savedCollectionInfo.text,
            value: savedCollectionInfo.value
          }
        }

        const { data } = await collectionAPI.fetch({
          contractAddress: value,
          isOnSale: onlyOnSale
        })

        if (data.length === 0) {
          setSavedCollectionInfo(null)
          return null
        }

        setSavedCollectionInfo({
          text: data[0].name,
          value,
          onlyOnSale
        })

        return {
          text: data[0].name,
          value
        }
      } catch (e) {
        console.warn('Could not fetch option from value')
        return null
      }
    },
    [onlyOnSale, savedCollectionInfo]
  )

  useEffect(() => {
    if (collection && collection !== savedCollectionInfo?.value) {
      handleFetchOptionsFromValue(collection)
    }

    if (!collection) {
      setSavedCollectionInfo(null)
    }
  }, [collection, savedCollectionInfo, handleFetchOptionsFromValue])

  const header = useMemo(
    () =>
      isMobileOrTablet ? (
        <div className="mobile-box-header">
          <span className="box-filter-name">{t('nft_filters.collection.title')}</span>
          <span className="box-filter-value">
            {savedCollectionInfo?.text ? savedCollectionInfo.text : t('nft_filters.collection.all_items')}
          </span>
        </div>
      ) : (
        t('nft_filters.collection.title')
      ),
    [isMobileOrTablet, savedCollectionInfo?.text]
  )

  return (
    <Box header={header} collapsible className="filters-sidebar-box" defaultCollapsed={defaultCollapsed || isMobileOrTablet}>
      <SelectFilter
        name=""
        value={collection || ''}
        clearable={!!collection}
        options={[]}
        placeholder={t('nft_filters.collection.search')}
        onChange={handleCollectionChange}
        fetchOptions={handleFetchOptions}
        fetchOptionFromValue={handleFetchOptionsFromValue}
        className="collection-filter"
      />
    </Box>
  )
}
