import React, { useMemo } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Row } from 'decentraland-ui'

import {
  contractAddresses,
  contractCategories,
  contractSymbols
} from '../../../../modules/contract/utils'
import {
  WearableRarity,
  WearableGender
} from '../../../../modules/nft/wearable/types'
import { NFTCategory } from '../../../../modules/nft/types'
import { ContractName } from '../../../../modules/vendor/types'
import { ArrayFilter } from '../ArrayFilter'
import { SelectFilter } from '../SelectFilter'
import { Props } from './FiltersMenu.types'

export const ALL_COLLECTIONS_FILTER_OPTION = 'all'

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
    const options = Object.keys(contractAddresses).filter(
      (contractName: string) =>
        contractCategories[contractAddresses[contractName as ContractName]] ===
        NFTCategory.WEARABLE
    ) as ContractName[]
    return [
      {
        value: ALL_COLLECTIONS_FILTER_OPTION,
        text: t('nft_filters.all_collections')
      },
      ...options.map(collection => ({
        value: collection,
        text: contractSymbols[contractAddresses[collection]]
      }))
    ]
  }, [])

  const rarityOptions = useMemo(() => {
    const options = Object.values(WearableRarity)
      .filter(x => x !== WearableRarity.COMMON && x !== WearableRarity.UNIQUE)
      .reverse()
    return options.map(rarity => ({
      value: rarity,
      text: t(`wearable.rarity.${rarity}`)
    }))
  }, [])

  const genderOptions = useMemo(() => {
    const options = Object.values(WearableGender)
    return options.map(gender => ({
      value: gender,
      text: t(`wearable.body_shape.${gender}`)
    }))
  }, [])

  return (
    <>
      <Row>
        <SelectFilter
          name={t('nft_filters.collection')}
          value={selectedCollection || ALL_COLLECTIONS_FILTER_OPTION}
          options={collectionOptions}
          onChange={onCollectionsChange}
        />
      </Row>
      <Row>
        <ArrayFilter
          name={t('nft_filters.rarity')}
          values={selectedRarities}
          options={rarityOptions}
          onChange={onRaritiesChange}
        />
        <ArrayFilter
          name={t('nft_filters.gender')}
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
