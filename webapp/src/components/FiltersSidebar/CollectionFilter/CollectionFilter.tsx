import { useCallback } from "react"
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Box } from "decentraland-ui"
import { SelectFilter } from "../../Vendor/NFTFilters/SelectFilter"
import { collectionAPI } from "../../../modules/vendor/decentraland"
import './CollectionFilter.css'

const ALL_FILTER_OPTION = 'ALL'

type CollectionFilterProps = {
  collection: string | undefined
  onlyOnSale: boolean | undefined
  onChange: (collection?: string) => void
}

export const CollectionFilter = ({ collection, onlyOnSale, onChange }: CollectionFilterProps): JSX.Element => {
  const handleCollectionChange = useCallback((value: string) => {
    // We need to send undefined for the ALL_FILTER_OPTION because we don't want it to be added to the url.
    // This was causing a bug where the contracts with address "ALL" would be fetched and bring no results.
    onChange(value === ALL_FILTER_OPTION ? undefined : value);
  }, [onChange])

  const handleFetchOptions = useCallback(async (search: string) => {
    try {
      const { data } = await collectionAPI.fetch({ search, isOnSale: onlyOnSale })

      return data.map(collection => ({
        text: collection.name,
        value: collection.contractAddress
      }))
    } catch (e) {
      console.warn('Could not fetch options')
      return []
    }
  }, [onlyOnSale])

  const handleFetchOptionsFromValue = useCallback(async (value: string) => {
    try {
      const { data } = await collectionAPI.fetch({
        contractAddress: value,
        isOnSale: onlyOnSale
      })

      if (data.length === 0) {
        return null
      }

      return {
        text: data[0].name,
        value
      }
    } catch (e) {
      console.warn('Could not fetch option from value')
      return null
    }
  }, [onlyOnSale])

  return (
    <Box header={t('nft_filters.collection')} collapsible>
      <SelectFilter
        name=""
        value={collection || ''}
        clearable={!!collection}
        options={[]}
        placeholder={t('nft_filters.all_collections')}
        onChange={handleCollectionChange}
        fetchOptions={handleFetchOptions}
        fetchOptionFromValue={handleFetchOptionsFromValue}
        className="collection-filter"
      />
    </Box>
  )
}
