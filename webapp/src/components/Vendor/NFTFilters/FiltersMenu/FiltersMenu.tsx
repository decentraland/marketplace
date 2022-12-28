import React, { useMemo } from 'react'
import { NFTCategory } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Row,
} from 'decentraland-ui'
import { Contract } from '../../../../modules/vendor/services'
import { SelectFilter } from '../SelectFilter'
import { Props } from './FiltersMenu.types'

export const ALL_FILTER_OPTION = 'ALL'

const getContracts = (
  availableContracts: string[] | undefined,
  contracts: Contract[]
): Contract[] => {
  if (availableContracts && availableContracts.length > 0) {
    let filteredContracts = []
    for (const contract of contracts) {
      if (availableContracts.some(address => contract.address === address)) {
        filteredContracts.push(contract)
      }
    }

    return filteredContracts
  }

  return contracts
}

const FiltersMenu = (props: Props) => {
  const {
    selectedCollection,
    isOnlySmart,
    contracts,
    availableContracts,
    onCollectionsChange,
  } = props

  // Emote category sends this param undefined
  const category =
    isOnlySmart !== undefined ? NFTCategory.WEARABLE : NFTCategory.EMOTE

  const collectionOptions = useMemo(() => {
    return [
      {
        value: ALL_FILTER_OPTION,
        text: t('nft_filters.all_collections')
      },
      ...getContracts(availableContracts, contracts)
        .filter(contract => contract.category === category)
        .map(contract => ({
          value: contract.address,
          text: contract.name
        }))
    ]
  }, [availableContracts, category, contracts])

  return (
    <>
      <Row className="filters-container">
        <SelectFilter
          name={t('nft_filters.collection')}
          value={selectedCollection || ALL_FILTER_OPTION}
          clearable={!!selectedCollection}
          options={collectionOptions}
          onChange={onCollectionsChange}
        />
      </Row>
    </>
  )
}

FiltersMenu.defaultValues = {
  selectedRarities: []
}

export default React.memo(FiltersMenu)
