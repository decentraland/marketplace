import { ethers } from 'ethers'
import { ChainId } from '@dcl/schemas'
import { getNetworkProvider } from 'decentraland-dapps/dist/lib/eth'
import { getConfiguration } from 'decentraland-connect'
import { config } from '../../config'
import { DCLRegistrar__factory } from '../../contracts/factories/DCLRegistrar__factory'

const REGISTRAR_ADDRESS = config.get('REGISTRAR_CONTRACT_ADDRESS', '')

export const PRICE_IN_WEI = '100000000000000000000' // 100 MANA
export const PRICE = ethers.utils.formatEther(PRICE_IN_WEI)
export const MAX_NAME_SIZE = 15
export const MIN_NAME_SIZE = 2

const nameRegex = new RegExp(`^([a-zA-Z0-9]){2,${MAX_NAME_SIZE}}$`)

export function getDomainFromName(name: string): string {
  return `${name.toLowerCase()}.dcl.eth`
}

export async function isNameAvailable(name: string): Promise<boolean> {
  if (!name) {
    return false
  }
  const chainId = Number(config.get('CHAIN_ID')) as ChainId
  const networkProvider = await getNetworkProvider(chainId)
  const configuration = getConfiguration()
  const provider = networkProvider
    ? new ethers.providers.Web3Provider(networkProvider)
    : new ethers.providers.JsonRpcProvider(configuration.network.urls[chainId])
  const contractDCLRegistrar = DCLRegistrar__factory.connect(REGISTRAR_ADDRESS, provider)
  return contractDCLRegistrar.available(name)
}

export function isNameValid(name: string): boolean {
  return nameRegex.test(name)
}

export enum NameInvalidType {
  INVALID_CHARACTERS,
  HAS_SPACES,
  TOO_LONG,
  TOO_SHORT
}

export function getNameInvalidType(name: string): NameInvalidType | null {
  if (isNameValid(name)) {
    return null
  } else if (name.length > MAX_NAME_SIZE) {
    return NameInvalidType.TOO_LONG
  } else if (name.length < MIN_NAME_SIZE) {
    return NameInvalidType.TOO_SHORT
  }
  const hasSpaces = /\s/.test(name)
  return hasSpaces ? NameInvalidType.HAS_SPACES : NameInvalidType.INVALID_CHARACTERS
}

export function hasNameMinLength(name: string): boolean {
  return name.length >= MIN_NAME_SIZE
}
