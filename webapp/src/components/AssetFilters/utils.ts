import { getAnalytics } from 'decentraland-dapps/dist/modules/analytics/utils'
import { BarChartSource } from 'decentraland-ui/lib/components/BarChart/BarChart.types'
import { Section } from '../../modules/vendor/decentraland/routing/types'
import * as events from '../../utils/events'

export const enum AssetFilter {
  Rarity,
  Status,
  Price,
  Collection,
  Creators,
  PlayMode,
  Network,
  BodyShape,
  OnSale,
  OnlySmart,
  More
}

const WearablesFilters = [
  AssetFilter.OnlySmart,
  AssetFilter.Rarity,
  AssetFilter.Status,
  AssetFilter.Price,
  AssetFilter.Network,
  AssetFilter.BodyShape,
  AssetFilter.Collection,
  AssetFilter.Creators,
  AssetFilter.OnSale,
  AssetFilter.More
]

const EmotesFilters = [
  ...WearablesFilters.filter(
    filter =>
      filter !== AssetFilter.BodyShape &&
      filter !== AssetFilter.Network &&
      filter !== AssetFilter.More &&
      filter !== AssetFilter.OnlySmart
  ),
  AssetFilter.PlayMode
]

// TODO: @Filter Improvements: Add LAND ones
export const filtersBySection: Record<string, AssetFilter[]> = {
  [Section.ENS]: [AssetFilter.Price, AssetFilter.More, AssetFilter.OnSale],
  [Section.EMOTES]: EmotesFilters,
  [Section.WEARABLES]: WearablesFilters
}

export const eventsByProperty: Record<string, string> = {
  minPrice: events.MIN_PRICE_CHANGED,
  maxPrice: events.MAX_PRICE_CHANGED,
  minEstateSize: events.MIN_ESTATE_SIZE_CHANGED,
  maxEstateSize: events.MAX_ESTATE_SIZE_CHANGED
}

export function trackBarChartComponentChange(
  filterNames: [string, string],
  value: [string, string],
  source: BarChartSource,
  prevValues: [string, string]
) {
  const analytics = getAnalytics()

  const [filterMinName, filterMaxName] = filterNames
  const [minValue, maxValue] = value
  const [prevMinValue, prevMaxValue] = prevValues
  if (minValue !== prevMinValue) {
    analytics.track(eventsByProperty[filterMinName], {
      value: minValue,
      component: 'BarChart',
      source
    })
  }

  if (maxValue !== prevMaxValue) {
    analytics.track(eventsByProperty[filterMaxName], {
      value: maxValue,
      component: 'BarChart',
      source
    })
  }
}
