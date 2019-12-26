import { log } from '@graphprotocol/graph-ts'
import * as categories from './categories'
import * as addresses from '../contract/addresses'

export function getCategory(contractAddress: string): string {
  let category = ''

  if (contractAddress == addresses.LANDRegistry) {
    category = categories.PARCEL
  } else if (contractAddress == addresses.EstateRegistry) {
    category = categories.ESTATE
  } else if (
    contractAddress == addresses.ERC721Collection_exclusive_masks ||
    contractAddress == addresses.ERC721Collection_halloween_2019 ||
    contractAddress == addresses.ERC721Collection_xmas_2019
  ) {
    category = categories.WEARABLE
  } else {
    log.warning('Contract address {} not being monitored', [contractAddress])
    category = contractAddress
  }

  return category
}
