import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Row,
} from 'decentraland-ui'
import { collectionAPI } from '../../../../modules/vendor/decentraland'
import { SelectFilter } from '../SelectFilter'
import { Props } from './FiltersMenu.types'

export const ALL_FILTER_OPTION = 'ALL'

const FiltersMenu = (props: Props) => {
  const {
    selectedCollection,
    isOnSale,
    onCollectionsChange,
  } = props
  
  return (
    <>
      <Row className="filters-container">
        <SelectFilter
          name={t('nft_filters.collection')}
          value={selectedCollection || ''}
          clearable={!!selectedCollection}
          options={[]}
          placeholder={t('nft_filters.all_collections')}
          onChange={newVal =>
            // We need to send undefined for the ALL_FILTER_OPTION because we don't want it to be added to the url.
            // This was causing a bug where the contracts with address "ALL" would be fetched and bring no results.
            onCollectionsChange(
              newVal === ALL_FILTER_OPTION ? undefined : newVal
            )
          }
          fetchOptions={async search => {
            try {
              const { data } = await collectionAPI.fetch({ search, isOnSale })

              return data.map(collection => ({
                text: collection.name,
                value: collection.contractAddress
              }))
            } catch (e) {
              console.warn('Could not fetch options')
              return []
            }
          }}
          fetchOptionFromValue={async value => {
            try {
              const { data } = await collectionAPI.fetch({
                contractAddress: value,
                isOnSale
              })

              if (data.length === 0) {
                return null
              }

              const collection = data[0]

              return {
                text: collection.name,
                value
              }
            } catch (e) {
              console.warn('Could not fetch option from value')
              return null
            }
          }}
        />
      </Row>
    </>
  )
}

FiltersMenu.defaultValues = {
  selectedRarities: []
}

export default React.memo(FiltersMenu)
