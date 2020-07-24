import { log } from '@graphprotocol/graph-ts'
import * as categories from './categories'
import * as addresses from '../../data/addresses'

export function getCategory(contractAddress: string): string {
  let category = ''

  if (contractAddress == addresses.LANDRegistry) {
    category = categories.PARCEL
  } else if (contractAddress == addresses.EstateRegistry) {
    category = categories.ESTATE
  } else if (contractAddress == addresses.DCLRegistrar) {
    category = categories.ENS
  } else if (
    contractAddress == addresses.CommunityContestCollection ||
    contractAddress == addresses.DappcraftMoonminerCollection ||
    contractAddress == addresses.DCGCollection ||
    contractAddress == addresses.DCLLaunchCollection ||
    contractAddress == addresses.DGSummer2020Collection ||
    contractAddress == addresses.DgtbleHeadspaceCollection ||
    contractAddress == addresses.ExclusiveMasksCollection ||
    contractAddress == addresses.Halloween2019Collection ||
    contractAddress == addresses.MCHCollection ||
    contractAddress == addresses.Moonshot2020Collection ||
    contractAddress == addresses.PMOuttathisworldCollection ||
    contractAddress == addresses.StaySafeCollection ||
    contractAddress == addresses.WonderzoneMeteorchaserCollection ||
    contractAddress == addresses.Xmas2019Collection
  ) {
    category = categories.WEARABLE
  } else {
    log.warning('Contract address {} not being monitored', [contractAddress])
    category = contractAddress
  }

  return category
}
