import { Section } from '../../modules/vendor/decentraland/routing/types'

export const enum AssetFilter {
  Rarity,
  Price,
  Collection,
  PlayMode,
  Network,
  BodyShape,
  OnSale,
  More
}

const WearablesFilters = [
  AssetFilter.Rarity,
  AssetFilter.Price,
  AssetFilter.Network,
  AssetFilter.BodyShape,
  AssetFilter.Collection,
  AssetFilter.OnSale,
  AssetFilter.More
]

const EmotesFilters = [
  ...WearablesFilters.filter(filter => filter !== AssetFilter.BodyShape && filter !== AssetFilter.Network),
  AssetFilter.PlayMode
]

// TODO: @Filter Improvements: Add LAND ones
export const filtersBySection: Record<string, AssetFilter[]> = {
  [Section.ENS]: [AssetFilter.Price, AssetFilter.More, AssetFilter.OnSale],
  [Section.EMOTES]: EmotesFilters,
  [Section.WEARABLES]: WearablesFilters
}
