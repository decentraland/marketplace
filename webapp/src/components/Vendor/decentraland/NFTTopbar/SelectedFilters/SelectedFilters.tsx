import { useState, useMemo } from 'react'
import { Rarity } from '@dcl/schemas'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { useCallback, useEffect } from 'react'
import { Pill } from './Pill/Pill'
import { Props } from './SelectedFilters.types'
import styles from './SelectedFilters.module.css'
import { getCollectionNameByAddress } from './utils'
import { Mana } from 'decentraland-ui'
import classNames from 'classnames'

export const SelectedFilters = ({ browseOptions, isLandSection, onBrowse }: Props)  => {
  const { rarities, network, onlySmart, contracts, wearableGenders, onlyOnSale, emotePlayMode, minPrice, maxPrice, onlyOnRent } = browseOptions;
  const [collection, setCollection] = useState<string | undefined>(undefined)

  useEffect(() => {
    const fetchData = async (contract: string, onlyOnSale: boolean | undefined) => {
      const collectionName = await getCollectionNameByAddress(contract, onlyOnSale)
      return collectionName;
    }
  
    if (contracts?.length) {
      fetchData(contracts[0], onlyOnSale)
        .then((collectionName) => setCollection(collectionName))
    } else {
      setCollection(undefined)
    }
  
  }, [contracts, onlyOnSale])

  const priceLabel = useMemo(() => {
    const manaTranslator = () => <Mana className={classNames(styles.manaIcon, {
      [styles.range]: minPrice && maxPrice
    })} />

    if (minPrice && !maxPrice) {
      return t('nft_filters.more_than_price', {
        price: minPrice,
        mana: manaTranslator
      })
    }

    if (maxPrice && !minPrice) {
      return t('nft_filters.less_than_price', {
        price: maxPrice,
        mana: manaTranslator
      })
    }

    return t('nft_filters.price_between', {
      minPrice,
      maxPrice,
      mana: manaTranslator
    })
  }, [minPrice, maxPrice])

  const landStatusLabel = useMemo(() => {
    if (!isLandSection) {
      return undefined
    }
    if (onlyOnRent) {
      return t('nft_land_filters.only_for_rent')
    } else if (onlyOnSale) {
     return t('nft_land_filters.only_for_sale')
    }
  
  }, [onlyOnSale, onlyOnRent, isLandSection])

  const handleDeleteRarity = useCallback((rarity: string) => {
    onBrowse({ rarities: rarities?.filter((r: Rarity) => r !== rarity)})
  }, [onBrowse, rarities]) 

  const handleDeleteNetwork = useCallback(() => {
    onBrowse({ network: undefined })
  }, [onBrowse])

  const handleDeleteOnlySmart = useCallback(() => {
    onBrowse({ onlySmart: undefined })
  }, [onBrowse])
  
  const handleDeleteOnlySale = useCallback(() => {
    onBrowse({ onlySmart: true })
  }, [onBrowse])

  const handleDeleteGender = useCallback((gender: string) => {
    onBrowse({ wearableGenders: wearableGenders?.filter((g) => g !== gender) })
  }, [onBrowse, wearableGenders])
  
  const handleDeleteEmotePlayMode = useCallback(() => {
    onBrowse({ emotePlayMode: undefined })
  }, [onBrowse])

  const handleDeletePrice = useCallback(() => {
    onBrowse({ minPrice: undefined, maxPrice: undefined })
  }, [onBrowse])

  const handleDeleteLandStatus = useCallback(() => {
    onBrowse({ onlyOnRent: undefined, onlyOnSale: undefined })
  }, [onBrowse])

  return (
    <div className={styles.pillContainer}>
      {rarities?.map(rarity => (
        <Pill label={rarity} id={rarity} onDelete={handleDeleteRarity} />
      ))}
      {network ? <Pill label={t(`networks.${network.toLowerCase()}`)} id="network" onDelete={handleDeleteNetwork} /> : null}
      {onlySmart ? <Pill label={t('nft_filters.only_smart')} id="only smart" onDelete={handleDeleteOnlySmart} /> : null}
      {collection ? <Pill label={collection} id={collection} onDelete={handleDeleteRarity} /> : null}
      {wearableGenders?.map(gender => (
        <Pill label={t(`nft_filters.body_shapes.${gender}`)} id={gender} onDelete={handleDeleteGender} />
      ))}
      {!onlyOnSale && !isLandSection ? <Pill label={t('nft_filters.not_on_sale')} id="only_on_sale" onDelete={handleDeleteOnlySale} /> : null}
      {emotePlayMode ? <Pill label={t(`emote.play_mode.${emotePlayMode}`)} onDelete={handleDeleteEmotePlayMode} id={emotePlayMode} /> : null}
      {minPrice || maxPrice ? <Pill label={priceLabel} onDelete={handleDeletePrice} id="price" /> : null}
      {isLandSection && landStatusLabel ? <Pill label={landStatusLabel} onDelete={handleDeleteLandStatus} id="land_filter" /> : null}
    </div>
  )
}
