import React, { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { Network, NFTCategory, Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import {
  Row,
  Column,
  SmartIcon,
  Popup,
  Mobile,
  NotMobile,
  Header,
  Radio
} from 'decentraland-ui'
import { WearableGender } from '../../../../modules/nft/wearable/types'
import { contracts } from '../../../../modules/contract/utils'
import { ArrayFilter } from '../ArrayFilter'
import { SelectFilter } from '../SelectFilter'
import { Props } from './FiltersMenu.types'

export const ALL_FILTER_OPTION = 'ALL'

const FiltersMenu = (props: Props) => {
  const {
    selectedCollection,
    selectedRarities,
    selectedGenders,
    selectedNetwork,
    isOnlySmart,
    onCollectionsChange,
    onRaritiesChange,
    onGendersChange,
    onNetworkChange,
    onOnlySmartChange
  } = props

  const collectionOptions = useMemo(() => {
    return [
      {
        value: ALL_FILTER_OPTION,
        text: t('nft_filters.all_collections')
      },
      ...contracts
        .filter(contract => contract.category === NFTCategory.WEARABLE)
        .map(contract => ({
          value: contract.address,
          text: contract.name
        }))
    ]
  }, [])

  const rarityOptions = useMemo(() => {
    const options = Object.values(Rarity)
      .filter(value => typeof value === 'string')
      .reverse() as string[]
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

  const handleOnlySmartClick = useCallback(
    () => onOnlySmartChange(!isOnlySmart),
    [onOnlySmartChange, isOnlySmart]
  )

  return (
    <>
      <Row>
        <SelectFilter
          name={t('nft_filters.collection')}
          value={selectedCollection || ALL_FILTER_OPTION}
          clearable={!!selectedCollection}
          options={collectionOptions}
          onChange={onCollectionsChange}
        />
        <SelectFilter
          name={t('nft_filters.network')}
          value={selectedNetwork || ALL_FILTER_OPTION}
          clearable={!!selectedNetwork}
          options={networkOptions}
          onChange={network => onNetworkChange(network as Network)}
        />
        <Mobile>
          <Header sub>{t('nft_filters.smart_wearables')}</Header>
          <Radio
            className="smart-toggle-mobile"
            toggle
            checked={isOnlySmart}
            onChange={handleOnlySmartClick}
          />
        </Mobile>
        <NotMobile>
          <Popup
            content={t('nft_filters.smart_wearables')}
            position="top center"
            trigger={
              <div
                className={classNames(`smart-toggle`, {
                  'is-enabled': isOnlySmart
                })}
                onClick={handleOnlySmartClick}
              >
                <SmartIcon />
              </div>
            }
          ></Popup>
        </NotMobile>
      </Row>
      <Row>
        <Column>
          <ArrayFilter
            name={t('nft_filters.rarity')}
            values={selectedRarities}
            options={rarityOptions}
            onChange={onRaritiesChange}
          />
        </Column>
        <Column>
          <ArrayFilter
            name={t('nft_filters.gender')}
            values={selectedGenders}
            options={genderOptions}
            onChange={onGendersChange}
          />
        </Column>
      </Row>
    </>
  )
}

FiltersMenu.defaultValues = {
  selectedRarities: [],
  selectedGenders: []
}

export default React.memo(FiltersMenu)
