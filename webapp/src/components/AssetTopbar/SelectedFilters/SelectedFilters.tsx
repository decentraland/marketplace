import { useState, useMemo, useCallback, useEffect } from 'react'
import { Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import ProfilesCache from '../../../lib/profiles'
import { CreatorAccount } from '../../../modules/account/types'
import { AssetType } from '../../../modules/asset/types'
import {
  getEstateSizeLabel,
  getGenderFilterLabel,
  getLandLabel,
  getNetwork,
  getPriceLabel,
  AssetStatusFilter
} from '../../../utils/filters'
import { profileToCreatorAccount } from '../../AssetFilters/CreatorsFilter/utils'
import { Pill } from './Pill/Pill'
import { getCollectionByAddress } from './utils'
import { Props } from './SelectedFilters.types'
import styles from './SelectedFilters.module.css'

export const SelectedFilters = ({ browseOptions, isLandSection, category, onBrowse }: Props) => {
  const {
    rarities,
    network,
    onlySmart,
    contracts,
    creators,
    wearableGenders,
    onlyOnSale,
    emotePlayMode,
    minPrice,
    maxPrice,
    onlyOnRent,
    minEstateSize,
    maxEstateSize,
    adjacentToRoad,
    minDistanceToPlaza,
    maxDistanceToPlaza,
    rentalDays,
    assetType,
    status,
    emoteHasSound,
    emoteHasGeometry
  } = browseOptions
  const [collections, setCollections] = useState<Record<string, string>[] | []>([])

  const [selectedCreators, setSelectedCreators] = useState<Pick<CreatorAccount, 'address' | 'name'>[]>()

  useEffect(() => {
    const getCollections = async () => {
      if (contracts?.length) {
        const collections = await Promise.all(contracts.map(contract => getCollectionByAddress(contract)))

        setCollections(
          collections.map(collection => ({
            address: collection.contractAddress,
            name: collection.name
          }))
        )
      } else if (!contracts?.length) {
        setCollections([])
      }
    }

    void getCollections()
  }, [contracts, onlyOnSale])

  useEffect(() => {
    const getCreators = async () => {
      if (creators?.length) {
        const profiles = await ProfilesCache.fetchProfile(creators)
        setSelectedCreators(profileToCreatorAccount(profiles))
      } else if (!creators?.length) {
        setSelectedCreators([])
      }
    }
    void getCreators()
  }, [creators])

  const priceLabel = useMemo(
    () => getPriceLabel(minPrice, maxPrice, getNetwork(network, category)),
    [minPrice, maxPrice, network, category]
  )

  const estateSizeLabel = useMemo(() => getEstateSizeLabel(minEstateSize, maxEstateSize), [minEstateSize, maxEstateSize])

  const landStatusLabel = useMemo(() => {
    if (isLandSection && (onlyOnSale || onlyOnRent)) {
      return getLandLabel({ onlyOnRent, onlyOnSale })
    }
    return undefined
  }, [onlyOnRent, onlyOnSale, isLandSection])

  const handleDeleteRarity = useCallback(
    (rarity: string) => {
      onBrowse({ rarities: rarities?.filter((r: Rarity) => r !== (rarity as Rarity)) })
    },
    [onBrowse, rarities]
  )

  const handleDeleteCreator = useCallback(
    (address: string) => {
      onBrowse({ creators: creators?.filter(creator => creator !== address) })
    },
    [creators, onBrowse]
  )

  const handleDeleteCollection = useCallback(
    contract => {
      onBrowse({
        contracts: contracts?.filter(collection => collection !== contract)
      })
    },
    [contracts, onBrowse]
  )

  const handleDeleteNetwork = useCallback(() => {
    onBrowse({ network: undefined })
  }, [onBrowse])

  const handleDeleteOnlySmart = useCallback(() => {
    onBrowse({ onlySmart: undefined })
  }, [onBrowse])

  const handleDeleteOnlySale = useCallback(() => {
    onBrowse({ onlyOnSale: true })
  }, [onBrowse])

  const handleDeleteGender = useCallback(() => {
    onBrowse({ wearableGenders: [] })
  }, [onBrowse])

  const handleDeleteEmotePlayMode = useCallback(
    playMode => {
      onBrowse({
        emotePlayMode: emotePlayMode?.filter(mode => playMode !== mode)
      })
    },
    [onBrowse, emotePlayMode]
  )

  const handleDeletePrice = useCallback(() => {
    onBrowse({ minPrice: undefined, maxPrice: undefined })
  }, [onBrowse])

  const handleDeleteEstateSize = useCallback(() => {
    onBrowse({ minEstateSize: undefined, maxEstateSize: undefined })
  }, [onBrowse])

  const handleDeleteLandStatus = useCallback(() => {
    onBrowse({ onlyOnRent: undefined, onlyOnSale: undefined })
  }, [onBrowse])

  const handleDeleteDistanceToPlaza = useCallback(() => {
    onBrowse({ minDistanceToPlaza: undefined, maxDistanceToPlaza: undefined })
  }, [onBrowse])

  const handleDeleteAdjacentToRoad = useCallback(() => {
    onBrowse({ adjacentToRoad: undefined })
  }, [onBrowse])

  const handleDeleteStatus = useCallback(() => {
    onBrowse({ status: AssetStatusFilter.ON_SALE })
  }, [onBrowse])

  const handleDeleteRentalDays = useCallback(
    (removeDays: string) => {
      onBrowse({
        rentalDays: rentalDays?.filter(day => removeDays.toString() !== day.toString())
      })
    },
    [onBrowse, rentalDays]
  )

  const handleDeleteEmoteHasSound = useCallback(() => {
    onBrowse({ emoteHasSound: undefined })
  }, [onBrowse])

  const handleDeleteEmoteHasGeometry = useCallback(() => {
    onBrowse({ emoteHasGeometry: undefined })
  }, [onBrowse])

  return (
    <div className={styles.pillContainer}>
      {emoteHasSound ? (
        <Pill label={t('nft_filters.emote_attributes.with_sound')} id="emoteHasSound" onDelete={handleDeleteEmoteHasSound} />
      ) : null}
      {emoteHasGeometry ? (
        <Pill label={t('nft_filters.emote_attributes.with_props')} id="emoteHasGeomtry" onDelete={handleDeleteEmoteHasGeometry} />
      ) : null}
      {rarities?.map(rarity => <Pill key={rarity} label={rarity} id={rarity} onDelete={handleDeleteRarity} />)}
      {network ? <Pill label={t(`networks.${network.toLowerCase()}`)} id="network" onDelete={handleDeleteNetwork} /> : null}
      {onlySmart ? <Pill label={t('nft_filters.only_smart.selected')} id="onlySmart" onDelete={handleDeleteOnlySmart} /> : null}
      {collections.length
        ? collections.map(collection => (
            <Pill
              key={collection.address}
              id={`collection-${collection.address}`}
              label={collection.name}
              onDelete={() => handleDeleteCollection(collection.address)}
            />
          ))
        : null}
      {selectedCreators?.length
        ? selectedCreators.map(creator => (
            <Pill key={creator.address} label={creator.name} id={creator.address} onDelete={() => handleDeleteCreator(creator.address)} />
          ))
        : null}
      {wearableGenders?.length ? (
        <Pill label={t(getGenderFilterLabel(wearableGenders))} id="wearable_genders" onDelete={handleDeleteGender} />
      ) : null}
      {!onlyOnSale && !isLandSection && assetType !== AssetType.ITEM ? ( // TODO UNIFIED: CHECK THIS
        <Pill label={t('nft_filters.not_on_sale')} id="onlyOnSale" onDelete={handleDeleteOnlySale} />
      ) : null}
      {emotePlayMode?.map(playMode => (
        <Pill key={playMode} label={t(`emote.play_mode.${playMode}`)} onDelete={handleDeleteEmotePlayMode} id={playMode} />
      ))}
      {minPrice || maxPrice ? <Pill label={priceLabel} className={styles.pricePill} onDelete={handleDeletePrice} id="price" /> : null}
      {minEstateSize || maxEstateSize ? <Pill label={estateSizeLabel} onDelete={handleDeleteEstateSize} id="estateSize" /> : null}
      {isLandSection && landStatusLabel ? <Pill label={landStatusLabel} onDelete={handleDeleteLandStatus} id="land_filter" /> : null}
      {adjacentToRoad ? <Pill label={t('nft_filters.adjacent_to_road')} onDelete={handleDeleteAdjacentToRoad} id="adjacentToRoad" /> : null}
      {minDistanceToPlaza || maxDistanceToPlaza ? (
        <Pill
          label={t('nft_filters.distance_to_plaza.selection', {
            from: minDistanceToPlaza,
            to: maxDistanceToPlaza
          })}
          onDelete={handleDeleteDistanceToPlaza}
          id="distanceToPlaza"
        />
      ) : null}
      {rentalDays && rentalDays.length
        ? rentalDays.map(days => (
            <Pill
              key={days}
              label={t('nft_filters.periods.selection', { rentalDays: days })}
              onDelete={handleDeleteRentalDays}
              id={days.toString()}
            />
          ))
        : null}
      {status && status !== AssetStatusFilter.ON_SALE ? (
        <Pill key={status} label={t(`nft_filters.status.${status}`)} onDelete={handleDeleteStatus} id={status.toString()} />
      ) : null}
    </div>
  )
}
