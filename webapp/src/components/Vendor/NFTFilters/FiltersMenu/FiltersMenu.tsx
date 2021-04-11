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
import { Network } from '@dcl/schemas'

export const ALL_FILTER_OPTION = 'ALL'

const FiltersMenu = (props: Props) => {
  const {
    selectedCollection,
    selectedRarities,
    selectedGenders,
    selectedNetwork,
    onCollectionsChange,
    onRaritiesChange,
    onGendersChange,
    onNetworkChange
  } = props

  const collectionOptions = useMemo(() => {
    const options = Object.keys(contractAddresses).filter(
      (contractName: string) =>
        contractCategories[contractAddresses[contractName as ContractName]] ===
        NFTCategory.WEARABLE
    ) as ContractName[]
    return [
      {
        value: ALL_FILTER_OPTION,
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

  const networkOptions = useMemo(() => {
    const options = Object.values(Network).filter(
      value => typeof value === 'string'
    ) as Network[]
    return [
      {
        value: ALL_FILTER_OPTION,
        text: t('nft_filters.all_networks')
      },
      ...options.map(network => ({
        value: network,
        text: t(`networks.${network.toLowerCase()}`)
      }))
    ]
  }, [])

  return (
    <>
      <Row>
        <SelectFilter
          name={t('nft_filters.collection')}
          value={selectedCollection || ALL_FILTER_OPTION}
          options={collectionOptions}
          onChange={onCollectionsChange}
        />
        <SelectFilter
          name={t('nft_filters.network')}
          value={selectedNetwork || ALL_FILTER_OPTION}
          options={networkOptions}
          onChange={network => onNetworkChange(network as Network)}
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
