import { ContractService as ContractServiceInterface } from '../services'

export class ContractService implements ContractServiceInterface {
  static contractAddresses = {} as const

  contractAddresses = ContractService.contractAddresses

  contractSymbols = {}

  contractNames = {}

  contractCategories = {}
}
