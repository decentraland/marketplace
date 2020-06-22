import React, { useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Row } from 'decentraland-ui'

import {
  contractAddresses,
  contractCategories,
  contractSymbols
} from '../../../modules/contract/utils'
import {
  WearableRarity,
  WearableGender
} from '../../../modules/nft/wearable/types'
import { ContractName } from '../../../modules/vendor/types'
import { NFTCategory } from '../../../modules/nft/types'
import { ArrayFilter } from '../ArrayFilter'
import { SelectFilter } from '../SelectFilter'
import { Props } from './FiltersMenu.types'
import './FiltersMenu.css'

export const ALL_COLLECTIONS_FILTER_OPTION = 'all'

// Default values
const RARITY_FILTER_OPTIONS = Object.values(WearableRarity)
  .filter(x => x !== WearableRarity.COMMON && x !== WearableRarity.UNIQUE)
  .reverse()

const GENDER_FILTER_OPTIONS = Object.values(WearableGender)

const COLLECTION_FILTER_OPTIONS = Object.keys(contractAddresses).filter(
  (contractName: string) =>
    contractCategories[contractAddresses[contractName as ContractName]] ===
    NFTCategory.WEARABLE
) as ContractName[]

const FiltersMenu = (props: Props) => {
  const {
    selectedCollection,
    selectedRarities,
    selectedGenders,
    onCollectionsChange,
    onRaritiesChange,
    onGendersChange
  } = props

  const collectionOptions = useMemo(() => {
    return [
      {
        value: ALL_COLLECTIONS_FILTER_OPTION,
        text: t('nft_list_page.all_collections')
      },
      ...COLLECTION_FILTER_OPTIONS.map(collection => ({
        value: collection,
        text: contractSymbols[contractAddresses[collection]]
      }))
    ]
  }, [
    ALL_COLLECTIONS_FILTER_OPTION,
    COLLECTION_FILTER_OPTIONS,
    contractSymbols,
    contractAddresses
  ])

  const rarityOptions = useMemo(() => {
    return RARITY_FILTER_OPTIONS.map(rarity => ({
      value: rarity,
      text: t(`wearable.rarity.${rarity}`)
    }))
  }, [RARITY_FILTER_OPTIONS])

  const genderOptions = useMemo(() => {
    return GENDER_FILTER_OPTIONS.map(gender => ({
      value: gender,
      text: t(`wearable.body_shape.${gender}`)
    }))
  }, [GENDER_FILTER_OPTIONS])

  return (
    <>
      <Row>
        <SelectFilter
          name={t('nft_list_page.collection')}
          value={selectedCollection || ALL_COLLECTIONS_FILTER_OPTION}
          options={collectionOptions}
          onChange={onCollectionsChange}
        />
      </Row>
      <Row>
        <ArrayFilter
          name={t('nft_list_page.rarity')}
          values={selectedRarities}
          options={rarityOptions}
          onChange={onRaritiesChange}
        />
        <ArrayFilter
          name={t('nft_list_page.gender')}
          values={selectedGenders}
          options={genderOptions}
          onChange={onGendersChange}
        />
      </Row>
    </>
  )
}

FiltersMenu.defaultValues = {
  selectedRarities: [],
  selectedGenders: []
}

export default React.memo(FiltersMenu)
