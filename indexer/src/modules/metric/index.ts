import { NFT, Metric } from '../../entities/schema'
import * as addresses from '../contract/addresses'

export const DEFAULT_ID = 'all'

export function buildMetric(): Metric {
  let metric = Metric.load(DEFAULT_ID)

  if (metric == null) {
    metric = new Metric(DEFAULT_ID)
    metric.orders = 0
    metric.parcels = 0
    metric.estates = 0
    metric.wearables_halloween_2019 = 0
    metric.wearables_exclusive_masks = 0
    metric.wearables_xmas_2019 = 0
  }

  return metric as Metric
}

export function buildMetricFromNFT(nft: NFT): Metric {
  let contractAddress = nft.contractAddress.toHexString()
  return buildMetricFromContractAddress(contractAddress)
}

export function buildMetricFromContractAddress(
  contractAddress: string
): Metric {
  let metric = buildMetric()

  if (contractAddress == addresses.Marketplace) {
    metric.orders += 1
  } else if (contractAddress == addresses.LANDRegistry) {
    metric.parcels += 1
  } else if (contractAddress == addresses.EstateRegistry) {
    metric.estates += 1
  } else if (contractAddress == addresses.ERC721Collection_halloween_2019) {
    metric.wearables_halloween_2019 += 1
  } else if (contractAddress == addresses.ERC721Collection_exclusive_masks) {
    metric.wearables_exclusive_masks += 1
  } else if (contractAddress == addresses.ERC721Collection_xmas_2019) {
    metric.wearables_xmas_2019 += 1
  }

  return metric
}
