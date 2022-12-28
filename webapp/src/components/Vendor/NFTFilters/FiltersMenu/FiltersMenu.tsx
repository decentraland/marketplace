import React, { useCallback, useMemo } from 'react'
import classNames from 'classnames'
import { EmotePlayMode, Network, Rarity } from '@dcl/schemas'
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
import { collectionAPI } from '../../../../modules/vendor/decentraland'
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
    selectedEmotePlayMode,
    isOnlySmart,
    isOnSale,
    onCollectionsChange,
    onRaritiesChange,
    onGendersChange,
    onNetworkChange,
    onEmotePlayModeChange,
    onOnlySmartChange
  } = props

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
