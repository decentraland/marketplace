import { Metric } from '../../types/schema'
import * as addresses from '../contract/addresses'

export const DEFAULT_ID = 'all'

export function getMetricEntity(): Metric {
  let metric = Metric.load(DEFAULT_ID)

  if (metric == null) {
    metric = new Metric(DEFAULT_ID)
    metric.parcel = 0
    metric.estate = 0
    metric.wearable_halloween_2019 = 0
    metric.wearable_exclusive_masks = 0
  }

  return metric as Metric
}

export function getUpdatedMetricEntity(contractAddress: string): Metric {
  let metric = getMetricEntity()

  if (contractAddress == addresses.LANDRegistry) {
    metric.parcel += 1
  } else if (contractAddress == addresses.EstateRegistry) {
    metric.estate += 1
  } else if (contractAddress == addresses.ERC721Collection_exclusive_masks) {
    metric.wearable_exclusive_masks += 1
  } else if (contractAddress == addresses.ERC721Collection_halloween_2019) {
    metric.wearable_halloween_2019 += 1
  }

  return metric
}
