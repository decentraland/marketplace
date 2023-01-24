import {
  GenderFilterOption,
  Network,
  NFTCategory,
  WearableGender
} from '@dcl/schemas'
import classNames from 'classnames'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Mana } from '../components/Mana'
import { LANDFilters } from '../components/Vendor/decentraland/types'

export const AVAILABLE_FOR_MALE = 'AVAILABLE_FOR_MALE'
export const AVAILABLE_FOR_FEMALE = 'AVAILABLE_FOR_FEMALE'

export function getPriceLabel(
  minPrice?: string,
  maxPrice?: string,
  network: Network = Network.ETHEREUM
) {
  const priceFormatter = Intl.NumberFormat('en', { notation: 'compact' })
  const manaTranslator = () => (
    <Mana
      className={classNames('mana-label-icon', {
        'mana-label-range': minPrice && maxPrice
      })}
      network={network}
    />
  )

  if (!minPrice && !maxPrice) {
    return t('nft_filters.price.all_items')
  }

  if (minPrice && !maxPrice) {
    return t('nft_filters.price.more_than_price', {
      price: priceFormatter.format(Number(minPrice)),
      mana: manaTranslator
    })
  }

  if (maxPrice && !minPrice) {
    return t('nft_filters.price.less_than_price', {
      price: priceFormatter.format(Number(maxPrice)),
      mana: manaTranslator
    })
  }

  return t('nft_filters.price.price_between', {
    minPrice: priceFormatter.format(Number(minPrice)),
    maxPrice: priceFormatter.format(Number(maxPrice)),
    mana: manaTranslator
  })
}

export function getNetwork(network?: Network, category?: NFTCategory) {
  if (network) {
    return network
  }

  if (
    category &&
    [NFTCategory.WEARABLE, NFTCategory.EMOTE].includes(category)
  ) {
    return Network.MATIC
  }

  return Network.ETHEREUM
}

export function getBodyShapeValue(
  bodyShapes: (WearableGender | GenderFilterOption)[] | undefined
): string | undefined {
  if (bodyShapes?.length === 0) {
    return undefined
  }

  const hasUnisex = bodyShapes?.includes(GenderFilterOption.UNISEX)
  const hasMale = bodyShapes?.includes(GenderFilterOption.MALE)
  const hasFemale = bodyShapes?.includes(GenderFilterOption.FEMALE)

  if (hasUnisex && hasFemale) {
    return AVAILABLE_FOR_FEMALE
  }

  if (hasUnisex && hasMale) {
    return AVAILABLE_FOR_MALE
  }

  return undefined
}

export function getGenderFilterLabel(
  bodyShapes: (WearableGender | GenderFilterOption)[] | undefined
): string {
  const bodyShape = getBodyShapeValue(bodyShapes)

  if (!bodyShape) {
    return 'nft_filters.body_shapes.all_items'
  }

  const labels: Record<string, string> = {
    [AVAILABLE_FOR_FEMALE]: 'nft_filters.body_shapes.available_for_female',
    [AVAILABLE_FOR_MALE]: 'nft_filters.body_shapes.available_for_male'
  }

  return labels[bodyShape]
}

export function getLandLabel({
  landStatus,
  onlyOnRent = false,
  onlyOnSale = false
}: {
  landStatus?: LANDFilters
  onlyOnRent?: boolean
  onlyOnSale?: boolean
}) {
  if (landStatus === LANDFilters.ONLY_FOR_RENT || onlyOnRent) {
    return t('nft_land_filters.only_for_rent')
  }

  if (landStatus === LANDFilters.ONLY_FOR_SALE || onlyOnSale) {
    return t('nft_land_filters.only_for_sale')
  }

  if (landStatus === LANDFilters.ALL_LAND || !landStatus) {
    return t('nft_land_filters.all_land')
  }
  return undefined
}
