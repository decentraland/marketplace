import React, { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { EmotePlayMode, Network, NFTCategory, Rarity } from '@dcl/schemas'
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
import { Contract } from '../../../../modules/vendor/services'
import { ArrayFilter } from '../ArrayFilter'
import { SelectFilter } from '../SelectFilter'
import { Props } from './FiltersMenu.types'

export const ALL_FILTER_OPTION = 'ALL'

const getContracts = (availableContracts: string[] | undefined): Contract[] => {
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
    selectedRarities,
    selectedGenders,
    selectedNetwork,
    selectedEmotePlayMode,
    isOnlySmart,
    availableContracts,
    onCollectionsChange,
    onRaritiesChange,
    onGendersChange,
    onNetworkChange,
    onEmotePlayModeChange,
    onOnlySmartChange
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
      ...getContracts(availableContracts)
        .filter(contract => contract.category === category)
        .map(contract => ({
          value: contract.address,
          text: contract.name
        }))
    ]
  }, [availableContracts, category])

  const rarityOptions = useMemo(() => {
    const options = Object.values(Rarity)
      .filter(value => typeof value === 'string')
      .reverse() as string[]
    return options.map(rarity => ({
      value: rarity,
      text: t(`rarity.${rarity}`)
    }))
  }, [])

  const genderOptions = useMemo(() => {
    const options = Object.values(WearableGender)
    return options.map(gender => ({
      value: gender,
      text: t(`body_shape.${gender}`)
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

  const emotePlayModeOptions = useMemo(() => {
    const options = Object.values(EmotePlayMode).filter(
      value => typeof value === 'string'
    ) as EmotePlayMode[]
    return [
      {
        value: ALL_FILTER_OPTION,
        text: t('nft_filters.all_play_modes')
      },
      ...options.map(playMode => ({
        value: playMode,
        text: t(`emote.play_mode.${playMode}`)
      }))
    ]
  }, [])

  const handleOnlySmartClick = useCallback(() => {
    return onOnlySmartChange ? onOnlySmartChange(!isOnlySmart) : null
  }, [onOnlySmartChange, isOnlySmart])

  const handleOnGenderChange = useCallback(
    options => {
      return onGendersChange ? onGendersChange(options) : null
    },
    [onGendersChange]
  )

  return (
    <>
      <Row className='filters-container'>
        <SelectFilter
          name={t('nft_filters.collection')}
          value={selectedCollection || ALL_FILTER_OPTION}
          clearable={!!selectedCollection}
          options={collectionOptions}
          onChange={onCollectionsChange}
        />
        {onNetworkChange !== undefined && (
          <SelectFilter
            name={t('nft_filters.network')}
            value={selectedNetwork || ALL_FILTER_OPTION}
            clearable={!!selectedNetwork}
            options={networkOptions}
            onChange={network => onNetworkChange(network as Network)}
          />
        )}
        {onEmotePlayModeChange !== undefined && (
          <SelectFilter
            name={t('nft_filters.play_mode')}
            value={selectedEmotePlayMode || ALL_FILTER_OPTION}
            clearable={!!selectedEmotePlayMode}
            options={emotePlayModeOptions}
            onChange={playMode =>
              onEmotePlayModeChange(playMode as EmotePlayMode)
            }
          />
        )}
        {isOnlySmart !== undefined && (
          <>
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
          </>
        )}
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
        {selectedGenders !== undefined && (
          <Column>
            <ArrayFilter
              name={t('nft_filters.gender')}
              values={selectedGenders}
              options={genderOptions}
              onChange={handleOnGenderChange}
            />
          </Column>
        )}
      </Row>
    </>
  )
}

FiltersMenu.defaultValues = {
  selectedRarities: [],
  selectedGenders: []
}

export default React.memo(FiltersMenu)
