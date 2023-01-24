import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { SortBy } from '../../modules/routing/types'
import { MAX_QUERY_SIZE } from '../../modules/vendor/api'

export function getCountText(
  count: number | undefined,
  search: string | undefined
) {
  if (count === undefined) {
    return ''
  } else if (search) {
    return count > 0
      ? t(
          count < MAX_QUERY_SIZE
            ? 'nft_filters.query_results'
            : 'nft_filters.query_more_than_results',
          {
            count: count.toLocaleString(),
            search
          }
        )
      : t('nft_filters.no_items')
  }
  return t(
    count < MAX_QUERY_SIZE
      ? 'nft_filters.results'
      : 'nft_filters.more_than_results',
    {
      count: count.toLocaleString()
    }
  )
}

export function getOrderByOptions(
  onlyOnRent: boolean | undefined,
  onlyOnSale: boolean | undefined
) {
  let orderByDropdownOptions = []
  if (onlyOnRent) {
    orderByDropdownOptions = [
      {
        value: SortBy.RENTAL_LISTING_DATE,
        text: t('filters.recently_listed_for_rent')
      },
      { value: SortBy.NAME, text: t('filters.name') },
      { value: SortBy.NEWEST, text: t('filters.newest') },
      { value: SortBy.MAX_RENTAL_PRICE, text: t('filters.cheapest') }
    ]
  } else {
    orderByDropdownOptions = [
      { value: SortBy.NEWEST, text: t('filters.newest') },
      { value: SortBy.NAME, text: t('filters.name') }
    ]
  }

  if (onlyOnSale) {
    orderByDropdownOptions = [
      {
        value: SortBy.RECENTLY_LISTED,
        text: t('filters.recently_listed')
      },
      {
        value: SortBy.RECENTLY_SOLD,
        text: t('filters.recently_sold')
      },
      {
        value: SortBy.CHEAPEST,
        text: t('filters.cheapest')
      },
      ...orderByDropdownOptions
    ]
  }

  return orderByDropdownOptions
}
