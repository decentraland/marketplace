import { BigNumber, ethers } from 'ethers'
import { MAXIMUM_FRACTION_DIGITS } from 'decentraland-dapps/dist/lib/mana'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Item } from '@dcl/schemas'
import mintingIcon from '../../images/minting.png'
import { getMinimumValueForFractionDigits } from '../../lib/mana'
import { BrowseOptions, SortBy } from '../../modules/routing/types'
import { Mana } from '../Mana'

const ONE_MILLION = 1000000
const ONE_BILLION = 1000000000
const ONE_TRILLION = 1000000000000

export function fomrmatWeiToAssetCard(wei: string): string {
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

  if (value > ONE_TRILLION) {
    return `${(+value / ONE_TRILLION).toLocaleString()}T`
  } else if (value > ONE_BILLION) {
    return `${(+value / ONE_BILLION).toLocaleString()}B`
  } else if (value > ONE_MILLION) {
    return `${(+value / ONE_MILLION).toLocaleString()}M`
  }

  return fixedValue
}

type CatalogCardInformation = {
  action: string
  actionIcon: string | null
  price: string | null
  extraInformation: React.ReactElement | null
}

function getAlsoAvailableForMintingText(asset: Item) {
  return (
    <span>
      {t('asset_card.also_minting')}:&nbsp;
      <Mana size="small" network={asset.network} className="tiniMana">
        {fomrmatWeiToAssetCard(asset.price)}
      </Mana>
    </span>
  )
}

function getAssetListingsRangeInfoText(asset: Item) {
  return asset.minListingPrice && asset.maxListingPrice ? (
    <span className={'wrapBigText'}>
      {t('asset_card.listings', { count: asset.listings })}
      :&nbsp;
      <span>
        <Mana size="small" network={asset.network} className="tiniMana">
          {fomrmatWeiToAssetCard(asset.minListingPrice)}
        </Mana>
        &nbsp;
        {!!asset.listings &&
          asset.listings > 1 &&
          asset.minListingPrice !== asset.maxListingPrice &&
          `- ${fomrmatWeiToAssetCard(asset.maxListingPrice)}`}
      </span>
    </span>
  ) : null
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
      action: t('asset_card.cheapest_option'),
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
        if (appliedFilters.minPrice) {
          const isMintingLessThanMinPriceFilter = BigNumber.from(
            asset.price
          ).lt(ethers.utils.parseUnits(appliedFilters.minPrice))
          info.price =
            isMintingLessThanMinPriceFilter && asset.minListingPrice
              ? asset.minListingPrice
              : asset.price
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
      action: t('asset_card.most_expensive'),
      actionIcon: null,
      price: asset.price,
      extraInformation: getAssetListingsRangeInfoText(asset)
    }
    // has a listing more expensive than the mint
    if (
      asset.maxListingPrice &&
      BigNumber.from(asset.maxListingPrice).gt(BigNumber.from(asset.price))
    ) {
      info.price = asset.maxListingPrice
    }
    return info
  }

  // NEWEST filter
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
        ? `${asset.minListingPrice} - ${asset.maxListingPrice}`
        : asset.minPrice ?? ''
  } else {
    // both mint and listings available

    if (hasRangeApplied) {
      if (appliedFilters.minPrice) {
        const isMintingLessThanMinPriceFilter = BigNumber.from(asset.price).lt(
          ethers.utils.parseUnits(appliedFilters.minPrice)
        )
        info.action = isMintingLessThanMinPriceFilter
          ? t('asset_card.available_listings_in_range')
          : t('asset_card.available_for_mint')
        info.actionIcon = isMintingLessThanMinPriceFilter ? null : mintingIcon
        info.price =
          isMintingLessThanMinPriceFilter && asset.minListingPrice
            ? asset.minListingPrice
            : asset.price
        info.extraInformation = isMintingLessThanMinPriceFilter
          ? getAlsoAvailableForMintingText(asset)
          : null
      }

      if (appliedFilters.maxPrice) {
        const isMintingGreaterThanMaxPrice =
          !!appliedFilters.maxPrice &&
          BigNumber.from(asset.price).gt(
            ethers.utils.parseUnits(appliedFilters.maxPrice)
          )
        if (isMintingGreaterThanMaxPrice && asset.minListingPrice) {
          // out of range, don't show it
          info.action = t('asset_card.available_listings_in_range')
          info.actionIcon = null
          info.price = asset.minListingPrice
          info.extraInformation = null
        }
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
