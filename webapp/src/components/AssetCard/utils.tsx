import { BigNumber, ethers } from 'ethers'
import { MAXIMUM_FRACTION_DIGITS } from 'decentraland-dapps/dist/lib/mana'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Item } from '@dcl/schemas'
import mintingIcon from '../../images/minting.png'
import { getMinimumValueForFractionDigits } from '../../lib/mana'
import { BrowseOptions, SortBy } from '../../modules/routing/types'
import { Mana } from '../Mana'

const formatter = Intl.NumberFormat('en', { notation: 'compact' })

export function formatWeiToAssetCard(wei: string): string {
  const maximumFractionDigits = MAXIMUM_FRACTION_DIGITS
  const value = Number(ethers.utils.formatEther(wei))

  if (value === 0) {
    return '0'
  }

  const fixedValue = value.toLocaleString(undefined, {
    maximumFractionDigits
  })

  if (fixedValue === '0') {
    return getMinimumValueForFractionDigits(maximumFractionDigits).toString()
  }

  return formatter.format(value)
}

type CatalogCardInformation = {
  action: string
  actionIcon: string | null
  price: string | null
  extraInformation: React.ReactElement | null
}

export function getAlsoAvailableForMintingText(asset: Item) {
  return (
    <span>
      {t('asset_card.also_minting')}:&nbsp;
      <Mana size="small" network={asset.network} className="tiniMana">
        {formatWeiToAssetCard(asset.price)}
      </Mana>
    </span>
  )
}

export function getListingsRangePrice(asset: Item) {
  return `${asset.minListingPrice} - ${asset.maxListingPrice}`
}

export function getAssetListingsRangeInfoText(asset: Item) {
  return asset.minListingPrice && asset.maxListingPrice ? (
    <span className={'wrapBigText'}>
      {t('asset_card.listings', { count: asset.listings })}
      :&nbsp;
      <span>
        <Mana size="small" network={asset.network} className="tiniMana">
          {formatWeiToAssetCard(asset.minListingPrice)}
        </Mana>
        &nbsp;
        {!!asset.listings &&
          asset.listings > 1 &&
          asset.minListingPrice !== asset.maxListingPrice &&
          `- ${formatWeiToAssetCard(asset.maxListingPrice)}`}
      </span>
    </span>
  ) : null
}

function getIsMintPriceInRange(
  asset: Item,
  appliedFilters: Pick<BrowseOptions, 'minPrice' | 'maxPrice'>
) {
  return (
    !appliedFilters.minPrice ||
    (BigNumber.from(asset.price).gte(
      ethers.utils.parseUnits(appliedFilters.minPrice)
    ) &&
      (!appliedFilters.maxPrice ||
        BigNumber.from(asset.price).lte(
          ethers.utils.parseUnits(appliedFilters.maxPrice)
        )))
  )
}

export function getCatalogCardInformation(
  asset: Item,
  appliedFilters: Pick<BrowseOptions, 'minPrice' | 'maxPrice' | 'sortBy'>
): CatalogCardInformation {
  const { sortBy } = appliedFilters

  const isAvailableForMint = asset.isOnSale && asset.available > 0
  const hasListings = asset.listings && asset.listings > 0
  const hasOnlyListings = hasListings && !isAvailableForMint
  const hasOnlyMint = isAvailableForMint && !hasListings
  const notForSale = !isAvailableForMint && !hasListings
  const hasRangeApplied = !!appliedFilters.minPrice || !!appliedFilters.maxPrice

  if (notForSale) {
    return {
      action: t('asset_card.not_for_sale'),
      actionIcon: null,
      price: null,
      extraInformation: null
    }
  }

  if (sortBy === SortBy.CHEAPEST) {
    const info: CatalogCardInformation = {
      action: hasRangeApplied
        ? t('asset_card.cheapest_option_range')
        : t('asset_card.cheapest_option'),
      actionIcon: null,
      price: asset.minPrice ?? null,
      extraInformation: null
    }

    if (hasOnlyMint) {
      info.extraInformation = null
    } else if (hasOnlyListings && asset.listings && asset.listings > 1) {
      info.extraInformation = getAssetListingsRangeInfoText(asset)
    } else {
      // has both minting and listings
      if (hasRangeApplied) {
        info.price = asset.minPrice ?? asset.price // TODO check if this is necessary
        if (appliedFilters.minPrice) {
          const isMintingLessThanMinPriceFilter = BigNumber.from(
            asset.price
          ).lt(ethers.utils.parseUnits(appliedFilters.minPrice))
          info.extraInformation = isMintingLessThanMinPriceFilter
            ? getAlsoAvailableForMintingText(asset)
            : null
        }
      } else {
        const mintIsNotCheapestOption = BigNumber.from(asset.price).gt(
          BigNumber.from(asset.minPrice)
        )
        if (mintIsNotCheapestOption) {
          info.extraInformation = getAlsoAvailableForMintingText(asset)
        }
      }
    }
    return info
  } else if (sortBy === SortBy.MOST_EXPENSIVE) {
    const info: CatalogCardInformation = {
      action: hasRangeApplied
        ? t('asset_card.most_expensive_range')
        : t('asset_card.most_expensive'),
      actionIcon: null,
      price: asset.price,
      extraInformation: getAssetListingsRangeInfoText(asset)
    }

    const isMintingGreaterThanMaxListingPrice =
      !!asset.maxListingPrice &&
      BigNumber.from(asset.price).gt(BigNumber.from(asset.maxListingPrice))

    info.price =
      getIsMintPriceInRange(asset, appliedFilters) &&
      isMintingGreaterThanMaxListingPrice
        ? asset.price
        : asset.maxListingPrice ?? asset.price

    return info
  }

  // rest of filter without label logic
  const info: CatalogCardInformation = {
    action: '',
    actionIcon: null,
    price: asset.price,
    extraInformation: null
  }

  if (hasOnlyMint) {
    info.action = t('asset_card.available_for_mint')
    info.actionIcon = mintingIcon
  } else if (hasOnlyListings) {
    info.action = hasRangeApplied
      ? t('asset_card.available_listings_in_range')
      : t('asset_card.cheapest_listing')
    info.price =
      asset.listings &&
      asset.listings > 1 &&
      asset.minListingPrice !== asset.maxListingPrice
        ? hasRangeApplied
          ? getListingsRangePrice(asset)
          : asset.minListingPrice ?? ''
        : asset.minPrice ?? ''
  } else {
    // both mint and listings available

    if (hasRangeApplied) {
      const isMintInRange = getIsMintPriceInRange(asset, appliedFilters)
      info.action = isMintInRange
        ? t('asset_card.available_for_mint')
        : t('asset_card.available_listings_in_range')
      info.price = isMintInRange ? asset.price : asset.minListingPrice ?? ''
      info.actionIcon = isMintInRange ? mintingIcon : null
      info.extraInformation = isMintInRange
        ? getAssetListingsRangeInfoText(asset)
        : null

      if (appliedFilters.minPrice) {
        const isMintingLessThanMinPriceFilter = BigNumber.from(asset.price).lt(
          ethers.utils.parseUnits(appliedFilters.minPrice)
        )
        info.extraInformation =
          !isMintInRange && isMintingLessThanMinPriceFilter
            ? getAlsoAvailableForMintingText(asset)
            : info.extraInformation
      }
    } else {
      // mint is the cheapest, show "available for mint" and the listings range
      info.action = t('asset_card.available_for_mint')
      info.actionIcon = mintingIcon
      info.extraInformation = getAssetListingsRangeInfoText(asset)
    }
  }
  return info
}
